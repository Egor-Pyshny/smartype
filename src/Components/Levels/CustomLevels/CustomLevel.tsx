import { FC } from "react";
import { NavLink } from "react-router-dom";
import { routes, STORAGE_CUSTOM_SYMBOLS, STORAGE_IS_CUSTOM, STORAGE_LEVEL_ID } from "../../../models/constants/constants";
import { useAppDispatch } from "../../../store/hooks/redux-hooks";
import { setIsCustom, setLevelId, setSymbols } from "../../../store/reducers/SingleLevelSclice";
import { resetLocalStorage } from "../../utils/resetLocalStorage";
import styles from './CustomLevel.module.css';

type CustomLevelProps = {
    name: string,
    id: number,
    time: string,
    speed: number,
    accuracy: number
}

export const CustomLevel: FC<CustomLevelProps> = ({name, accuracy, id, speed, time}) => {
    const dispatch = useAppDispatch()

    const onClick = ()=> {
        resetLocalStorage();
        dispatch(setSymbols(name));
        dispatch(setLevelId(id));
        dispatch(setIsCustom(true));
        localStorage.setItem(STORAGE_CUSTOM_SYMBOLS, name);
        localStorage.setItem(STORAGE_LEVEL_ID, String(id));
        localStorage.setItem(STORAGE_IS_CUSTOM, JSON.stringify(true));
    }

    return(
        <NavLink to={routes.LEVEL_PAGE} className={styles.customLevelWrap} onClick={onClick}>
        <header>
            <p className={styles.symbols}>{name}</p>
        </header>
        <main>
            <div className={styles.countInfo}>
                <div className={styles.circle}>
                    <i className="fa-solid fa-user"></i>
                </div>
            </div>
        </main>
        <footer>
            <div className={styles.time}>
                <i className="fa-regular fa-clock"></i>
                <span>{time}</span>
            </div>
            <div className={styles.speed}>
                <i className="fa-regular fa-gauge-high"></i>
                {speed} <span>зн/мин</span>
            </div>
            <div className={styles.accuracy}>
                <i className="fa-regular fa-bullseye"></i>
                <span>{accuracy}%</span>
            </div>
        </footer>
    </NavLink>
    )
}