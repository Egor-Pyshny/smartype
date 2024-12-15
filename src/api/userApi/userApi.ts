import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import {
    MarketHistory,
    QueryFnError,
    UpdateCoinsDto,
    UpdatePacmanColorDto,
    UpdatePacmanTypeDto,
    UserDbInitialization,
} from "../../models/types";
import { IUser, PacmanSettings } from "../../store/reducers/UserSlice";

export const userApi = createApi({
    reducerPath: "userApi",
    baseQuery: fakeBaseQuery<QueryFnError>(),
    endpoints: (builder) => ({
        checkExists: builder.query<boolean, string>({
            async queryFn(uid) {
                try {
                    const docRef = doc(db, "users/", uid);
                    const docSnap = await getDoc(docRef);
                    return {
                        data: docSnap.exists(),
                    };
                } catch (error) {
                    return {
                        error: {
                            message: "Что-то пошло не так. Повторите ещё раз.",
                        },
                    };
                }
            },
        }),
        createNewUser: builder.mutation<{ succeed: boolean }, IUser>({
            async queryFn(userDto) {
                try {
                    const newUser: UserDbInitialization = {
                        ...userDto,
                        pacmanColor: "#f2d648",
                        pacmanType: "circle",
                        marketHistory: {
                            colors: [],
                            pacmans: [],
                        },
                    };
                    // creating user
                    const userRef = doc(db, "users/", userDto.uid as string);
                    setDoc(userRef, newUser);

                    // inintializing user
                    //Добавление русских уровней
                    const userRuLevelsRef = doc(db, `ruLessons/`, "symbols");
                    const ruLevelsSnap = await getDoc(userRuLevelsRef);
                    const ruSymbols = ruLevelsSnap.data()?.arr;
                    let ref = doc(db, "levels", `${userDto.uid}/`);
                    let levelsArr = [];
                    for (let i = 0; i < ruSymbols.length; i++) {
                        const level = {
                            symb: ruSymbols[i],
                            count: 0,
                            time: "0:00",
                            speed: 0,
                            accuracy: 0,
                            id: i + 1,
                        };
                        levelsArr.push(level);
                    }
                    setDoc(ref, { ru: levelsArr });

                    //Добавление английских уровней
                    const userEnLevelsRef = doc(db, `enLessons/`, "symbols");
                    const enLevelsSnap = await getDoc(userEnLevelsRef);
                    const enSymbols = enLevelsSnap.data()?.arr;
                    ref = doc(db, "levels", `${userDto.uid}/`);
                    levelsArr = [];
                    for (let i = 0; i < enSymbols.length; i++) {
                        const level = {
                            symb: enSymbols[i],
                            count: 0,
                            time: "0:00",
                            speed: 0,
                            accuracy: 0,
                            id: i + 1,
                        };
                        levelsArr.push(level);
                    }
                    updateDoc(ref, { en: levelsArr });

                    //Добавление практики
                    const userPracticeRef = doc(
                        db,
                        `practiceLessons/`,
                        "settings"
                    );
                    const practiceSnap = await getDoc(userPracticeRef);
                    const prLevels = practiceSnap.data()?.arr;
                    ref = doc(db, "practice", `${userDto.uid}/`);
                    levelsArr = [];
                    for (let i = 0; i < prLevels.length; i++) {
                        const obj = {
                            lang: prLevels[i].name,
                            short: prLevels[i].short,
                            time: "0:00",
                            speed: 0,
                            accuracy: 0,
                        };
                        levelsArr.push(obj);
                    }
                    setDoc(ref, { practiceArr: levelsArr });

                    //Добавление тестов
                    ref = doc(db, "tests", `${userDto.uid}/`);
                    setDoc(ref, { arr: [] });

                    //Добавление прогресса по уровням
                    ref = doc(db, "progress", `${userDto.uid}/`);
                    setDoc(ref, { passed: [] });

                    //Добавление тестов
                    ref = doc(db, "customLevels", `${userDto.uid}/`);
                    setDoc(ref, { customLevels: [] });

                    return {
                        data: {
                            succeed: true,
                        },
                    };
                } catch (error) {
                    return {
                        error: {
                            message: "Что-то пошло не так. Повторите ещё раз.",
                        },
                    };
                }
            },
        }),
        getUserCoins: builder.query<number, string>({
            async queryFn(uid) {
                try {
                    const docRef = doc(db, "users/", uid);
                    const docSnap = await getDoc(docRef);
                    const coins = docSnap.data()?.coins as number;
                    return {
                        data: coins,
                    };
                } catch (error) {
                    return {
                        error: {
                            message: "Что-то пошло не так. Повторите ещё раз.",
                        },
                    };
                }
            },
        }),
        updateUserCoins: builder.mutation<boolean, UpdateCoinsDto>({
            async queryFn(params) {
                try {
                    const docRef = doc(db, "users/", params.uid);
                    updateDoc(docRef, { coins: params.coins });
                    return {
                        data: true,
                    };
                } catch (error) {
                    return {
                        error: {
                            message: "Что-то пошло не так. Повторите ещё раз.",
                        },
                    };
                }
            },
        }),
        updateUserPacmanColor: builder.mutation<boolean, UpdatePacmanColorDto>({
            async queryFn(dto) {
                try {
                    const docRef = doc(db, "users/", dto.uid);
                    updateDoc(docRef, { pacmanColor: dto.color });
                    return {
                        data: true,
                    };
                } catch (error) {
                    return {
                        error: {
                            message: "Что-то пошло не так. Повторите ещё раз.",
                        },
                    };
                }
            },
        }),
        updateUserPacmanType: builder.mutation<boolean, UpdatePacmanTypeDto>({
            async queryFn(dto) {
                try {
                    const docRef = doc(db, "users/", dto.uid);
                    updateDoc(docRef, { pacmanType: dto.pacmanType });
                    return {
                        data: true,
                    };
                } catch (error) {
                    return {
                        error: {
                            message: "Что-то пошло не так. Повторите ещё раз.",
                        },
                    };
                }
            },
        }),
        getUserPacmanSettings: builder.query<PacmanSettings, { uid: string }>({
            async queryFn({ uid }) {
                try {
                    const docRef = doc(db, "users/", uid);
                    const docSnap = await getDoc(docRef);
                    const data = docSnap.data() as UserDbInitialization;
                    const pacmanSettings: PacmanSettings = {
                        pacmanColor: data.pacmanColor,
                        pacmanType: data.pacmanType,
                    };
                    return {
                        data: pacmanSettings,
                    };
                } catch (error) {
                    return {
                        error: {
                            message: "Что-то пошло не так. Повторите ещё раз.",
                        },
                    };
                }
            },
        }),
        getUserMarketHistory: builder.query<MarketHistory, { uid: string }>({
            async queryFn({ uid }) {
                try {
                    const docRef = doc(db, "users/", uid);
                    const docSnap = await getDoc(docRef);
                    const data = docSnap.data() as UserDbInitialization;
                    
                    const marketHistory: MarketHistory = {
                        colors: data.marketHistory.colors,
                        pacmans: data.marketHistory.pacmans,
                    };
                    return {
                        data: marketHistory,
                    };
                } catch (error) {
                    return {
                        error: {
                            message: "Что-то пошло не так. Повторите ещё раз.",
                        },
                    };
                }
            },
        }),
    }),
});

export const {
    useLazyCheckExistsQuery,
    useCreateNewUserMutation,
    useGetUserCoinsQuery,
    useLazyGetUserCoinsQuery,
    useUpdateUserCoinsMutation,
    useGetUserPacmanSettingsQuery,
    useGetUserMarketHistoryQuery,
    useUpdateUserPacmanColorMutation,
    useUpdateUserPacmanTypeMutation,
} = userApi;
