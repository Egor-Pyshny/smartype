import { FC, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useLogoutMutation } from "../../api/authApi/authApi";
import avatarka from "../../img/profile_icon.jpg";
import { useAppSelector } from "../../store/hooks/redux-hooks";
import { LogoutButton } from "./LogoutButton/LogoutButton";
import s from "./ProfilePage.module.css";
import { RatingList } from "./RatingList/RatingList";
import { UserLevelsList } from "./UserLevels/UserLevelsList/UserLevelsList";
import { UserTestsList } from "./UserTests/UserTestsList/UserTestsList";
import { routes } from "../../models/constants/constants";
import { Market } from "./Market/Market";

const Routes: Record<RoutesType, JSX.Element> = {
    levels: <UserLevelsList />,
    tests: <UserTestsList />,
    rating: <RatingList />,
    market: <Market />,
};

type RoutesType = "levels" | "tests" | "rating" | "market";

interface IProfilePage {
    username: string;
    count: number;
    speed: number;
    accuracy: number;
    coins: number;
}

export const ProfilePage: FC<IProfilePage> = ({
    accuracy,
    count,
    speed,
    username,
    coins,
}) => {
    const [route, setRoute] = useState<RoutesType>("levels");
    const [activeLink, setActiveLink] = useState<RoutesType>("levels");
    const [logout] = useLogoutMutation();
    const navigate = useNavigate();
    const img = useAppSelector((state) => state.user.img);
    const hash = useLocation().hash;

    useEffect(() => {
        switch (hash) {
            case "#levels":
                setRoute("levels");
                setActiveLink("levels");
                break;
            case "#tests":
                setRoute("tests");
                setActiveLink("tests");
                break;
            case "#rating":
                setRoute("rating");
                setActiveLink("rating");
                break;
            case "#market":
                setRoute("market");
                setActiveLink("market");
                break;
            default:
                break;
        }
    }, [hash]);

    const LinkClickHandler = (route: RoutesType) => {
        setRoute(route);
        setActiveLink(route);
    };

    const logoutHandle = async () => {
        try {
            await logout(null).unwrap();
            navigate(routes.LOGIN_PAGE);
        } catch (error: any) {
            console.error(error.message);
        }
    };

    useEffect(() => {
        document.body.style.backgroundColor = "var(--bg-body)";
    }, []);
    return (
        <>
            <div className="container">
                <main className={s.profileMain} data-testid='profile-page'>
                    <div className={s.profileHeader}>
                        <div className={s.userImg}>
                            <img src={img ? img : avatarka} alt="Аватарка" />
                        </div>
                        <div className={s.userInfo}>
                            <div className={s.nameWrap}>
                                <h2 className={s.userName}>{username}</h2>
                                <LogoutButton logoutHandle={logoutHandle} />
                            </div>

                            <div className={s.userBestStats}>
                                <div className={s.statsItem}>
                                    <div
                                        className={
                                            s.statsItemIcon + " " + s.progress
                                        }
                                    >
                                        <i className="fa-solid fa-list-check"></i>
                                    </div>
                                    <div className={s.statsItemDescr}>
                                        <div className={s.statsItemTitle}>
                                            Уровней
                                        </div>
                                        <span>{count}</span>
                                    </div>
                                </div>
                                <div className={s.statsItem}>
                                    <div
                                        className={
                                            s.statsItemIcon + " " + s.speed
                                        }
                                    >
                                        <i className="fa-regular fa-gauge-high"></i>
                                    </div>
                                    <div className={s.statsItemDescr}>
                                        <div className={s.statsItemTitle}>
                                            Скорость
                                        </div>
                                        <span>{speed}</span> зн/мин
                                    </div>
                                </div>
                                <div className={s.statsItem}>
                                    <div
                                        className={
                                            s.statsItemIcon + " " + s.accuracy
                                        }
                                    >
                                        <i className="fa-regular fa-bullseye"></i>
                                    </div>
                                    <div className={s.statsItemDescr}>
                                        <div className={s.statsItemTitle}>
                                            Точность
                                        </div>
                                        <span>{accuracy}%</span>
                                    </div>
                                </div>
                                <div className={s.statsItem}>
                                    <div
                                        className={
                                            s.statsItemIcon + " " + s.coins
                                        }
                                    >
                                        <i className="fa-solid fa-coins"></i>
                                    </div>
                                    <div className={s.statsItemDescr}>
                                        <div className={s.statsItemTitle}>
                                            Монеты
                                        </div>
                                        <span>{coins}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <nav className={s.profileNav}>
                        <a
                            className={
                                s.profileNavLink +
                                (activeLink === "levels" ? ` ${s.curr}` : "")
                            }
                            href="#levels"
                            onClick={() => LinkClickHandler("levels")}
                        >
                            Уровни
                        </a>
                        <a
                            className={
                                s.profileNavLink +
                                (activeLink === "tests" ? ` ${s.curr}` : "")
                            }
                            href="#tests"
                            onClick={() => LinkClickHandler("tests")}
                        >
                            Тесты
                        </a>
                        <a
                            className={
                                s.profileNavLink +
                                (activeLink === "rating" ? ` ${s.curr}` : "")
                            }
                            href="#rating"
                            onClick={() => LinkClickHandler("rating")}
                        >
                            Рейтинг
                        </a>
                        <a
                            className={
                                s.profileNavLink +
                                (activeLink === "market" ? ` ${s.curr}` : "")
                            }
                            href="#market"
                            onClick={() => LinkClickHandler("market")}
                        >
                            Магазин
                        </a>
                    </nav>

                    <div className={s.navContainer}>{Routes[route]}</div>
                </main>
            </div>
        </>
    );
};
