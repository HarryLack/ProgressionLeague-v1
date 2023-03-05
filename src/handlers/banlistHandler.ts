import {
  BanlistState, LimitType, LimitStatus, setBanlist, setDate
} from '../store/slices/banlistSlice'
import { store } from '../store/store'

async function ReadBanlistFile (newList?: boolean): Promise<any> {
  const listSrc = newList === true ? '/lists/new/ProgressionList.json' : '/lists/prev/ProgressionList.json'
  // const listSrc = newList ? "/lists/prev/W3.json" : "/lists/prev/W0.json"

  const list = await fetch(process.env.PUBLIC_URL + listSrc, { method: 'GET' }).then(async (response) => await response.json())
    .then((json) => json)
  return list
}

async function ParseBanlists (): Promise<{ newList: Partial<BanlistState>, oldList: Partial<BanlistState> }> {
  let newList: Partial<BanlistState> = {}
  await ReadBanlistFile(true).then((response: any) => { newList = response })
  let oldList: Partial<BanlistState> = {}
  await ReadBanlistFile().then((response: any) => { oldList = response })
  return { newList, oldList }
}
export async function GenerateBanlist (): Promise<any> {
  const database = await fetch('https://db.ygoprodeck.com/api/v7/cardinfo.php?startdate=01%2F01%2F1990&enddate=01%2F01%2F2100&dateregion=tcg_date', { method: 'GET' })
    .then(async (response) => await response.json()).catch((err) => { console.log(err) })
  const { newList, oldList } = await ParseBanlists()

  const banlist: Partial<BanlistState> = {
    banned: [], limited: [], semiLimited: [], removed: [], lastChanged: ''
  }

  Object.entries(newList).forEach(([key, value]) => {
    if (key === 'lastChanged' && typeof value === 'string') {
      store.dispatch(setDate(value))
    } else {
      // @ts-expect-error fixme
      value.forEach((id) => {
        // @ts-expect-error typing
        const dbCard = database?.data.find((element) => element.id === Number(id))
        if (dbCard !== undefined) {
          const status = key
          let prevStatus
          Object.entries(oldList).forEach(([key, val]) => {
            if (typeof val === 'object' && val.includes(id)) {
              prevStatus = LimitType[key]
            }
          })
          // @ts-expect-error
          banlist[key].push({
            id: value, name: dbCard.name, type: dbCard.type, status: LimitType[status], prevStatus: prevStatus ?? 'New'
          })
        } else {
          console.log('Card not found: ', id)
        }
      })
    }
  })

  Object.entries(oldList).forEach(([key, value]) => {
    if (typeof value === 'object') {
      value.forEach((id) => {
        // @ts-expect-error typing
        const dbCard = database?.data.find((element) => element.id === Number(id))
        if (dbCard !== undefined) {
          let removed = true
          const status = key
          let prevStatus = ''
          Object.entries(newList).forEach(([key, val]) => {
            if (typeof val === 'object' && val.includes(id)) {
              removed = false
            } else {
              prevStatus = LimitType[status]
            }
          })
          if (removed) {
            // @ts-expect-error
            banlist.removed.push({
              // @ts-expect-error
              id: value, name: dbCard.name, type: dbCard.type, status: LimitType.removed, prevStatus: prevStatus as LimitStatus
            })
          }
        } else {
          console.log('Card not found: ', id)
        }
      })
    }
  })

  store.dispatch(setBanlist(banlist))

  return await Promise.resolve(banlist)
}
