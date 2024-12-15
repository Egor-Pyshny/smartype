import React, { FC, FormEvent, useEffect, useState } from "react";
import styles from "../Forms.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faA, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { ColorRing } from "react-loader-spinner";
import { Field, InjectedFormProps, reduxForm } from "redux-form";

interface FormData {
    email: string, 
    password: string,
    username?: string,
}

interface IFormProps extends InjectedFormProps<FormData, {}, string> {
    title: string;
    btnText: string;
    type: "login" | "registrate";
    isLoading: boolean;
    handleClick: (...rest: any) => any;
    handleGoogle: () => void;
}



export const Form: FC<IFormProps> = ({ title, btnText, isLoading, type, handleClick, handleGoogle }) => {
    const [disabled, setDisabled] = useState<boolean>(true);
    const [emailValid, setEmailValid] = useState<boolean>(false);
    const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [email, setEmail] = useState<string>("");

    const changeUsernameHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
    };
    const changePasswordHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };
    const changeEmailHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };
    const blurEmailHandler = (e: React.FocusEvent<HTMLInputElement>) => {
        if (email !== "") {
            setEmailValid(true);
        } else {
            setEmailValid(false);
        }
    };
    const submitHandler = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    };
    const mousedownHandle = () => {
        setPasswordVisible(true);
    };
    const mouseupHandle = () => {
        setPasswordVisible(false);
    };
    useEffect(() => {
        const mouseup = () => {
            setPasswordVisible(false);
        };
        window.addEventListener("mouseup", mouseup);

        return () => window.removeEventListener("mouseup", mouseup);
    }, []);

    useEffect(() => {
        switch (type) {
            case "login":
                if (password && email) {
                    setDisabled(false);
                } else {
                    setDisabled(true);
                }
                break;
            case "registrate":
                if (password && username && email) {
                    setDisabled(false);
                } else {
                    setDisabled(true);
                }
                break;
        }
    });
    return (
        <form className={styles.form} onSubmit={submitHandler}>
            <div>
                <h2 className={styles.formTitle}>{title}</h2>
                {type === "registrate" ? (
                    <div className={styles.inputBox}>
                        <input
                            type="text"
                            name="username"
                            id="username"
                            autoComplete="off"
                            onChange={changeUsernameHandler}
                            value={username}
                            required
                        />
                        
                        <label htmlFor="username">Имя</label>
                        <FontAwesomeIcon icon={faA} />
                    </div>
                ) : null}
                <div className={styles.inputBox}>
                    <input
                        className={emailValid ? styles.valid : ""}
                        type="email"
                        name="email"
                        id="email"
                        autoComplete="off"
                        onChange={changeEmailHandler}
                        onBlur={blurEmailHandler}
                        value={email}
                        required
                    />
                    <label htmlFor="email">Почта</label>
                    <FontAwesomeIcon icon={faEnvelope} />
                </div>
                <div className={styles.inputBox}>
                    <input
                        type={passwordVisible ? "text" : "password"}
                        name="userpass"
                        id="userpass"
                        onChange={changePasswordHandler}
                        value={password}
                        required
                    />
                    <label htmlFor="userpass">Пароль</label>
                    <i
                        className={"fa-solid " + "fa-eye"}
                        onMouseDown={mousedownHandle}
                        onMouseUp={mouseupHandle}
                        style={{ cursor: "pointer" }}
                    ></i>
                </div>
                {type === "login" ? (
                    <button
                        className={styles.loginBtn}
                        type="submit"
                        onClick={() => handleClick(email, password)}
                        disabled={disabled}
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
                                    colors={["#fff", "#fff", "#fff", "#fff", "#fff" ]}
                                />
                            )}
                            <span>{btnText}</span>
                        </div>
                    </button>
                ) : (
                    <button
                        className={styles.loginBtn}
                        type="submit"
                        onClick={() => handleClick(username, email, password)}
                        disabled={disabled}
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
                                    colors={["#fff", "#fff", "#fff", "#fff", "#fff" ]}
                                />
                            )}
                            <span>{btnText}</span>
                        </div>
                    </button>
                )}
                <button
                    className={styles.googleBtn}
                    onClick={handleGoogle}
                >
                    GOOGLE
                </button>
            </div>
        </form>
    );
};