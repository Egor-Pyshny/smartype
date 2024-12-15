import { useEffect } from "react";
import styles from "../Forms/Forms.module.css";
import { ReduxRegisterForm } from "../Forms/RegisterForm";

export const RegisterPage = () => {

    useEffect(() => {
        document.body.style.backgroundColor = "var(--bg-auth)";
    }, []);

    return (
        <div className={styles.formContainer}>
            <div className={styles.formWrap}>
                <ReduxRegisterForm />
            </div>
        </div>
    );
};
