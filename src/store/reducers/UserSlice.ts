import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { MarketHistory, PacmanForm } from "../../models/types";
export interface IUser {
    name: string | null;
    email: string | null;
    img: string | null;
    coins: number;
    uid: string | null;
}

export type PacmanSettings = {
    pacmanType: PacmanForm;
    pacmanColor: string;
};

const initialState: IUser & PacmanSettings & MarketHistory = {
    name: null,
    email: null,
    img: null,
    coins: 0,
    uid: null,
    pacmanColor: "",
    pacmanType: "",
    colors: [],
    pacmans: [],
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser(state, action: PayloadAction<IUser>) {
            state.name = action.payload.name;
            state.email = action.payload.email;
            state.img = action.payload.img;
            state.uid = action.payload.uid;
        },
        setCoins(state, action: PayloadAction<number>) {
            state.coins = action.payload;
        },
        removeUser(state) {
            state.name = null;
            state.email = null;
            state.img = null;
            state.uid = null;
        },
        setPacmanColor(state, action: PayloadAction<string>) {
            state.pacmanColor = action.payload;
        },
        setPacmanType(state, action: PayloadAction<PacmanForm>) {
            state.pacmanType = action.payload;
        },
        setMarketHistory(state, action: PayloadAction<MarketHistory>) {
            state.colors = action.payload.colors;
            state.pacmans = action.payload.pacmans;
        },
        addColorToHistory(state, action: PayloadAction<string>) {
            state.colors.push(action.payload);
        },
        addPacmanToHistory(state, action: PayloadAction<PacmanForm>){
            state.pacmans.push(action.payload);
        },
    },
});

export default userSlice.reducer;
export const {
    setUser,
    removeUser,
    setCoins,
    setPacmanColor,
    setPacmanType,
    setMarketHistory,
    addColorToHistory,
    addPacmanToHistory,
} = userSlice.actions;
