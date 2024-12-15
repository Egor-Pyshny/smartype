import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import {
    GoogleAuthProvider,
    User,
    createUserWithEmailAndPassword,
    getAuth,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    updateProfile,
} from "firebase/auth";
import { CreateUserDto, LoginDto, QueryFnError } from "../../models/types";
import { IUser } from "../../store/reducers/UserSlice";

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: fakeBaseQuery<QueryFnError>(),
    endpoints: (builder) => ({
        login: builder.mutation<User, LoginDto>({
            async queryFn(arg) {
                const { email, password } = arg;
                const auth = getAuth();
                try {
                    const userCredential = await signInWithEmailAndPassword(
                        auth,
                        email,
                        password
                    );
                    const user = userCredential.user;

                    return { data: user };
                } catch (error) {
                    return {
                        error: {
                            message: "Неверная почта или пароль",
                        },
                    };
                }
            },
        }),
        loginWithGoogle: builder.mutation<User, null>({
            async queryFn() {
                const provider = new GoogleAuthProvider();
                const auth = getAuth();
                try {
                    const result = await signInWithPopup(auth, provider);
                    const user = result.user;
                    return {
                        data: user,
                    };
                } catch (error: any) {
                    return {
                        error: {
                            message: error.message,
                        },
                    };
                }
            },
        }),
        registration: builder.mutation<IUser, CreateUserDto>({
            async queryFn(userDto) {
                try {
                    const auth = getAuth();
                    const userCredential = await createUserWithEmailAndPassword(
                        auth,
                        userDto.email,
                        userDto.password
                    );
                    const user = userCredential.user;
                    const newUser: IUser = {
                        name: userDto.name,
                        email: userDto.email,
                        img: user.photoURL,
                        coins: 0,
                        uid: user.uid,
                    };
                    updateProfile(user, { displayName: userDto.name });
                    
                    return {
                        data: newUser,
                    };
                } catch (error: any) {
                    const errorCode = error.code;
                    let message = "";
                    if (errorCode === "auth/email-already-in-use") {
                        message = "Пользователь с такой почтой уже существует";
                    }
                    if (errorCode === "auth/weak-password") {
                        message = "Слабый пароль(минимум 6 символов)";
                    }
                    return {
                        error: {
                            message,
                        },
                    };
                }
            },
        }),
        logout: builder.mutation<{succeed: boolean}, null>({
            async queryFn(arg) {
                const auth = getAuth();
                try {
                    await signOut(auth);
                    return {
                        data: {
                            succeed: true,
                        }
                    }
                } catch (error:any) {
                    return {
                        error: {
                            message: 'Ошибка при выходе из аккаунта: '+ error,
                        }
                    }
                }
            },
        }),
    }),
});

export const {
    useLoginMutation,
    useLoginWithGoogleMutation,
    useRegistrationMutation,
    useLogoutMutation
} = authApi;
