import { FC, useState } from "react";
import { ColorRing } from "react-loader-spinner";
import { Link, useNavigate } from "react-router-dom";
import { Field, InjectedFormProps, reduxForm } from "redux-form";
import {
    useLoginWithGoogleMutation,
    useRegistrationMutation,
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
import { UsernameInput } from "./Inputs/UsernameInput";

const minLength6 = minLengthValidator(6);

interface RegisterFormData {
    email: string;
    username: string;
    password: string;
}

interface RegisterFormProps extends InjectedFormProps<RegisterFormData, {}, string> {}
{
}

const RegisterForm: FC<RegisterFormProps> = ({ handleSubmit, invalid }) => {
    const [warningText, setWarningText] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);
    const [loginWithGoogle] = useLoginWithGoogleMutation();
    const [checkExist] = useLazyCheckExistsQuery();
    const [createUser] = useCreateNewUserMutation();
    const [registrate] = useRegistrationMutation();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const signUp = async (values: RegisterFormData) => {
        const { email, username, password } = values;
        setIsLoading(true);
        try {
            const createdUser = await registrate({
                email,
                name: username,
                password,
            }).unwrap();
            dispatch(setUser(createdUser));
            await createUser(createdUser).unwrap();
            navigate(routes.MAIN_PAGE);
        } catch (error: any) {
            setWarningText(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const signUpGoogle = async () => {
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
            <form className={styles.form} onSubmit={handleSubmit(signUp)}>
                <h2 className={styles.formTitle}>Регистрация</h2>
                <Field
                    component={UsernameInput}
                    name="username"
                    validate={[requiredValidator]}
                />
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
                    data-testid='register-button'
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
                        <span>Зарегистрироваться</span>
                    </div>
                </button>
                <button
                    className={styles.googleBtn}
                    onClick={signUpGoogle}
                    type="button"
                >
                    GOOGLE
                </button>
            </form>
            <div className={styles.register}>
                <p>
                    Уже есть аккаунт?<Link to={routes.LOGIN_PAGE}>Войти</Link>
                </p>
            </div>
            <div className={styles.warning}>{warningText}</div>
        </>
    );
};

export const ReduxRegisterForm = reduxForm<RegisterFormData>({
    form: "registerForm",
})(RegisterForm);
