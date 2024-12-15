import { FC } from "react";
import cn from "classnames";
import style from "./Alert.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type AlertProps = {
    type: "success" | "error";
    message: string;
    open: boolean;
};

export const Alert: FC<AlertProps> = ({ type, message, open }) => {
    return (
        <div
            className={cn(
                style.alert,
                { [style.visible]: open },
                { [style.hidden]: !open },
                { [style.success]: type === 'success' },
                { [style.error]: type === 'error' }
            )}
        >
            <div className={style.content}>
                {type === "success" && (
                    <i className="fa-solid fa-circle-check"></i>
                )}
                {type === "error" && (
                    <i className="fa-solid fa-circle-exclamation"></i>
                )}

                <p className={style.message}>{message}</p>
            </div>
        </div>
    );
};
