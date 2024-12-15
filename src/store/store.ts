import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { reducer as formReducer } from 'redux-form';
import { authApi } from "../api/authApi/authApi";
import { levelsApi } from "../api/levelsApi/levelsApi";
import { marketApi } from "../api/marketApi/marketApi";
import { profileApi } from "../api/profileApi/profileApi";
import { testsApi } from "../api/testsApi/testsApi";
import { userApi } from "../api/userApi/userApi";
import faqReducer from "./reducers/FaqSlice";
import LevelsPageSlice from "./reducers/LevelsPageSlice";
import profileReducer from "./reducers/ProfileSlice";
import SingleLevelReducer from "./reducers/SingleLevelSclice";
import testReducer from "./reducers/TestSclice";
import UserSlice from "./reducers/UserSlice";

const rootReducer = combineReducers({
    levelsPage: LevelsPageSlice,
    singleLevel: SingleLevelReducer,
    testing: testReducer,
    user: UserSlice,
    profilePage: profileReducer,
    theoryFaq: faqReducer,
    form: formReducer,
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [levelsApi.reducerPath]: levelsApi.reducer,
    [testsApi.reducerPath]: testsApi.reducer,
    [profileApi.reducerPath]: profileApi.reducer,
    [marketApi.reducerPath]: marketApi.reducer,
});

export const store = configureStore({
    devTools: true,
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(authApi.middleware)
            .concat(userApi.middleware)
            .concat(levelsApi.middleware)
            .concat(testsApi.middleware)
            .concat(profileApi.middleware)
            .concat(marketApi.middleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
