import { BanlistState, cardInfo, LimitType, setBanlist } from "../store/slices/banlistSlice";
import { store } from "../store/store";

async function ReadBanlistFile(newList?: boolean):Promise<any> {
    const listSrc = newList ? "/ProgressionList.json" : "/PrevProgressionList.json"

    const list = await fetch(process.env.PUBLIC_URL + listSrc, { method: "GET" }).then((response) => response.json())
        .then((json) => { return json })
    return list;
}

async function ParseBanlists() {
    let newList = {}
    await ReadBanlistFile(true).then((response: any) => {newList = response})
    let oldList = {};
    await ReadBanlistFile().then((response: any) => { oldList = response })
    return { newList, oldList }
}
export async function GenerateBanlist() {
    const database = await fetch('https://db.ygoprodeck.com/api/v7/cardinfo.php?startdate=01%2F01%2F1990&enddate=01%2F01%2F2100&dateregion=tcg_date', { method: 'GET' })
        .then((response) => 
            response.json()
        ).catch((err) => console.log(err))
    const { newList, oldList } = await ParseBanlists();

    const banlist: BanlistState = { banned:[], limited:[], semiLimited:[], removed:[] }


    Object.entries(newList).forEach(([key, value]) => {
        //@ts-expect-error typing
        value.forEach((value) => {
            //@ts-expect-error typing
            const dbCard = database && database.data.find(element => element.id == value);
            if (dbCard) {
                //@ts-expect-error
                banlist[key].push({ id: value, name: dbCard.name, type: dbCard.type, status: LimitType[key]})
            }else{
                console.log("Card not found: ", value)
            }
        })
    })

    store.dispatch(setBanlist(banlist));

    console.log(banlist);
    return true;
}
