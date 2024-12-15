import { FC } from "react";
import { WrappedFieldProps } from "redux-form";
import styles from "../Forms.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faA } from "@fortawesome/free-solid-svg-icons";

interface UsernameInputProps extends WrappedFieldProps {}

export const UsernameInput: FC<UsernameInputProps> = ({input, meta}) => {
    const {error, touched} = meta;

    return (
        <div className={styles.inputElem}>
            <div className={styles.inputBox}>
                <input
                    {...input}
                    type="text"
                    id="username"
                    autoComplete="off"
                    required
                    data-testid={'username-input'}
                />
                <label htmlFor="username">Имя</label>
                <FontAwesomeIcon icon={faA} />
            </div>
            <p>{touched && error ? error : ''}</p>
        </div>
    );
};
