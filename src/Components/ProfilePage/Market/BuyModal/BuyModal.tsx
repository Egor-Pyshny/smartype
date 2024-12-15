import { FC } from "react";
import style from "./BuyModal.module.css";
import cn from 'classnames';

type BuyModalProps = {
    title: string;
    message: string;
    mainBtnText: string,
    secondaryBtnText: string,
    secondaryBtnClick: () => void;
    mainBtnClick: () => void;
};

export const BuyModal: FC<BuyModalProps> = ({
    title,
    message,
    secondaryBtnText,
    mainBtnText,
    secondaryBtnClick,
    mainBtnClick,
}) => {
    return (
        <>
            <div className={style.overlay}></div>
            <div className={style.modal}>
                <div className={style.header}>
                <h3 className={style.title}>{title}</h3>
                </div>
                
                <div className={style.content}>
                    {message}
                </div>
                <div className={style.buttons}>
                    <button className={cn(style.btn, style.secondaryBtn)} onClick={secondaryBtnClick}>{secondaryBtnText}</button>
                    <button className={cn(style.btn, style.mainBtn)} onClick={mainBtnClick}>{mainBtnText}</button>
                </div>
            </div>
        </>
    );
};
