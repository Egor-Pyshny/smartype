import cn from "classnames";
import { ChangeEvent, FC, useState } from "react";
import { Field, InjectedFormProps, reduxForm } from "redux-form";
import { useCreateLevelMutation } from "../../api/levelsApi/levelsApi";
import {
    maxLengthValidator,
    requiredValidator,
} from "../../models/validators/validators";
import { useAuth } from "../../store/hooks/useAuth";
import { ActionButton } from "../ActionButton/ActionButton";
import style from "./Forms.module.css";
import { TextInput } from "./Inputs/TextInput";
import { TextareaInput } from "./Inputs/TextareaInput";
import { Alert } from "../Alerts/Alert";

const textInputMaxSymbols = 15;
const textareaMaxSymbols = 350;

const maxLength15 = maxLengthValidator(textInputMaxSymbols);
const maxLength350 = maxLengthValidator(textareaMaxSymbols);

interface CreateLevelFormData {
    levelName: string;
    levelContent: string;
}

interface CreateLevelFormProps
    extends InjectedFormProps<CreateLevelFormData, {}, string> {}

const CreateLevelForm: FC<CreateLevelFormProps> = ({
    invalid,
    submitting,
    reset,
    handleSubmit,
}) => {
    const [actualTextInputSymbols, setActualTextInputSymbols] = useState(0);
    const [textValue, setTextInputValue] = useState("");

    const [actualTextAreaSymbols, setActualTextAreaSymbols] = useState(0);
    const [textareaValue, setTextareaValue] = useState("");

    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const [errorAlertText, setErrorAlertText] = useState("");

    const [createLevel, {}] = useCreateLevelMutation();

    const hideErrorAlert = () => setError(false);
    const showErrorAlert = (text: string) => {
        setError(true);
        setErrorAlertText(text);
        setTimeout(() => {
            hideErrorAlert();
        }, 4500);
    };

    const hideSuccessAlert = () => setSuccess(false);
    const showSuccessAlert = () => {
        setSuccess(true);
        setTimeout(() => {
            hideSuccessAlert();
        }, 4500);
    };

    const onTextAreaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        if (value.length <= Number(textareaMaxSymbols)) {
            setActualTextAreaSymbols(value.length);
            setTextareaValue(value);
        }
    };

    const onTextInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value.length <= Number(textInputMaxSymbols)) {
            setActualTextInputSymbols(value.length);
            setTextInputValue(value);
        }
    };

    const onSubmit = async (values: CreateLevelFormData) => {
        try {
            await createLevel({
                content: values.levelContent,
                name: values.levelName,
            }).unwrap();
            setIsLoading(true);
            setTextInputValue("");
            setTextareaValue("");
            setIsLoading(false);
            reset();
            setSuccess(true);

            showSuccessAlert();
        } catch (error: any) {
            showErrorAlert(error.message);
        }
    };

    return (
        <>
            <Alert
                message="Уровень успешно создан"
                open={success}
                type="success"
            />
            <Alert message={errorAlertText} open={error} type="error" />
            <form
                onSubmit={handleSubmit(onSubmit)}
                className={style.createLevelform}
            >
                <div
                    className={cn(style.inputElem, style.createLevelformInput)}
                >
                    <h3 className={style.inputLabel}>Название</h3>
                    <Field
                        component={TextInput}
                        name="levelName"
                        validate={[requiredValidator, maxLength15]}
                        placeholder="Название уровня"
                        onChange={onTextInputChange}
                        actualSymbols={actualTextInputSymbols}
                        maxSymbols={textInputMaxSymbols}
                        countSymbols={true}
                        inputValue={textValue}
                    />
                </div>

                <div
                    className={cn(style.inputElem, style.createLevelformInput)}
                >
                    <h3 className={style.inputLabel}>Контент</h3>
                    <Field
                        component={TextareaInput}
                        name="levelContent"
                        validate={[requiredValidator, maxLength350]}
                        placeholder="Контент уровня"
                        countSymbols={true}
                        maxSymbols={textareaMaxSymbols}
                        actualSymbols={actualTextAreaSymbols}
                        onChange={onTextAreaChange}
                        textareaValue={textareaValue}
                    />
                </div>

                <ActionButton
                    type={!submitting ? "submit" : "button"}
                    disabled={invalid || submitting}
                    text="Создать уровень"
                    loading={isLoading}
                    dataTestId="create-level-button"
                />
            </form>
        </>
    );
};

export const CreateLevelFormRedux = reduxForm<CreateLevelFormData>({
    form: "createLevelForm",
})(CreateLevelForm);
