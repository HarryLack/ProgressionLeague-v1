import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store';

export type LimitStatus = "Forbidden" | "Limited" | "Semi-limited" | "No longer on the list";
export const LimitType: Record<string,LimitStatus> = {
    "banned": "Forbidden", "limited": "Limited", "semiLimited": "Semi-limited","removed":"No longer on the list"
}
export interface cardInfo {
    id: string,
    name: string,
    //TODO these
    type: string,
    status: LimitStatus,
    prevStatus: LimitStatus | "New" | ""
}

export type BanlistState = {
    banned: cardInfo[],
    limited: cardInfo[],
    semiLimited: cardInfo[],
    removed: cardInfo[],
    lastChanged: Date
}

const initialBanlistState: BanlistState = {
    banned: [],
    limited: [],
    semiLimited: [],
    removed: [],
    lastChanged: new Date(0)
}

export const banlistSlice = createSlice({
    name: 'banlist',
    initialState: initialBanlistState,
    reducers: {
        setBanlist: (state, action) => {
            const { banned, limited, semiLimited, removed } = action.payload
            state.banned = banned;
            state.limited = limited; state.semiLimited = semiLimited;state.removed= removed
        },
        setDate: (state, action: PayloadAction<Date>) => {
            state.lastChanged = action.payload;
        },
        addCard: (state, action: PayloadAction<{ card: cardInfo, section: keyof Pick<BanlistState, "banned"|"limited"|"semiLimited"|"removed"> }>) => {
            const { card, section } = action.payload
            if (!state[section].indexOf(card)) {
                state[section].push(card)
            }
        },
        moveCard: (state, action: PayloadAction<{ card: cardInfo, origin: keyof Pick<BanlistState, "banned" | "limited" | "semiLimited" | "removed">, target?: keyof Pick<BanlistState, "banned" | "limited" | "semiLimited" | "removed"> }>) => {
            const { card, origin, target } = action.payload
            if (state[origin].indexOf(card)) {
                state[origin].pop()
                target && state[target].push(card)
            } else {
                console.log("Error: Move called on card not in any list")
            }
        },
    },
})

export const { setBanlist,setDate, addCard, moveCard } = banlistSlice.actions

export const selectBanlist = (state: RootState) => state.banlist;

export default banlistSlice.reducer