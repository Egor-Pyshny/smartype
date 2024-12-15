import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ITestSlice } from "../../models/types";

const initialState: ITestSlice = {
    lang: "ru",
    text: "",
    isLoading: false,
    delta: 0,
    error: "",
    bestSpeed: 0,
    bestAccuracy: 0,
};
export const testSlice = createSlice({
    name: "singleLevelSlice",
    initialState,
    reducers: {
        setTestText(state, action: PayloadAction<string>) {
            state.text = action.payload;
        },
        setLang(state, action: PayloadAction<string>) {
            state.lang = action.payload;
        },
        setBestSpeed(state, action: PayloadAction<number>) {
            state.bestSpeed = action.payload;
        },
        setBestAccuracy(state, action: PayloadAction<number>) {
            state.bestAccuracy = action.payload;
        },
        setTestDelta(state, action: PayloadAction<number>) {
            state.delta = action.payload;
        },
    },
   
});

export default testSlice.reducer;
export const { setTestText, setLang, setBestAccuracy, setBestSpeed, setTestDelta } = testSlice.actions;
