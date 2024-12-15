import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ISingleLevel } from "../../models/types";

const initialState: ISingleLevel = {
    isCustom: false,
    isPractice: false,
    symbols: "",
    lang: "",
    short: "",
    textToWrite: "",
    writtenText: "",
    isLoading: false,
    delta: 0,
    error: "",
    lvlId: 0,
    count: 0,
};
export const singleLevelSlice = createSlice({
    name: "singleLevelSlice",
    initialState,
    reducers: {
        setTextToWrite(state, action: PayloadAction<string>) {
            state.textToWrite = action.payload;
        },
        setWrittenText(state, action: PayloadAction<string>) {
            state.writtenText = action.payload;
        },
        setSymbols(state, action: PayloadAction<string>) {
            state.symbols = action.payload;
        },
        setLevelId(state, action: PayloadAction<number>) {
            state.lvlId = action.payload;
        },
        setShortLang(state, action: PayloadAction<string>) {
            state.short = action.payload;
        },
        setLanguage(state, action: PayloadAction<string>) {
            state.lang = action.payload;
        },
        setCount(state, action: PayloadAction<number>) {
            state.count = action.payload;
        },
        setDelta(state, action: PayloadAction<number>) {
            state.delta = action.payload;
        },
        setIsCustom(state, action: PayloadAction<boolean>) {
            state.isCustom = action.payload;
        },
        setIsPractice(state, action: PayloadAction<boolean>) {
            state.isPractice = action.payload;
        },
        resetLevelData(state) {
            state.count = 0;
            state.delta = 0;
            state.error = "";
            state.isLoading = false;
            state.isPractice = false;
            state.lang = "";
            state.lvlId = 0;
            state.short = "";
            state.symbols = "";
            state.textToWrite = "";
            state.writtenText = "";
        },
    },
});

export default singleLevelSlice.reducer;
export const {
    resetLevelData,
    setCount,
    setLanguage,
    setShortLang,
    setSymbols,
    setTextToWrite,
    setWrittenText,
    setLevelId,
    setDelta,
    setIsCustom,
    setIsPractice,
} = singleLevelSlice.actions;
