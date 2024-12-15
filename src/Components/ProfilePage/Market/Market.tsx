import { FC, useEffect, useState } from "react";
import {
    useBuyColorMutation,
    useBuyPacmanMutation,
    useGetProductsQuery,
} from "../../../api/marketApi/marketApi";
import {
    useUpdateUserCoinsMutation,
    useUpdateUserPacmanColorMutation,
    useUpdateUserPacmanTypeMutation,
} from "../../../api/userApi/userApi";
import {
    defaultPacmanColor,
    defaultPacmanType,
} from "../../../models/constants/constants";
import {
    BuyColorDto,
    BuyPacmanDto,
    PacmanForm,
    UpdatePacmanColorDto,
    UpdatePacmanTypeDto,
} from "../../../models/types";
import {
    useAppDispatch,
    useAppSelector,
} from "../../../store/hooks/redux-hooks";
import { useSortProducts } from "../../../store/hooks/useSortProducts";
import {
    setCurrentProduct,
    setProducts,
} from "../../../store/reducers/ProfileSlice";
import {
    addColorToHistory,
    addPacmanToHistory,
    setCoins,
    setPacmanColor,
    setPacmanType,
} from "../../../store/reducers/UserSlice";
import { Alert } from "../../Alerts/Alert";
import { Loader } from "../../Loader/Loader";
import { BuyModal } from "./BuyModal/BuyModal";
import style from "./Market.module.css";
import { MarketCard } from "./MarketCard/MarketCard";

type MarketProps = {};

