import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';

export type LimitStatus = 'Forbidden' | 'Limited' | 'Semi-limited' | 'No longer on the list';
export const LimitType: Record<keyof IBanlist, LimitStatus> = {
  banned: 'Forbidden', limited: 'Limited', semiLimited: 'Semi-limited', removed: 'No longer on the list',
};

export interface CardInfo {
  id: string
  name: string
  // TODO these
  type: string
  status: LimitStatus
  prevStatus: LimitStatus | 'New' | ''
}

export interface IBanlist {
  banned: CardInfo[]
  limited: CardInfo[]
  semiLimited: CardInfo[]
  removed: CardInfo[]
}

export interface BanlistState extends IBanlist {
  lastChanged: string
}

const initialBanlistState: BanlistState = {
  banned: [],
  limited: [],
  semiLimited: [],
  removed: [],
  lastChanged: '',
};
export const banlistSlice = createSlice({
  name: 'banlist',
  initialState: initialBanlistState,
  reducers: {
    setBanlist: (state, action: PayloadAction<IBanlist>) => {
      const {
        banned, limited, semiLimited, removed,
      } = action.payload;
      state.banned = banned;
      state.limited = limited;
      state.semiLimited = semiLimited;
      state.removed = removed;
    },
    setLastChanged: (state, action: PayloadAction<string>) => {
      state.lastChanged = action.payload;
    },
    addCard: (state, action: PayloadAction<{
      card: CardInfo,
      section: keyof Pick<BanlistState, 'banned' | 'limited' | 'semiLimited' | 'removed'>
    }>) => {
      const { card, section } = action.payload;
      if (state[section].indexOf(card) !== undefined) {
        state[section].push(card);
      }
    },
    moveCard: (state, action: PayloadAction<{
      card: CardInfo,
      origin: keyof IBanlist,
      target: keyof IBanlist
    }>) => {
      const { card, origin, target } = action.payload;
      if (state[origin].indexOf(card) !== undefined) {
        state[origin].pop();
        if (target !== undefined) {
          state[target].push(card);
        }
      } else {
        console.log('Error: Move called on card not in any list');
      }
    },
  },
});

export const {
  setBanlist, setLastChanged, addCard, moveCard,
} = banlistSlice.actions;

export const selectBanlist = (state: RootState): BanlistState => state.banlist;

export default banlistSlice.reducer;
