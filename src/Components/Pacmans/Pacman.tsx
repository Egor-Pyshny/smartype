import cn from "classnames";
import { FC } from "react";
import { PacmanForm } from "../../models/types";
import style from "./Pacmans.module.css";

interface IPacmanProps {
    eating: boolean;
    red: boolean;
    color: string;
    form: PacmanForm;
}

export const Pacman: FC<IPacmanProps> = ({ eating, red, form, color }) => {
    return (
        <div
            className={cn(
                style.pacman,
                { [style.pred]: red },
                { [style.square]: form === "square" }
            )}
            style={{ background: color }}
        >
            <div className={style.pacmanEye}></div>
            <div
                className={cn(style.pacmanMouth, { [style.open]: eating })}
            ></div>
        </div>
    );
};