export const Market: FC<MarketProps> = ({}) => {
    const dispatch = useAppDispatch();
    const { products, currentProduct } = useAppSelector(
        (state) => state.profilePage
    );
    const { pacmanType, pacmanColor, coins, uid, colors, pacmans } =
        useAppSelector((state) => state.user);
    const { data, isLoading } = useGetProductsQuery(undefined);
    const [buyColor] = useBuyColorMutation();
    const [buyPacman] = useBuyPacmanMutation();
    const [updateUserPacmanColor] = useUpdateUserPacmanColorMutation();
    const [updateUserCoins] = useUpdateUserCoinsMutation();
    const [updateUserPacmanType] = useUpdateUserPacmanTypeMutation();

    const [colorModal, setColorModal] = useState(false);
    const [pacmanModal, setPacmanModal] = useState(false);
    const [errorAlert, setErrorAlert] = useState(false);
    const [alertText, setAlertText] = useState("");

    const [colorsArr, pacmansArr] = useSortProducts(products);

    const onDefaultColorCardClick = async () => {
        dispatch(setPacmanColor(defaultPacmanColor));
        try {
            const updatePacmanColorDto: UpdatePacmanColorDto = {
                color: defaultPacmanColor,
                uid: uid as string,
            };
            await updateUserPacmanColor(updatePacmanColorDto).unwrap();
        } catch (error: any) {
            showErrorAlert(error.message);
        }
    };

    const onDefaultPacmanCardClick = async () => {
        dispatch(setPacmanType(defaultPacmanType));
        try {
            const updatePacmanTypeDto: UpdatePacmanTypeDto = {
                pacmanType: defaultPacmanType as PacmanForm,
                uid: uid as string,
            };
            await updateUserPacmanType(updatePacmanTypeDto).unwrap();
        } catch (error: any) {
            showErrorAlert(error.message);
        }
    };

    const colorModalMainClick = async () => {
        const buyColorDto: BuyColorDto = {
            color: currentProduct?.value as string,
            uid: uid as string,
        };
        try {
            await buyColor(buyColorDto).unwrap();

            const updatePacmanColorDto: UpdatePacmanColorDto = {
                color: buyColorDto.color,
                uid: uid as string,
            };
            await updateUserPacmanColor(updatePacmanColorDto).unwrap();
            dispatch(setPacmanColor(buyColorDto.color));

            await updateUserCoins({
                uid: uid as string,
                coins: coins - Number(currentProduct?.cost),
            });
            dispatch(setCoins(coins - Number(currentProduct?.cost)));

            dispatch(addColorToHistory(buyColorDto.color));
        } catch (error: any) {
            showErrorAlert(error.message);
        } finally {
            closeColorModal();
        }
    };

    const pacmanModalMainClick = async () => {
        const buyPacmanDto: BuyPacmanDto = {
            pacman: currentProduct?.value as PacmanForm,
            uid: uid as string,
        };
        try {
            await buyPacman(buyPacmanDto).unwrap();

            const updatePacmanTypeDto: UpdatePacmanTypeDto = {
                pacmanType: buyPacmanDto.pacman,
                uid: uid as string,
            };
            await updateUserPacmanType(updatePacmanTypeDto).unwrap();
            dispatch(setPacmanType(buyPacmanDto.pacman));

            await updateUserCoins({
                uid: uid as string,
                coins: coins - Number(currentProduct?.cost),
            });
            dispatch(setCoins(coins - Number(currentProduct?.cost)));

            dispatch(addPacmanToHistory(buyPacmanDto.pacman));
        } catch (error: any) {
            showErrorAlert(error.message);
        } finally {
            closePacmanModal();
        }
    };

    const openColorModal = () => setColorModal(true);
    const closeColorModal = () => setColorModal(false);

    const openPacmanModal = () => setPacmanModal(true);
    const closePacmanModal = () => setPacmanModal(false);

    const hideErrorAlert = () => setErrorAlert(false);
    const showErrorAlert = (text: string) => {
        setErrorAlert(true);
        setAlertText(text);
        setTimeout(() => {
            hideErrorAlert();
        }, 4500);
    };

    useEffect(() => {
        if (data) {
            dispatch(setProducts(data));
        }
    }, [data]);

    return (
        <>
            {<Alert message={alertText} open={errorAlert} type="error" />}
            {colorModal && (
                <BuyModal
                    title="Внимание"
                    message="Выу веренны, что хотите купить данный цвет?"
                    mainBtnText="Да"
                    secondaryBtnText="Закрыть"
                    mainBtnClick={colorModalMainClick}
                    secondaryBtnClick={closeColorModal}
                />
            )}

            {pacmanModal && (
                <BuyModal
                    title="Внимание"
                    message="Выу веренны, что хотите купить данного пакмана?"
                    mainBtnText="Да"
                    secondaryBtnText="Закрыть"
                    mainBtnClick={pacmanModalMainClick}
                    secondaryBtnClick={closePacmanModal}
                />
            )}
            {isLoading ? (
                <Loader
                    width={55}
                    height={55}
                    style={{ display: "flex", justifyContent: "center" }}
                    strokeWidth={5}
                />
            ) : (
                <div className={style.marketContainer}>
                    <div className={style.products}>
                        <h3>Цвета</h3>
                        <div className={style.productsList}>
                            <MarketCard
                                cost={0}
                                color={defaultPacmanColor}
                                pacmanForm={pacmanType}
                                current={pacmanColor === defaultPacmanColor}
                                inStock={true}
                                purpose="color"
                                onClick={onDefaultColorCardClick}
                            />
                            {colorsArr.map((product) => {
                                const inStock = colors.some(
                                    (color) => color === product.value
                                );
                                const current = pacmanColor === product.value;

                                const onCardClick = async () => {
                                    dispatch(setCurrentProduct(product));
                                    if (inStock) {
                                        dispatch(setPacmanColor(product.value));
                                        try {
                                            const updatePacmanColorDto: UpdatePacmanColorDto =
                                                {
                                                    color: product.value,
                                                    uid: uid as string,
                                                };
                                            await updateUserPacmanColor(
                                                updatePacmanColorDto
                                            ).unwrap();
                                        } catch (error: any) {
                                            showErrorAlert(error.message);
                                        }
                                    } else {
                                        if (product.cost <= coins) {
                                            openColorModal();
                                        } else {
                                            showErrorAlert(
                                                "Недостаточно монет"
                                            );
                                        }
                                    }
                                };

                                return (
                                    <MarketCard
                                        cost={product.cost}
                                        color={product.value}
                                        pacmanForm={pacmanType}
                                        current={current}
                                        inStock={inStock}
                                        purpose="color"
                                        onClick={onCardClick}
                                        key={product.value}
                                    />
                                );
                            })}
                        </div>
                    </div>
                    <div className={style.products}>
                        <h3>Пакманы</h3>
                        <div className={style.productsList}>
                            <MarketCard
                                cost={0}
                                color={pacmanColor}
                                pacmanForm={defaultPacmanType}
                                current={pacmanType === defaultPacmanType}
                                inStock={true}
                                purpose="pacman"
                                onClick={onDefaultPacmanCardClick}
                            />
                            {pacmansArr.map((product) => {
                                const inStock = pacmans.some(
                                    (pacman) => pacman === product.value
                                );
                                const current = product.value === pacmanType;

                                const onCardClick = async () => {
                                    dispatch(setCurrentProduct(product));
                                    if (inStock) {
                                        dispatch(
                                            setPacmanType(
                                                product.value as PacmanForm
                                            )
                                        );
                                        try {
                                            const updatePacmanTypeDto: UpdatePacmanTypeDto =
                                                {
                                                    pacmanType:
                                                        product.value as PacmanForm,
                                                    uid: uid as string,
                                                };
                                            await updateUserPacmanType(
                                                updatePacmanTypeDto
                                            ).unwrap();
                                        } catch (error: any) {
                                            showErrorAlert(error.message);
                                        }
                                    } else {
                                        if (product.cost <= coins) {
                                            openPacmanModal();
                                        } else {
                                            showErrorAlert(
                                                "Недостаточно монет"
                                            );
                                        }
                                    }
                                };
                                return (
                                    <MarketCard
                                        cost={product.cost}
                                        color={pacmanColor}
                                        pacmanForm={product.value as PacmanForm}
                                        current={current}
                                        inStock={inStock}
                                        purpose="pacman"
                                        onClick={onCardClick}
                                        key={product.value}
                                    />
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
