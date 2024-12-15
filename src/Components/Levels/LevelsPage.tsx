import { useEffect } from "react";
import {
    useGetCustomLevelsQuery,
    useGetLevelsQuery,
    useGetPracticeLevelsQuery,
} from "../../api/levelsApi/levelsApi";
import { useLazyGetUserCoinsQuery } from "../../api/userApi/userApi";
import { ICusomLevel, ILevels, IPractice } from "../../models/types";
import { useAppDispatch, useAppSelector } from "../../store/hooks/redux-hooks";
import { useAuth } from "../../store/hooks/useAuth";
import { setCoins } from "../../store/reducers/UserSlice";
import { Footer } from "../Footer/Footer";
import { Loader } from "../Loader/Loader";
import { Navbar } from "../Navbar/Navbar";
import { CustomLevelsList } from "./CustomLevels/CustomLevelsList";
import { Layouts } from "./Layouts/Layouts";
import s from "./Levels.module.css";
import { LevelsList } from "./LevelsList";
import { PracticeList } from "./PracticeList";

export const LevelsPage = () => {
    const uid = useAppSelector((state) => state.user.uid);
    const { layoutNavbar } = useAppSelector((state) => state.levelsPage);
    const {
        data: levels,
        isLoading: isLevelsLoaing,
        error: errorLevels,
    } = useGetLevelsQuery({ uid: uid as string, lang: layoutNavbar }, {
        refetchOnMountOrArgChange: true
    });
    const {
        data: practiceLevels,
        isLoading: isPracticeLoaing,
        error: errorPractice,
    } = useGetPracticeLevelsQuery({ uid: uid as string });
    const {
        data: customLevels,
        isLoading: isCustomLoading,
        error: errorCustom,
    } = useGetCustomLevelsQuery({ uid: uid as string });

    const [getCoins] = useLazyGetUserCoinsQuery();
    const dispatch = useAppDispatch();
    const user = useAuth();

    useEffect(() => {
        const fetchCoins = async () => {
            try {
                const coins = await getCoins(user.uid as string).unwrap();
                dispatch(setCoins(coins));
            } catch (error: any) {
                console.log(error);
            }
        };
        fetchCoins();
    }, []);

    useEffect(() => {
        document.body.style.backgroundColor = "var(--bg-body)";
    }, []);

    return (
        <>
            <Navbar />
            <div className="container">
                <main className={s.main} data-testid='levels-page'>
                    <Layouts />
                    <div className={s.wrapper}>
                        <div className={s.mainLevelsWrap}>
                            <h2 className={s.mainTitle}>
                                Тренировочные уровни
                            </h2>
                            {errorLevels && (
                                <p style={{ marginBlock: 10 }}>
                                    {errorLevels.message}
                                </p>
                            )}
                            {isLevelsLoaing ? (
                                <Loader
                                    width={80}
                                    height={80}
                                    style={{ marginBottom: 20 }}
                                    strokeWidth={5}
                                />
                            ) : (
                                !errorLevels && (
                                    <LevelsList
                                        levelsArr={levels as ILevels[]}
                                    />
                                )
                            )}
                        </div>
                        <hr className={s.delimiter}></hr>
                        <div className={s.practiceLevelsWrap}>
                            <h2 className={s.mainTitle}>Практика</h2>
                            {errorPractice && (
                                <p style={{ marginBlock: 10 }}>
                                    {errorPractice.message}
                                </p>
                            )}
                            {isPracticeLoaing ? (
                                <Loader
                                    width={80}
                                    height={80}
                                    style={{ marginBottom: 20 }}
                                    strokeWidth={5}
                                />
                            ) : (
                                !errorPractice && (
                                    <PracticeList
                                        levelsArr={
                                            practiceLevels as IPractice[]
                                        }
                                    />
                                )
                            )}
                        </div>
                        <hr className={s.delimiter}></hr>
                        <div className={s.practiceLevelsWrap}>
                            <h2 className={s.mainTitle}>Ваши уровни</h2>
                            {errorCustom && (
                                <p style={{ marginBlock: 10 }}>
                                    {errorCustom.message}
                                </p>
                            )}
                            {isCustomLoading ? (
                                <Loader
                                    width={80}
                                    height={80}
                                    style={{ marginBottom: 20 }}
                                    strokeWidth={5}
                                />
                            ) : (
                                <CustomLevelsList
                                    customLevels={customLevels as ICusomLevel[]}
                                />
                            )}
                        </div>
                    </div>
                </main>
            </div>
            <Footer />
        </>
    );
};
