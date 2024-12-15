import { FC, useState } from "react";
import { ColorRing } from "react-loader-spinner";
import { Link, useNavigate } from "react-router-dom";
import { Field, InjectedFormProps, reduxForm } from "redux-form";
import {
    useLoginMutation,
    useLoginWithGoogleMutation,
} from "../../api/authApi/authApi";
import {
    useCreateNewUserMutation,
    useLazyCheckExistsQuery,
} from "../../api/userApi/userApi";
import { routes } from "../../models/constants/constants";
import {
    emailValidator,
    minLengthValidator,
    requiredValidator,
} from "../../models/validators/validators";
import { useAppDispatch } from "../../store/hooks/redux-hooks";
import { IUser, setUser } from "../../store/reducers/UserSlice";
import styles from "./Forms.module.css";
import { EmailInput } from "./Inputs/EmailInput";
import { PasswordInput } from "./Inputs/PasswordInput";

const minLength6 = minLengthValidator(6);

interface LoginFormData {
    email: string;
    password: string;
}

interface LoginFormProps extends InjectedFormProps<LoginFormData, {}, string> {}

const LoginForm: FC<LoginFormProps> = ({ handleSubmit, invalid }) => {
    const [warningText, setWarningText] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);
    const [login] = useLoginMutation();
    const [loginWithGoogle] = useLoginWithGoogleMutation();
    const [checkExist] = useLazyCheckExistsQuery();
    const [createUser] = useCreateNewUserMutation();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const signIn = async (values: LoginFormData) => {
        const { email, password } = values;
        setIsLoading(true);
        try {
            const user = await login({
                email,
                password,
            }).unwrap();
            dispatch(
                setUser({
                    email,
                    name: user.displayName,
                    img: null,
                    coins: 0,
                    uid: user.uid,
                })
            );
            navigate(routes.MAIN_PAGE);
        } catch (error: any) {
            setWarningText(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const signInGoogle = async () => {
        try {
            const user = await loginWithGoogle(null).unwrap();
            const newUser: IUser = {
                name: user.displayName,
                email: user.email,
                img: user.photoURL,
                coins: 0,
                uid: user.uid,
            };
            dispatch(setUser(newUser));
            const exists = await checkExist(user.uid).unwrap();
            if (!exists) {
                await createUser(newUser).unwrap();
            }
            navigate(routes.MAIN_PAGE);
        } catch (error: any) {
            setWarningText(error.message);
        }
    };

    return (
        <>
            <form className={styles.form} onSubmit={handleSubmit(signIn)} data-testid='login-form'>
                <h2 className={styles.formTitle}>Вход</h2>
                <Field
                    component={EmailInput}
                    name="email"
                    validate={[requiredValidator, emailValidator]}
                />
                <Field
                    component={PasswordInput}
                    name="password"
                    validate={[requiredValidator, minLength6]}
                />
                <button
                    className={styles.loginBtn}
                    type="submit"
                    disabled={invalid}
                    data-testid='signIn-button'
                >
                    <div className={styles.buttonContentWrap}>
                        {isLoading && (
                            <ColorRing
                                visible={true}
                                height="18"
                                width="18"
                                ariaLabel="color-ring-loading"
                                wrapperStyle={{}}
                                wrapperClass="color-ring-wrapper"
                                colors={[
                                    "#fff",
                                    "#fff",
                                    "#fff",
                                    "#fff",
                                    "#fff",
                                ]}
                            />
                        )}
                        <span>Войти</span>
                    </div>
                </button>
                <button
                    className={styles.googleBtn}
                    onClick={signInGoogle}
                    type="button"
                >
                    GOOGLE
                </button>
            </form>
            <div className={styles.register}>
                <p>
                    Ещё нет аккаунта?
                    <Link to={routes.REGISTRATION_PAGE}>
                        Зарегистрироваться
                    </Link>
                </p>
            </div>
            <div className={styles.warning}>{warningText}</div>
        </>
    );
};

export const ReduxLoginForm = reduxForm<LoginFormData>({
    form: "loginForm",
})(LoginForm);
