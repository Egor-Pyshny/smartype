import { FC, useEffect, useRef, useState } from "react";
import {
    useLazyGetCustomLevelTextQuery,
    useLazyGetPracticeLevelTextQuery,
    useLazyGetSingleLevelTextQuery,
    useUpdateCustomLevelMutation,
    useUpdateLevelsMutation,
    useUpdatePracticeMutation,
    useUpdateProgressMutation,
} from "../../api/levelsApi/levelsApi";
import { useUpdateUserCoinsMutation } from "../../api/userApi/userApi";
import {
    STORAGE_CUSTOM_SYMBOLS,
    STORAGE_IS_CUSTOM,
    STORAGE_LEVEL_COUNT,
    STORAGE_LEVEL_ID,
    STORAGE_LEVEL_SYMBOLS,
    STORAGE_PRACTICE_LANG,
    enAlphabet,
    insignificantKeys,
    ruAlphabet,
} from "../../models/constants/constants";
import {
    KeyBoardLayouts,
    UpdateCustomLevelDto,
    UpdateLevel,
    UpdatePractice
} from "../../models/types";
import { useAppDispatch, useAppSelector } from "../../store/hooks/redux-hooks";
import { useAuth } from "../../store/hooks/useAuth";
import {
    resetLevelData,
    setCount,
    setDelta,
    setIsCustom,
    setIsPractice,
    setLanguage,
    setLevelId,
    setSymbols,
    setTextToWrite,
    setWrittenText,
} from "../../store/reducers/SingleLevelSclice";
import { setCoins } from "../../store/reducers/UserSlice";
import { Loader } from "../Loader/Loader";
import { Navbar } from "../Navbar/Navbar";
import { Pacman } from "../Pacmans/Pacman";
import { SmallScreenWarning } from "../SmallScreenWarning/SmallScreenWarning";
import { KeyboardContainer } from "./KeyboardContainer/KeyboardContainer";
import { LevelResult } from "./LevelResult/LevelResult";
import s from "./SingleLevel.module.css";
import { setLayoutLang } from "../../store/reducers/LevelsPageSlice";
import { Alert } from "../Alerts/Alert";

interface ISingleLevel {}

