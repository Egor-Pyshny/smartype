import { faCheckCircle, faCoins } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import cn from "classnames";
import { FC } from "react";
import { PacmanForm, ProductType } from "../../../../models/types";
import { Pacman } from "../../../Pacmans/Pacman";
import style from "./MarketCard.module.css";

type MarketCardProps = {
    cost: number;
    color: string;
    pacmanForm: PacmanForm,
    purpose: ProductType,
    inStock: boolean;
    current: boolean;
    onClick: () => void;
};

export const MarketCard: FC<MarketCardProps> = ({
    cost,
    color,
    pacmanForm,
    current,
    purpose,
    inStock,
    onClick,
}) => {

    return (
        <div
            className={cn(style.card, { [style.current]: current })}
            onClick={onClick}
        >
            <div className={style.body}>
                <div className={style.product}>
                    <Pacman
                        eating={false}
                        red={false}
                        color={String(color)}
                        form={pacmanForm as PacmanForm}
                    />
                </div>
            </div>
            <div className={style.priceContainer}>
                {!current && !inStock && (
                    <FontAwesomeIcon icon={faCoins} className={style.coins} />
                )}

                {current && (
                    <FontAwesomeIcon
                        icon={faCheckCircle}
                        className={style.chosen}
                    />
                )}

                <div className={style.price}>
                    {current ? (
                        <div className={style.chosen}>выбран</div>
                    ) : !inStock ? (
                        cost
                    ) : null}
                </div>
            </div>
        </div>
    );
};
