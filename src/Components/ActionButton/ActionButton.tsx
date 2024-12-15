import { FC } from "react";
import style from "./ActionButton.module.css";
import cn from "classnames";
import { ColorRing } from "react-loader-spinner";

type ActionButtonProps = {
    text: string;
    type: "button" | "submit";
    disabled?: boolean;
    loading?: boolean;
    dataTestId?: string;
    clickHandler?: () => void;
};

export const ActionButton: FC<ActionButtonProps> = ({
    text,
    type,
    disabled,
    loading,
    dataTestId,
    clickHandler,
}) => {
    return (
        <button
            onClick={clickHandler}
            type={type}
            disabled={disabled}
            className={cn(style.actionBtn, { [style.disabled]: disabled })}
            data-testid={dataTestId}
        >
            {loading && (
                <ColorRing
                    visible={true}
                    height="18"
                    width="18"
                    ariaLabel="color-ring-loading"
                    wrapperStyle={{}}
                    wrapperClass="color-ring-wrapper"
                    colors={["#fff", "#fff", "#fff", "#fff", "#fff"]}
                />
            )}
            {text}
        </button>
    );
};
