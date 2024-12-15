import { ChangeEvent, FC, useState } from "react";
import { WrappedFieldProps } from "redux-form";
import style from "../Forms.module.css";
import cn from "classnames";

interface TextareaInputProps extends WrappedFieldProps {
    placeholder: string;
    countSymbols?: boolean;
    maxSymbols?: number;
    actualSymbols?: number,
    textareaValue?: string,
}

export const TextareaInput: FC<TextareaInputProps> = ({
    input,
    meta,
    placeholder,
    countSymbols,
    maxSymbols,
    actualSymbols,
    textareaValue
}) => {
    const { touched, error } = meta;
    const hasError = touched && error;


    return (
        <div className={cn(style.texareaWrap, { [style.invalid]: hasError })}>
            <div className={style.textareaContainer}>
                <textarea
                    {...input}
                    rows={7}
                    placeholder={placeholder}
                    value={textareaValue}
                    data-testid='textarea-input'
                />
                {countSymbols && (
                    <div className={style.countBlock}>
                        <span>{actualSymbols}</span>/<span>{maxSymbols}</span>
                    </div>
                )}
            </div>
            <p>{hasError ? error : ""}</p>
        </div>
    );
};
