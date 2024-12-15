import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FC, useState } from "react";
import { WrappedFieldProps } from "redux-form";
import styles from "../Forms.module.css";

interface EmailInputProps extends WrappedFieldProps {}

export const EmailInput: FC<EmailInputProps> = ({ input, meta }) => {
    const {error, touched} = meta;
    const [emailEmpty, setEmailEmpty] = useState<boolean>(true);
 
    const blurEmailHandler = (e: React.FocusEvent<HTMLInputElement>) => {
        if (e.target.value !== "") {
            setEmailEmpty(false);
        } else {
            setEmailEmpty(true);
        }
        input.onBlur(e)
    };

    return (
        <div className={styles.inputElem}>
            <div className={styles.inputBox}>
                <input
                    className={!emailEmpty ? styles.valid : ""}
                    {...input}
                    type="email"
                    autoComplete="off"
                    required
                    onBlur={blurEmailHandler} 
                    onFocus={input.onFocus}
                    data-testid='emailInput'
                />
                <label htmlFor="email">Почта</label>
                <FontAwesomeIcon icon={faEnvelope} />
            </div>
            <p>{touched && error ? error : ''}</p>
        </div>
    );
};
