import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";
import { db, storage } from "../../firebase";
import {
    BestResultsResponse,
    QueryFnError,
    UpdateRatingDto,
    UpdateTestDto,
    UpdateTestRecordDto,
} from "../../models/types";
import { RootState } from "../../store/store";


export const testsApi = createApi({
    reducerPath: "testsApi",
    baseQuery: fakeBaseQuery<QueryFnError>(),
    endpoints: (builder) => ({
        getTestText: builder.query<string, { lang: string }>({
            async queryFn(params) {
                const num = Math.floor(1 + Math.random() * (10 + 1 - 1));
                const storageRef = ref(
                    storage,
                    `tests/${params.lang}/${num}.txt`
                );
                try {
                    const url = await getDownloadURL(storageRef);
                    const response = await fetch(url);
                    const text = await response.text();
                    return {
                        data: text.slice(0, 20),
                    };
                } catch (error: any) {
                    return {
                        error: {
                            message:
                                "Не удалось загрузить текст. Ошибка сервера.",
                        },
                    };
                }
            },
            keepUnusedDataFor: 0,
        }),
        getBestResults: builder.query<BestResultsResponse, { uid: string }>({
            async queryFn(params) {
                try {
                    const testsRef = doc(db, "tests", `${params.uid}/`);
                    const snap = await getDoc(testsRef);
                    const record = snap.data()?.best as BestResultsResponse;
                    return {
                        data: record,
                    };
                } catch (error: any) {
                    return {
                        error: {
                            message:
                                "Не удалось получить рекорд. Ошибка сервера.",
                        },
                    };
                }
            },
            keepUnusedDataFor: 0,
        }),
        updateTestRecord: builder.mutation<boolean, UpdateTestRecordDto>({
            async queryFn(dto, api) {
                try {
                    const { getState } = api;
                    const state = getState() as RootState;
                    let toBeChanged = false;
                    const testsRef = doc(db, "tests", `${dto.uid}/`);
                    const bestSpeed = state.testing.bestSpeed;
                    const bestAccuracy = state.testing.bestAccuracy;

                    const record = {
                        speed: dto.speed,
                        accuracy: dto.accuracy,
                    };

                    if (record.speed < bestSpeed) {
                        record.speed = bestSpeed; // чтобы не изменить значение в бд т.к. там будет больше
                    }
                    if (record.speed > bestSpeed) {
                        toBeChanged = true;
                    }
                    if (record.accuracy < bestAccuracy) {
                        record.accuracy = bestAccuracy; // чтобы не изменить значение в бд т.к. там будет больше
                    }
                    if (record.accuracy > bestAccuracy) {
                        toBeChanged = true;
                    }

                    if (toBeChanged) {
                        updateDoc(testsRef, { best: record });
                    }
                    return {
                        data: true,
                    };
                } catch (error: any) {
                    return {
                        error: {
                            message:
                                "Не удалось обновить рекорд. Ошибка сервера.",
                        },
                    };
                }
            },
        }),
        updateTests: builder.mutation<boolean, UpdateTestDto>({
            async queryFn(testDto) {
                try {
                    const { accuracy, date, speed, uid } = testDto;
                    const testsRef = doc(db, "tests", `${uid}/`);
                    const snap = await getDoc(testsRef);
                    const tests = snap.data()?.arr;
                    tests.push({
                        accuracy,
                        speed,
                        date,
                    });
                    updateDoc(testsRef, { arr: tests });
                    return {
                        data: true,
                    };
                } catch (error: any) {
                    return {
                        error: {
                            message:
                                "Не удалось обновить тесты. Ошибка сервера.",
                        },
                    };
                }
            },
        }),
        updateRating: builder.mutation<boolean, UpdateRatingDto>({
            async queryFn(ratingDto, api) {
                try {
                    const { getState } = api;
                    const state = getState() as RootState;
                    const {accuracy, date, speed, uid} = ratingDto
                    const name = state.user.name;

                    let ratingRef = doc(db, `rating/`, "rating");
                    let snap = await getDoc(ratingRef);
                    const results = snap.data()?.results;
                    let isChanged = false;
                    for (let i = 0; i < results.length; i++) {
                        if (results[i].uid === uid) {
                            isChanged = true;
                            if (results[i].speed < speed) {
                                results[i].accuracy = accuracy;
                                results[i].speed = speed;
                            }
                        }
                    }
                    if (!isChanged) {
                        results.push({
                            uid,
                            username: name,
                            speed,
                            accuracy,
                        });
                    }
                    updateDoc(ratingRef, { results: results });

                    return {
                        data: true,
                    }
                } catch (error: any) {
                    return {
                        error: {
                            message:
                                "Не удалось обновить рейтинг. Ошибка сервера.",
                        },
                    };
                }
            },
        }),
    }),
});

export const {useLazyGetBestResultsQuery, useLazyGetTestTextQuery, useUpdateRatingMutation, useUpdateTestRecordMutation, useUpdateTestsMutation} = testsApi
