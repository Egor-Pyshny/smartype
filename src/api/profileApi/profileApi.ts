import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import {
    GetProfileResponse,
    ILevels,
    IRatingItem,
    ITest,
    QueryFnError,
} from "../../models/types";

type ProfileRequestParams = {
    uid: string;
};

export const profileApi = createApi({
    reducerPath: "profileApi",
    baseQuery: fakeBaseQuery<QueryFnError>(),
    endpoints: (builder) => ({
        getProfileData: builder.query<GetProfileResponse, ProfileRequestParams>(
            {
                async queryFn(params) {
                    try {
                        const { uid } = params;

                        const testsRef = doc(db, "tests", `/${uid}`);
                        let snap = await getDoc(testsRef);
                        const best = snap.data()?.best;

                        let speed = best ? best.speed : 0;
                        let accuracy = best ? best.accuracy : 0;

                        const levelsRef = doc(db, "progress", `/${uid}`);
                        snap = await getDoc(levelsRef);
                        const levels = snap.data()?.passed;
                        const count = levels.length;

                        const responseData: GetProfileResponse = {
                            accuracy,
                            count,
                            speed,
                        };

                        return {
                            data: responseData,
                        };
                    } catch (error: any) {
                        return {
                            error: {
                                message:
                                    "Не удалось получить данные. Ошибка сервера.",
                            },
                        };
                    }
                },
                keepUnusedDataFor: 30,
            }
        ),
        getPassedLevels: builder.query<ILevels[], ProfileRequestParams>({
            async queryFn(params) {
                try {
                    const { uid } = params;
                    const levelsRef = doc(db, "progress", `/${uid}`);
                    let snap = await getDoc(levelsRef);
                    const levels = snap.data()?.passed;
                    const passedLevels = levels.sort(
                        (a: ILevels, b: ILevels) => a.id - b.id
                    ) as ILevels[];

                    return {
                        data: passedLevels,
                    };
                } catch (error: any) {
                    return {
                        error: {
                            message:
                                "Не удалось получить данные. Ошибка сервера.",
                        },
                    };
                }
            },
            keepUnusedDataFor: 30,
        }),
        getUserTests: builder.query<ITest[], ProfileRequestParams>({
            async queryFn(params) {
                try {
                    const { uid } = params;
                    const testsRef = doc(db, "tests", `/${uid}`);
                    let snap = await getDoc(testsRef);
                    const tests = snap.data()?.arr as ITest[];
                    return {
                        data: tests,
                    };
                } catch (error: any) {
                    return {
                        error: {
                            message:
                                "Не удалось получить данные. Ошибка сервера.",
                        },
                    };
                }
            },
            keepUnusedDataFor: 30,
        }),
        getRating: builder.query<IRatingItem[], null>({
            async queryFn() {
                try {
                    const ratingRef = doc(db, "rating", `/rating`);
                    const snap = await getDoc(ratingRef);
                    const ratingList = snap.data()?.results;

                    return {
                        data: ratingList,
                    };
                } catch (error: any) {
                    return {
                        error: {
                            message:
                                "Не удалось получить данные. Ошибка сервера.",
                        },
                    };
                }
            },
            keepUnusedDataFor: 30,
        }),
    }),
});

export const {
    useGetProfileDataQuery,
    useGetPassedLevelsQuery,
    useGetUserTestsQuery,
    useGetRatingQuery,
} = profileApi;
