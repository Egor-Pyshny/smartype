import { FC, useState } from "react";
import { WrappedFieldProps } from "redux-form";
import styles from "../Forms.module.css";

interface PasswordInputProps extends WrappedFieldProps {}

export const PasswordInput: FC<PasswordInputProps> = ({ input, meta }) => {
    const { error, touched } = meta;
    const [passwordVisible, setPasswordVisible] = useState<boolean>(false);

    const mousedownHandle = () => {
        setPasswordVisible(true);
    };
    const mouseupHandle = () => {
        setPasswordVisible(false);
    };

    return (
        <div className={styles.inputElem}>
            <div className={styles.inputBox}>
                <input  
                    {...input}
                    type={passwordVisible ? "text" : "password"}
                    required
                    onBlur={input.onBlur} 
                    onFocus={input.onFocus}
                    data-testid='passwordInput'
                />
                <label htmlFor="userpass">Пароль</label>
                <i
                    className={"fa-solid " + "fa-eye"}
                    onMouseDown={mousedownHandle}
                    onMouseUp={mouseupHandle}
                    style={{ cursor: "pointer" }}
                ></i>
            </div>
            <p>{touched && error ? error : ""}</p>
        </div>
    );
};
