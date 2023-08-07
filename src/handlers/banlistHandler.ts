import {
  BanlistState, LimitType, LimitStatus, setBanlist, IBanlist, setLastChanged,
} from '../store/slices/banlistSlice';
import { store } from '../store/store';
import fetchBanlist from './utils';

type CardAPI = {
  id: number;
  name: string;
  type: string;
  frameType: string;
  desc: string;
  atk: number;
  def: number;
  level: number;
  race: string;
  attribute?: string;
  archetype?: string;
};
type YGOPRODeckAPI = {
  data: Array<CardAPI>
};
type ListInput = {
  lastChanged: string,
  banned: Array<string>,
  limited: Array<string>,
  semiLimited: Array<string>,
};

class _BanlistHandler {
  // region variables
  public database: YGOPRODeckAPI | undefined;

  private _banlist: Partial<IBanlist> = {};

  get banlist(): Partial<IBanlist> {
    return this._banlist;
  }

  private currentList: ListInput | undefined;

  private prevList: ListInput | undefined;

  private currentListName: string = '';

  private prevListName: string = '';

  // endregion
  // region functions
  constructor() {
    console.log('Banlist Handler Constructed');
    this.initBanlist();
  }

  private initBanlist() {
    this.getDatabase().then(() => {
      if (this.database) {
        console.log('Database fetched');
        this.setCurrentList('newList');
        this.setPrevList('prevList');
      } else {
        console.error('Database fetch failed');
      }
    });
  }

  private async getDatabase() {
    const db = await fetch('https://db.ygoprodeck.com/api/v7/cardinfo.php?startdate=01%2F01%2F1990&enddate=01%2F01%2F2100&dateregion=tcg_date', { method: 'GET' }).then(async (response) => response.json()).catch((err) => {
      throw new Error(err);
    });
    this.database = db as YGOPRODeckAPI;
  }

  public async generateBanlist() {
    if (!this.currentList || !this.prevList) {
      console.error('List(s) missing for generateBanlist');
      return undefined;
    }

    const banlist: IBanlist = {
      banned: [], limited: [], semiLimited: [], removed: [],
    };

    Object.entries(this.currentList).forEach(([key, value]) => {
      if (key !== 'lastChanged' && typeof value !== 'string') {
        value.forEach((id) => {
          const dbCard = this.database?.data.find((element) => element.id === Number(id));
          if (dbCard !== undefined) {
            let prevStatus;
            Object.entries(this.prevList ?? {}).forEach(([type, val]) => {
              if (typeof val === 'object' && val.includes(id)) {
                prevStatus = LimitType[type as keyof IBanlist];
              }
            });
            banlist[key as keyof IBanlist].push({
              id,
              name: dbCard.name,
              type: dbCard.type,
              status: LimitType[key as keyof IBanlist],
              prevStatus: prevStatus ?? 'New',
            });
          } else {
            console.log('Card not found: ', id);
          }
        });
      }
    });

    Object.entries(this.prevList).forEach(([key, value]) => {
      if (key !== 'lastChanged' && typeof value !== 'string') {
        value.forEach((id) => {
          const dbCard = this.database?.data.find((element) => element.id === Number(id));
          if (dbCard !== undefined) {
            let removed = true;
            const status = key as keyof IBanlist;
            let prevStatus = '';
            Object.entries(this.currentList ?? {}).forEach(([, val]) => {
              if (typeof val === 'object' && val.includes(id)) {
                removed = false;
              } else {
                prevStatus = LimitType[status];
              }
            });
            if (removed) {
              banlist.removed.push({
                id,
                name: dbCard.name,
                type: dbCard.type,
                status: LimitType.removed,
                prevStatus: prevStatus as LimitStatus,
              });
            }
          } else {
            console.log('Card not found: ', id);
          }
        });
      }
    });

    this._banlist = banlist;
    store.dispatch(setBanlist(banlist));
    store.dispatch(setLastChanged(this.currentList.lastChanged));
    return banlist;
  }

  public setCurrentList(listName: string) {
    if (listName !== this.currentListName) {
      fetchBanlist(listName).then((list) => {
        this.currentList = list;
        this.generateBanlist();
      });
    }
  }

  public setPrevList(listName: string) {
    if (listName !== this.prevListName) {
      fetchBanlist(listName).then((list) => {
        this.prevList = list;
        this.generateBanlist();
      });
    }
  }

  // endregion

  // region utils
  public getListInputs() {
    return { current: this.currentList, prev: this.prevList };
  }

  // endregion
}

async function ReadBanlistFile(newList?: boolean): Promise<any> {
  const listSrc = newList === true ? 'lists/new/ProgressionList.json' : 'lists/prev/ProgressionList.json';
  const list = await fetch(__webpack_public_path__ + listSrc, { method: 'GET' }).then(async (response) => response.json())
    .then((json) => json);
  return list;
}

async function ParseBanlists(): Promise<{ newList: Partial<BanlistState>, oldList: Partial<BanlistState> }> {
  let newList: Partial<BanlistState> = {};
  await ReadBanlistFile(true).then((response: any) => {
    newList = response;
  });
  let oldList: Partial<BanlistState> = {};
  await ReadBanlistFile().then((response: any) => {
    oldList = response;
  });
  return { newList, oldList };
}

export async function GenerateBanlist(): Promise<any> {
  const database = await fetch('https://db.ygoprodeck.com/api/v7/cardinfo.php?startdate=01%2F01%2F1990&enddate=01%2F01%2F2100&dateregion=tcg_date', { method: 'GET' })
    .then(async (response) => response.json()).catch((err) => {
      console.log(err);
    }) as YGOPRODeckAPI;
  const { newList, oldList } = await ParseBanlists();

  const banlist: Omit<BanlistState, 'loaded'> = {
    banned: [], limited: [], semiLimited: [], removed: [], lastChanged: '',
  };

  Object.entries(newList).forEach(([section, value]) => {
    if (section === 'lastChanged' && typeof value === 'string') {
      store.dispatch(setLastChanged(value));
    } else if (typeof value === 'object') {
      value.forEach((id) => {
        const dbCard = database?.data.find((element) => element.id === Number(id));
        if (dbCard !== undefined) {
          const status = section as keyof IBanlist;
          let prevStatus;
          Object.entries(oldList).forEach(([key, val]) => {
            if (typeof val === 'object' && val.includes(id)) {
              prevStatus = LimitType[key as keyof IBanlist];
            }
          });
          banlist[section].push({
            id,
            name: dbCard.name,
            type: dbCard.type,
            status: LimitType[status],
            prevStatus: prevStatus ?? 'New',
          });
        } else {
          console.log('Card not found: ', id);
        }
      });
    }
  });

  Object.entries(oldList).forEach(([key, value]) => {
    if (typeof value === 'object') {
      value.forEach((id) => {
        const dbCard = database?.data.find((element) => element.id === Number(id));
        if (dbCard !== undefined) {
          let removed = true;
          const status = key as keyof IBanlist;
          let prevStatus = '';
          Object.entries(newList).forEach(([, val]) => {
            if (typeof val === 'object' && val.includes(id)) {
              removed = false;
            } else {
              prevStatus = LimitType[status];
            }
          });
          if (removed) {
            banlist.removed.push({
              // @ts-expect-error
              id,
              name: dbCard.name,
              type: dbCard.type,
              status: LimitType.removed,
              prevStatus: prevStatus as LimitStatus,
            });
          }
        } else {
          console.log('Card not found: ', id);
        }
      });
    }
  });

  store.dispatch(setBanlist(banlist));

  return banlist;
}

export const BanlistHandler = new _BanlistHandler();
