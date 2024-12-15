import { FC, useEffect, useState } from "react";
import hanbdsImg from "../../../img/hands.png";
import { enLayout, ILayout, ruLayout } from "../../../models/layouts/layouts";
import { useAppSelector } from "../../../store/hooks/redux-hooks";
import { Keyboard } from "../../Keybord/Keyboard";
import s from "./KeyboardContainer.module.css";

interface IKeyboardKontainerProps {
    keyToLight: string;
    imgVisible: boolean;
    pressedKey: string;
}

export const KeyboardContainer: FC<IKeyboardKontainerProps> = ({
    imgVisible,
    keyToLight,
    pressedKey,
}) => {
    const [isNormalBoard, setIsNormalBoard] = useState<boolean>(true);
    const { layoutLang } = useAppSelector((state) => state.levelsPage);
    let currLayout: ILayout = layoutLang === "ru" ? ruLayout : enLayout;
    

    useEffect(() => {
        const showAltKeyboard = (e: KeyboardEvent) => {
            if (e.key.toLowerCase() === "shift") {
                setIsNormalBoard(false);
            }
        };
        const showNormalKeyboard = (e: KeyboardEvent) => {
            if (e.key.toLowerCase() === "shift") {
                setIsNormalBoard(true);
            }
        };
        
        window.addEventListener("keydown", showAltKeyboard);
        window.addEventListener("keyup", showNormalKeyboard);

        return () => {
            window.removeEventListener("keydown", showAltKeyboard);
            window.removeEventListener("keyup", showNormalKeyboard);
        };
    }, []);

    return (
        <div className={s.keyboards}>
            {isNormalBoard ? (
                <Keyboard
                    alt={false}
                    currLayout={currLayout}
                    keyToLight={keyToLight}
                    pressedKey={pressedKey}
                />
            ) : (
                <Keyboard
                    alt={true}
                    currLayout={currLayout}
                    keyToLight={keyToLight}
                    pressedKey={pressedKey}
                />
            )}
            <img
                className={s.hands}
                src={hanbdsImg}
                style={imgVisible ? undefined : { display: "none" }}
                alt="Пальцы"
            />
        </div>
    );
};
