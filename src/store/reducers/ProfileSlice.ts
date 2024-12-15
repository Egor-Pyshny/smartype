import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ILevels, IProfile, IRatingItem, ITest, ProductDto } from "../../models/types";

const initialState: IProfile = {
    levelsCount: 0,
    maxTestAccuracy: 0,
    maxTestSpeed: 0,
    passedLevels: [],
    tests: [],
    ratingList: [],
    products: [] as ProductDto[],
    currentProduct: null,
};

type ProfileUserDataType = {
    count: number;
    accuracy: number;
    speed: number;
};

export const profileSlice = createSlice({
    name: "profileSlice",
    initialState,
    reducers: {
        setPassedLevels(state, action: PayloadAction<ILevels[]>) {
            state.passedLevels = action.payload;
        },
        setTests(state, action: PayloadAction<ITest[]>) {
            state.tests = action.payload;
        },
        setRatingList(state, action: PayloadAction<IRatingItem[]>) {
            state.ratingList = action.payload;
        },
        setProfileUserData(state, action: PayloadAction<ProfileUserDataType>) {
            state.levelsCount = action.payload.count;
            state.maxTestAccuracy = action.payload.accuracy;
            state.maxTestSpeed = action.payload.speed;
        },
        setProducts(state, action: PayloadAction<ProductDto[]>){
            state.products = action.payload;
        },
        setCurrentProduct(state, action: PayloadAction<ProductDto | null>){
            state.currentProduct = action.payload;
        },
    },
});

export default profileSlice.reducer;
export const {
    setProfileUserData,
    setPassedLevels,
    setRatingList,
    setTests,
    setProducts,
    setCurrentProduct,
} = profileSlice.actions;
