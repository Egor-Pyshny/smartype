import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { DocumentData, doc, getDoc, updateDoc } from "firebase/firestore";
import {
    getDownloadURL,
    ref,
    uploadBytes
} from "firebase/storage";
import { db, storage } from "../../firebase";
import {
    CreateLevelDto,
    ICusomLevel,
    ILevels,
    IPractice,
    QueryFnError,
    UpdateCustomLevelDto,
    UpdateLevel,
    UpdatePractice,
    UpdateProgress,
} from "../../models/types";
import { RootState } from "../../store/store";

type ExtraOptions = {
    getState: () => RootState;
};

export const levelsApi = createApi({
    reducerPath: "levelsApi",
    baseQuery: fakeBaseQuery<QueryFnError>(),
    endpoints: (builder) => ({
        getLevels: builder.query<ILevels[], { uid: string; lang: string }>({
            async queryFn(params) {
                try {
                    const levelsRef = doc(db, "levels/", `${params.uid}`);
                    const snap = await getDoc(levelsRef);
                    const levelsArr = snap.data() as DocumentData;

                    return {
                        data: levelsArr[params.lang] as ILevels[],
                    };
                } catch (error: any) {
                    return {
                        error: {
                            message: "При загрузке уровней произошла ошибка",
                        },
                    };
                }
            },
            keepUnusedDataFor: 0,
        }),
        getPracticeLevels: builder.query<IPractice[], { uid: string }>({
            async queryFn(params) {
                try {
                    const levelsRef = doc(db, "practice/", `${params.uid}`);
                    const snap = await getDoc(levelsRef);
                    const levelsArr = snap.data() as DocumentData;

                    return {
                        data: levelsArr.practiceArr as IPractice[],
                    };
                } catch (error: any) {
                    return {
                        error: {
                            message:
                                "При загрузке уровней практики произошла ошибка",
                        },
                    };
                }
            },
            keepUnusedDataFor: 0,
        }),
        getCustomLevels: builder.query<ICusomLevel[], { uid: string }>({
            async queryFn(params) {
                try {
                    const levelsRef = doc(db, "customLevels/", `${params.uid}`);
                    const snap = await getDoc(levelsRef);
                    const levelsArr = snap.data() as DocumentData;

                    return {
                        data: levelsArr.customLevels as ICusomLevel[],
                    };
                } catch (error: any) {
                    return {
                        error: {
                            message:
                                "При загрузке уровней практики произошла ошибка",
                        },
                    };
                }
            },
            keepUnusedDataFor: 0,
        }),
        createLevel: builder.mutation<boolean, CreateLevelDto>({
            async queryFn(levelDto, api) {
                try {
                    const state = api.getState() as RootState;
                    const { name, content } = levelDto;
                    const uid = state.user.uid;
                    let customLevelsRef = doc(
                        db,
                        "customLevels/",
                        `${uid as string}`
                    );
                    let snap = await getDoc(customLevelsRef);
                    const customLevels = snap.data()
                        ?.customLevels as ICusomLevel[];
                    for (const level of customLevels) {
                        if (level.name === name) {
                            throw new Error(
                                "Уровень с таким названием у Вас уже есть."
                            );
                        }
                    }
                    let id = 1;
                    if (customLevels.length !== 0) {
                        id = customLevels[customLevels.length - 1].id + 1;
                    }
                    customLevels.push({
                        id,
                        accuracy: 0,
                        speed: 0,
                        name,
                        time: "0:00",
                    });
                    updateDoc(customLevelsRef, { customLevels: customLevels });

                    const storageRef = ref(
                        storage,
                        `custom/${uid as string}/${name}.txt`
                    );
                    const fileContent = content;

                    const fileData = new Blob([fileContent], {
                        type: "text/plain",
                    });

                    await uploadBytes(storageRef, fileData);

                    return {
                        data: true,
                    };
                } catch (error: any) {
                    const errorMessage = String(error.message).includes(
                        "у Вас уже есть."
                    )
                        ? "Уровень с таким названием у Вас уже есть."
                        : "При создании уровня произошла ошибка";
                    return {
                        error: {
                            message: errorMessage,
                        },
                    };
                }
            },
        }),
        getCustomLevelText: builder.query<
            string,
            { uid: string; name: string }
        >({
            async queryFn(params) {
                try {
                    const storageRef = ref(
                        storage,
                        `custom/${params.uid}/${params.name}.txt`
                    );
                    const url = await getDownloadURL(storageRef);
                    let response = await fetch(url);

                    const text = await response.text();

                    return { data: text };
                } catch (error: any) {
                    return {
                        error: {
                            message:
                                "Не удалось получть текст. Ошибка сервера.",
                        },
                    };
                }
            },
        }),
        updateCustomLevel: builder.mutation<boolean, UpdateCustomLevelDto>({
            async queryFn(customLvlDto, api) {
                try {
                    const state = api.getState() as RootState;
                    const uid = state.user.uid;
                    const { accuracy, speed, time, id } = customLvlDto;
                    //Обновление данных об уровне в пользователе
                    const customLvlRef = doc(db, "customLevels", `/${uid}`);
                    const snap = await getDoc(customLvlRef);
                    const customLevels = snap.data()
                        ?.customLevels as ICusomLevel[];
                    if (customLevels) {
                        for (let i = 0; i < customLevels.length; i++) {
                            if (customLevels[i].id === id) {
                                customLevels[i].accuracy = accuracy;
                                customLevels[i].speed = speed;
                                customLevels[i].time = time;
                            }
                        }
                        updateDoc(customLvlRef, { customLevels: customLevels });
                    }

                    return {
                        data: true,
                    };
                } catch (error: any) {
                    return {
                        error: {
                            message:
                                "При обновлении пользовательского уровня произошла ошибка.",
                        },
                    };
                }
            },
        }),
        getSingleLevelText: builder.query<
            string,
            { lang: string; symbols: string }
        >({
            async queryFn(params) {
                try {
                    const storageRef = ref(
                        storage,
                        `levels/${params.lang}/${params.symbols}.txt`
                    );
                    const url = await getDownloadURL(storageRef);
                    let response = await fetch(url);

                    const text = await response.text();
                    return { data: text.slice(0, 10) };
                } catch (error: any) {
                    return {
                        error: {
                            message:
                                "Не удалось получть текст. Ошибка сервера.",
                        },
                    };
                }
            },
        }),
        getPracticeLevelText: builder.query<string, { lang: string }>({
            async queryFn(params) {
                try {
                    const n = Math.floor(1 + Math.random() * (2 + 1 - 1));
                    const storageRef = ref(
                        storage,
                        `practice/${params.lang}${n}.txt`
                    );
                    const url = await getDownloadURL(storageRef);
                    let response = await fetch(url);
                    const text = await response.text();
                    return {
                        data: text.slice(0, 20),
                    };
                } catch (error: any) {
                    return {
                        error: {
                            message:
                                "Не удалось получть текст. Ошибка сервера.",
                        },
                    };
                }
            },
            keepUnusedDataFor: 0,
        }),
        updateLevels: builder.mutation<boolean, UpdateLevel>({
            async queryFn(levelDto) {
                try {
                    const {
                        uid,
                        layoutLang,
                        id,
                        accuracy,
                        count,
                        speed,
                        symb,
                        time,
                    } = levelDto;
                    //Обновление данных об уровне в пользователе
                    const levelsRef = doc(db, "levels", `/${uid}`);
                    const snap = await getDoc(levelsRef);
                    const snapData = snap.data();
                    if (snapData) {
                        const levels = snapData[layoutLang];
                        const data: ILevels = {
                            symb,
                            accuracy,
                            count,
                            speed,
                            time,
                            id,
                        };
                        for (let i = 0; i < levels.length; i++) {
                            if (levels[i].id === id) {
                                levels[i].accuracy = data.accuracy;
                                levels[i].speed = data.speed;
                                levels[i].time = data.time;
                                levels[i].count = data.count + 1;
                            }
                        }
                        updateDoc(levelsRef, { [layoutLang]: levels });
                    }

                    return {
                        data: true,
                    };
                } catch (error: any) {
                    return {
                        error: {
                            message: "При обновлении данных произошла ошибка.",
                        },
                    };
                }
            },
        }),
        updateProgress: builder.mutation<boolean, UpdateProgress>({
            async queryFn(levelDto) {
                try {
                    const { uid, id, accuracy, count, speed, symb, time } =
                        levelDto;
                    //Обновление данных об уровне в пользователе
                    const progressRef = doc(db, "progress", `/${uid}`);
                    const snap = await getDoc(progressRef);
                    const passedLvls = snap.data()?.passed;
                    let isChanged = false;
                    for (let i = 0; i < passedLvls.length; i++) {
                        if (passedLvls[i].symb === symb) {
                            isChanged = true;
                            passedLvls[i].accuracy = accuracy;
                            passedLvls[i].speed = speed;
                            passedLvls[i].time = time;
                            passedLvls[i].count = count + 1;
                        }
                    }
                    if (!isChanged) {
                        passedLvls.push({
                            symb,
                            accuracy,
                            count: count + 1,
                            speed,
                            time,
                            id,
                        });
                    }
                    updateDoc(progressRef, { passed: passedLvls });
                    return {
                        data: true,
                    };
                } catch (error: any) {
                    return {
                        error: {
                            message:
                                "При обновлении прогресса произошла ошибка.",
                        },
                    };
                }
            },
        }),
        updatePractice: builder.mutation<boolean, UpdatePractice>({
            async queryFn(praticeDto) {
                try {
                    const { accuracy, lang, speed, time, uid } = praticeDto;
                    //Обновление данных об уровне в пользователе
                    const practiceRef = doc(db, "practice", `/${uid}`);
                    const snap = await getDoc(practiceRef);
                    const snapData = snap.data();
                    if (snapData) {
                        const levels = snapData.practiceArr;
                        for (let i = 0; i < levels.length; i++) {
                            if (levels[i].lang === lang) {
                                levels[i].accuracy = accuracy;
                                levels[i].speed = speed;
                                levels[i].time = time;
                            }
                        }
                        updateDoc(practiceRef, { practiceArr: levels });
                    }

                    return {
                        data: true,
                    };
                } catch (error: any) {
                    return {
                        error: {
                            message:
                                "При обновлении уровней практики произошла ошибка.",
                        },
                    };
                }
            },
        }),
    }),
});

export const {
    useGetLevelsQuery,
    useLazyGetLevelsQuery,
    useGetPracticeLevelsQuery,
    useLazyGetSingleLevelTextQuery,
    useLazyGetPracticeLevelTextQuery,
    useUpdateLevelsMutation,
    useUpdateProgressMutation,
    useUpdatePracticeMutation,
    useGetCustomLevelsQuery,
    useLazyGetCustomLevelTextQuery,
    useCreateLevelMutation,
    useUpdateCustomLevelMutation,
} = levelsApi;