export const SingleLevel: FC<ISingleLevel> = ({}) => {
    const dispatch = useAppDispatch();
    const {
        textToWrite,
        delta,
        writtenText,
        symbols,
        lang,
        lvlId,
        count,
        isCustom,
        isPractice,
    } = useAppSelector((state) => state.singleLevel);
    const {layoutNavbar} = useAppSelector((state) => state.levelsPage);
    const { coins, pacmanColor, pacmanType } = useAppSelector((state) => state.user);
    const { uid } = useAuth();
    const [fetchLevelsText, { isFetching: isLevelsLoading }] =
        useLazyGetSingleLevelTextQuery();
    const [fetchPracticeText, { isFetching: isPracticeLoading }] =
        useLazyGetPracticeLevelTextQuery();
    const [updateLevels] = useUpdateLevelsMutation();
    const [updateProgress] = useUpdateProgressMutation();
    const [updatePractice] = useUpdatePracticeMutation();
    const [updateCustomLevel] = useUpdateCustomLevelMutation();
    const [updateUserCoins] = useUpdateUserCoinsMutation();
    const [getCustomLevelText, { isFetching: isCustomFetching }] =
        useLazyGetCustomLevelTextQuery();

    const totalSymbols = useRef<number>(0);
    const totalSeconds = useRef<number>(0);
    const [currSpeed, setCurrSpeed] = useState<number>(0);
    const [currAccuracy, setCurrAccuracy] = useState<number>(100);
    const totalSecondsTimerId = useRef<NodeJS.Timeout | null>(null);
    const speedTimerId = useRef<NodeJS.Timeout | null>(null);
    const firstTouch = useRef<boolean>(true);
    const canCalcSpeed = useRef<boolean>(false);
    const canCalcAccuracy = useRef<boolean>(true);
    const [time, setTime] = useState<string>("00:00");
    const [mistakes, setMistakes] = useState<number>(0);
    const [isMistake, setIsMistake] = useState<boolean>(false);
    const [eating, setEating] = useState<boolean>(false);
    const myDelta = useRef<number>(delta);
    const [finished, setFinished] = useState<boolean>(false);
    const [imgVisible, setImgVisible] = useState<boolean>(true);
    const [keyToLight, setKeyToLight] = useState<string>("");
    const [pressedKey, setPressedKey] = useState<string>("");

    const [errorAlert, setErrorAlert] = useState(false);
    const [alertText, setAlertText] = useState("");

    const hideErrorAlert = () => setErrorAlert(false);
    const showErrorAlert = (text: string) => {
        setErrorAlert(true);
        setAlertText(text);
        setTimeout(() => {
            hideErrorAlert();
        }, 4500);
    };

    const updateDB = useRef(() => {
        updateUserDB();
    });

    useEffect(() => {
        // обновление замыкания
        updateDB.current = () => {
            updateUserDB();
        };
    }, [currSpeed, currAccuracy]);

    const updateUserDB = async () => {
        if (!isCustom && !isPractice) {
            const data: UpdateLevel = {
                accuracy: currAccuracy,
                speed: currSpeed,
                time,
                count,
                id: lvlId as number,
                symb: symbols,
                layoutLang: layoutNavbar,
                uid: uid as string,
            };
            dispatch(setCoins(coins + 10));
            try {
                await updateLevels(data).unwrap();
                await updateProgress(data).unwrap();
                await updateUserCoins({
                    uid: uid as string,
                    coins: coins + 15,
                });
            } catch (error: any) {
                showErrorAlert(error.message);
            }
        }
        if (isPractice) {
            const data: UpdatePractice = {
                accuracy: currAccuracy,
                lang,
                speed: currSpeed,
                time,
                uid: uid as string,
            };
            try {
                await updatePractice(data).unwrap();
                await updateUserCoins({
                    uid: uid as string,
                    coins: coins + 10,
                });
            } catch (error: any) {
                showErrorAlert(error.message);
            }
        }
        if (isCustom) {
            const data: UpdateCustomLevelDto = {
                id: lvlId as number,
                accuracy: currAccuracy,
                speed: currSpeed,
                time,
            };
            try {
                await updateCustomLevel(data).unwrap();
            } catch (error: any) {
                showErrorAlert(error.message);
            }
        }
    };

    const eatLetter = (key: string) => {
        if (key !== " ") {
            setEating(true);
            setTimeout(() => {
                setEating(false);
            }, 100);
        }
        dispatch(setTextToWrite(textToWrite.slice(1)));
        dispatch(setWrittenText(writtenText + key));
    };

    const stopTimers = () => {
        if (totalSecondsTimerId.current) {
            clearTimeout(totalSecondsTimerId.current);
            totalSecondsTimerId.current = null;
        }
        if (speedTimerId.current) {
            clearTimeout(speedTimerId.current);
            speedTimerId.current = null;
        }
    };

    const calculateSpeed = () => {
        if (speedTimerId.current) {
            clearTimeout(speedTimerId.current);
            speedTimerId.current = null;
        }
        const minutes = totalSeconds.current / 60;
        const speed =
            minutes === 0 ? 0 : Math.round(totalSymbols.current / minutes);
        setCurrSpeed(speed);
        const newTimerId = setTimeout(calculateSpeed, 800);
        speedTimerId.current = newTimerId;
    };
    const calculateAccuracy = () => {
        if (canCalcAccuracy.current) {
            setMistakes((prev) => prev + 1);
            setCurrAccuracy((prev) => +(prev - myDelta.current).toFixed(2));
            canCalcAccuracy.current = false;
        }
    };

    const calculateSeconds = () => {
        if (totalSecondsTimerId.current) {
            clearTimeout(totalSecondsTimerId.current);
            totalSecondsTimerId.current = null;
        }
        totalSeconds.current++;
        setTime(getCorrectTime(totalSeconds.current));
        const newTimerId = setTimeout(calculateSeconds, 1000);
        totalSecondsTimerId.current = newTimerId;
    };

    const getCorrectTime = (totalSeconds: number): string => {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        const strMinutes = minutes > 9 ? `${minutes}` : `0${minutes}`;
        const strSeconds = seconds > 9 ? `${seconds}` : `0${seconds}`;
        return `${strMinutes}:${strSeconds}`;
    };

    const writeText = (e: KeyboardEvent) => {
        e.preventDefault();
        if (textToWrite.length === 0) return;
        const key = e.key;
        setPressedKey(key);
        // if(enAlphabet.includes(textToWrite[0])){
        //     dispatch(setLayoutLang('en'));
        // }
        // if(ruAlphabet.includes(textToWrite[0])){
        //     dispatch(setLayoutLang('ru'));
        // }
        if (!insignificantKeys.has(key)) {
            
            setImgVisible(false);
            if (firstTouch.current) {
                firstTouch.current = false;
                setTimeout(() => {
                    calculateSeconds();
                    canCalcSpeed.current = true;
                }, 1000);
            }
            if (key === textToWrite[0]) {
                setIsMistake(false);
                eatLetter(key);
                canCalcAccuracy.current = true;
                if (canCalcSpeed.current) {
                    calculateSpeed();
                    canCalcSpeed.current = false;
                }
                if (textToWrite.length === 1) {
                    stopTimers();
                    setTimeout(() => {
                        updateDB.current();
                        setFinished(true);
                    }, 100);
                } else {    
                    setKeyToLight(textToWrite[1]);
                }
                totalSymbols.current++;
            } else {
                setIsMistake(true);
                calculateAccuracy();
            }
        }
    };

    const restart = async () => {
        setCurrAccuracy(100);
        setCurrSpeed(0);
        setMistakes(0);
        setEating(false);
        setFinished(false);
        setTime("00:00");
        setKeyToLight("");
        setPressedKey("");
        setImgVisible(true);
        totalSymbols.current = 0;
        totalSeconds.current = 0;
        firstTouch.current = true;
        canCalcSpeed.current = false;
        canCalcAccuracy.current = false;

        dispatch(setWrittenText(""));
        if (!isPractice && !isCustom) {
            localStorage.setItem(STORAGE_LEVEL_COUNT, String(count + 1));
            dispatch(setCount(count + 1));
            const text = await fetchLevelsText({
                lang: layoutNavbar,
                symbols,
            }).unwrap();
            dispatch(setTextToWrite(text));
            const textLength = text.length;
            const delta = +((1 / textLength) * 100).toFixed(2);
            dispatch(setDelta(delta));
        }
        if (isPractice) {
            const text = await fetchPracticeText({ lang }).unwrap();
            dispatch(setTextToWrite(text));
            const textLength = text.length;
            const delta = +((1 / textLength) * 100).toFixed(2);
            dispatch(setDelta(delta));
        }

        if (isCustom) {
            const name = localStorage.getItem(STORAGE_CUSTOM_SYMBOLS) as string;
            const text = await getCustomLevelText({
                uid: uid as string,
                name,
            }).unwrap();
            dispatch(setTextToWrite(text));
            const textLength = text.length;
            const delta = +((1 / textLength) * 100).toFixed(2);
            dispatch(setDelta(delta));
        }
    };

    useEffect(() => {
        myDelta.current = delta;
    }, [delta]);

    useEffect(() => {
        document.body.style.backgroundColor = "var(--bg-body-blue)";

        const keyUpHandler = () => {
            setPressedKey("");
        };
        window.addEventListener("keyup", keyUpHandler);
        return () => {
            stopTimers();
            dispatch(resetLevelData());
            dispatch(setIsPractice(false));
            window.removeEventListener("keyup", keyUpHandler);
        };
    }, []);

    useEffect(() => {
        const initLevel = async () => {
            if (isCustom) {
                const name = localStorage.getItem(
                    STORAGE_CUSTOM_SYMBOLS
                ) as string;

                try {
                    const text = await getCustomLevelText({
                        uid: uid as string,
                        name,
                    }).unwrap();
                    const textLength = text.length;
                    const delta = +((1 / textLength) * 100).toFixed(2);
                    dispatch(setDelta(delta));
                    dispatch(setTextToWrite(text));
                } catch (error) {
                    console.log(error);  
                }               
            }
            if (symb) {
                const text = await fetchLevelsText({
                    lang: layoutNavbar,
                    symbols: symb,
                }).unwrap();
                const textLength = text.length;
                const delta = +((1 / textLength) * 100).toFixed(2);
                dispatch(setDelta(delta));
                dispatch(setTextToWrite(text));
            }

            if (practiceLang) {
                const text = await fetchPracticeText({
                    lang: practiceLang,
                }).unwrap();
                const textLength = text.length;
                const delta = +((1 / textLength) * 100).toFixed(2);
                dispatch(setDelta(delta));
                dispatch(setTextToWrite(text));
            }

            const lvlCount = localStorage.getItem(STORAGE_LEVEL_COUNT);
            if (lvlCount) {
                if (count !== +lvlCount) {
                    dispatch(setCount(+lvlCount));
                }
            }

            const id = localStorage.getItem(STORAGE_LEVEL_ID);
            if (id) {
                if (lvlId !== +id) {
                    dispatch(setLevelId(+id));
                }
            }
        };

        const practiceLang = localStorage.getItem(STORAGE_PRACTICE_LANG);
        if (practiceLang) {
            dispatch(setLanguage(practiceLang));
            dispatch(setIsPractice(true));
        }

        const isCustom = JSON.parse(
            localStorage.getItem(STORAGE_IS_CUSTOM) as string
        );
        if (isCustom) {
            dispatch(setIsCustom(true));
        }

        const symb = localStorage.getItem(STORAGE_LEVEL_SYMBOLS) as string;
        if (symb) {
            dispatch(setSymbols(symb));
        }

        initLevel();
    }, [uid]);

    useEffect(() => {
        window.addEventListener("keydown", writeText);
        if (textToWrite !== "" && keyToLight === "") {
            setKeyToLight(textToWrite[0]);
        }
        if(isCustom){
            if(textToWrite[0] !== ' '){
                const layout: KeyBoardLayouts = ruAlphabet.includes(textToWrite[0]) ? 'ru' : 'en';
                dispatch(setLayoutLang(layout));
            }
            
        }
        return () => {
            window.removeEventListener("keydown", writeText);
        };
    }, [textToWrite, isCustom]);

    return (
        <>
         {<Alert message={alertText} open={errorAlert} type="error" />}
            <Navbar />
            {finished ? (
                <LevelResult
                    accuracy={currAccuracy}
                    mistakes={mistakes}
                    speed={currSpeed}
                    time={time}
                    handleClick={restart}
                />
            ) : (
                <>
                    <div className="container">
                        <div className={s.timeBlock}>
                            <span>{time}</span>
                        </div>

                        <div className={s.stats}>
                            <div className={s.statsMisses}>
                                <span>{mistakes}</span> ошибок
                            </div>
                            <div className={s.statsSpeed}>
                                <span>{currSpeed}</span> зн/мин
                            </div>
                            <div className={s.statsAccuracy}>
                                <span>{currAccuracy}%</span> точность
                            </div>
                        </div>

                        <div className={s.levelText}>
                            <div className={s.levelTextWrap}>
                                <div className={s.textInvisible}>
                                    <div className={s.writtenText}>
                                        {writtenText}
                                    </div>
                                    <div className={s.pacmanWrap}>
                                        <Pacman
                                            red={isMistake}
                                            eating={eating}
                                            form={pacmanType}
                                            color={pacmanColor}
                                        />
                                    </div>
                                </div>
                                <div className={s.textVisible}>
                                    {(isLevelsLoading ||
                                        isPracticeLoading ||
                                        isCustomFetching) && (
                                        <Loader
                                            height={50}
                                            width={50}
                                            strokeWidth={5}
                                            style={{ margin: "auto" }}
                                        />
                                    )}
                                    {textToWrite}
                                </div>
                            </div>
                        </div>
                    </div>

                    <KeyboardContainer
                        imgVisible={imgVisible}
                        keyToLight={keyToLight}
                        pressedKey={pressedKey}
                    />

                    <SmallScreenWarning />
                </>
            )}
        </>
    );
};
