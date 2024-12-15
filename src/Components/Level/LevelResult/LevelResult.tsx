import { FC } from "react";
import { NavLink } from "react-router-dom";
import s from './LevelResult.module.css';
import { routes } from "../../../models/constants/constants";

interface ILevelResultProps {
    time: string,
    mistakes: number,
    speed: number,
    accuracy: number,
    handleClick: ()=>void,
}

export const LevelResult: FC<ILevelResultProps> = ({ speed, time, accuracy, mistakes, handleClick }) => {
    return (
        <>
            <div className={s.overlay}></div>
            <div className={s['level-end-container']}>
                <h2 className={s['level-end-title']}>Упражнение завершено!</h2>
                <div className={s.results}>
                    <div className={s['results-stat']}>
                        <span>{time}</span> мин
                    </div>
                    <div className={s['results-stat']}>
                        <span>{mistakes}</span> ошибок
                    </div>
                    <div className={s['results-stat']}>
                        <span>{speed}</span> зн/мин
                    </div>
                    <div className={s['results-stat']}>
                        <span>{accuracy}%</span> точность
                    </div>
                </div>
                <div className={s.buttons}>
                    <button className={s['again-btn']} onClick={handleClick}>Ещё раз</button>
                    <NavLink to={routes.MAIN_PAGE} className={s['exit-btn']}>Выйти</NavLink>
                </div>
            </div>
        </>
    )
}