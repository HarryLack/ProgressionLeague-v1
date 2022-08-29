import { BanlistState, cardInfo, LimitType, setBanlist } from "../store/slices/banlistSlice";
import { store } from "../store/store";

async function ReadBanlistFile(newList?: boolean):Promise<any> {
    const listSrc = newList ? "/lists/new/ProgressionList.json" : "/lists/prev/ProgressionList.json"

    const list = await fetch(process.env.PUBLIC_URL + listSrc, { method: "GET" }).then((response) => response.json())
        .then((json) => { return json })
    return list;
}

async function ParseBanlists() {
    let newList: Partial<Omit<BanlistState,"lastChanged">> = {}
    await ReadBanlistFile(true).then((response: any) => {newList = response})
    let oldList: Partial<Omit<BanlistState, "lastChanged">> = {};
    await ReadBanlistFile().then((response: any) => { oldList = response })
    return { newList, oldList }
}
export async function GenerateBanlist() {
    const database = await fetch('https://db.ygoprodeck.com/api/v7/cardinfo.php?startdate=01%2F01%2F1990&enddate=01%2F01%2F2100&dateregion=tcg_date', { method: 'GET' })
        .then((response) => 
            response.json()
        ).catch((err) => console.log(err))
    const { newList, oldList } = await ParseBanlists();
    const lastModified = await fetch(process.env.PUBLIC_URL + "/lists/new/ProgressionList.json").then((response) => { return response.headers.get("Last-Modified") })

    const banlist: Partial<BanlistState> = { banned: [], limited: [], semiLimited: [], removed: [], lastChanged: lastModified ? new Date(lastModified) : new Date(0) }


    Object.entries(newList).forEach(([key, value]) => {
        value.forEach((id) => {
            //@ts-expect-error typing
            const dbCard = database && database.data.find(element => element.id == id);
            if (dbCard) {
                const status = key
                let prevStatus = "";
                if (!oldList?.[key as keyof Omit<BanlistState, "lastChanged">]?.includes(id)) {
                    Object.entries(oldList).forEach(([key, value]) => {
                        if (key !== status && value.includes(id)) {
                            prevStatus = LimitType[key]
                        } else {
                            prevStatus = "New";
                        }
                    })
                }
                //@ts-expect-error
                banlist[key].push({ id: value, name: dbCard.name, type: dbCard.type, status: LimitType[status], prevStatus: prevStatus })
            }else{
                console.log("Card not found: ", id)
            }
        })
    })

    Object.entries(oldList).forEach(([key, value]) => {
        value.forEach((id) => {
            //@ts-expect-error typing
            const dbCard = database && database.data.find(element => element.id == id);
            if (dbCard) {
                const status = key;
                let prevStatus = "";
                if (!newList?.[key as keyof Omit<BanlistState, "lastChanged">]?.includes(id)) {
                    Object.entries(newList).forEach(([key, value]) => {
                        if (value.includes(id)) {

                        } else {
                            prevStatus = LimitType[status]
                        }
                    })
                }
                if (prevStatus) {
                    //@ts-expect-error
                    banlist.removed.push({ id: value, name: dbCard.name, type: dbCard.type, status: LimitType["removed"], prevStatus: prevStatus })
                }
            } else {
                console.log("Card not found: ", id)
            }
        })
    })

    store.dispatch(setBanlist(banlist));

    return true;
}
