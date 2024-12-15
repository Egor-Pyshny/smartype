import { FC } from "react";
import styles from "./AddCustomLevelButton.module.css";
import { useNavigate } from "react-router-dom";
import { routes } from "../../../models/constants/constants";

export const AddCustomLevelButton = () => {
    const navigate = useNavigate();
    const clickHandler = () => {
        navigate(routes.CREATE_LEVEL_PAGE);
    };
    return (
        <button className={styles.newLevelBtn} onClick={clickHandler}>
            <i className="fa-solid fa-plus"></i>
            <div className={styles.text}>
                <p>Создать новый</p>
                <p>уровень</p>
            </div>
        </button>
    );
};
