import React from "react";
import { NavLink } from "react-router-dom";
import { useLazyGetLevelsQuery } from "../../../api/levelsApi/levelsApi";
import {
    useAppDispatch,
    useAppSelector,
} from "../../../store/hooks/redux-hooks";
import {
    setLayoutLang,
    setLayoutNavbar,
    setLevels,
} from "../../../store/reducers/LevelsPageSlice";
import s from "./Layouts.module.css";
import { KeyBoardLayouts } from "../../../models/types";
import cn from "classnames";

export const Layouts = () => {
    const {layoutNavbar } = useAppSelector(
        (state) => state.levelsPage
    );
    const uid = useAppSelector((state) => state.user.uid);
    const dispatch = useAppDispatch();
    const [getLevels] = useLazyGetLevelsQuery();

    const ClickHandler = async (e: React.MouseEvent<HTMLLIElement>) => {
        const lang = (e.currentTarget as HTMLLIElement).dataset
            .lang as KeyBoardLayouts;
        dispatch(setLayoutNavbar(lang));
        dispatch(setLayoutLang(lang));
        const levels = await getLevels({ lang, uid: uid as string }).unwrap();
        dispatch(setLevels({ levels }));
    };
    return (
        <div className={s.chooseLangContainer}>
            <ul className={s.chooseLang}>
                <li
                    onClick={ClickHandler}
                    className={cn(s.langItem, {
                        [s.selected]: layoutNavbar === "ru",
                    })}
                    data-lang="ru"
                >
                    <NavLink to="">Русский</NavLink>
                </li>
                <li
                    onClick={ClickHandler}
                    className={cn(s.langItem, {
                        [s.selected]: layoutNavbar === "en",
                    })}
                    data-lang="en"
                >
                    <NavLink to="">Английский</NavLink>
                </li>
            </ul>
        </div>
    );
};
