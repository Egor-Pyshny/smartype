import { ChangeEvent, FC, useState } from "react";
import { WrappedFieldProps } from "redux-form";
import style from "../Forms.module.css";
import cn from 'classnames';


interface TextInputProps extends WrappedFieldProps {
    placeholder: string;
    actualSymbols?: number,
    countSymbols?: boolean;
    maxSymbols?: number;
    inputValue?: string,
}

export const TextInput: FC<TextInputProps> = ({
    input,
    meta,
    placeholder,
    countSymbols,
    maxSymbols,
    actualSymbols,
    inputValue
}) => {
    const { touched, error } = meta;
    const hasError = touched && error;

    return (
        <div className={cn(style.textInputWrap, {[style.invalid]: hasError})}>
            <div className={style.textInputContainer}>
                <input
                    {...input}
                    type="text"
                    autoComplete="off"
                    placeholder={placeholder}
                    value={inputValue}
                    data-testid='text-input'
                />
                {countSymbols && (
                    <div className={style.countBlock}>
                        <span>{actualSymbols}</span>/<span>{maxSymbols}</span>
                    </div>
                )}
            </div>

            <p>{ hasError ? error : ""}</p>
        </div>
    );
};
