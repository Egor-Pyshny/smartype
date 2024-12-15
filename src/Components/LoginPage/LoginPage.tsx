import { useEffect } from "react";
import styles from "../Forms/Forms.module.css";
import { ReduxLoginForm } from "../Forms/LoginForm";

export const LoginPage = () => {
    useEffect(() => {
        document.body.style.backgroundColor = "var(--bg-auth)";
    }, []);

    return (
        <div className={styles.formContainer}>
            <div className={styles.formWrap}>
                <ReduxLoginForm />
            </div>
        </div>
    );
};


