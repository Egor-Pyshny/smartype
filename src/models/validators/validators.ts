export const minLengthValidator = (min: number) => (value: string) => {
    if (value && value.length < min) {
        return `Минимум ${min} символов.`;
    }
    return undefined;
};

export const maxLengthValidator = (max: number) => (value: string) => {
    if (value && value.length > max) {
        return `Максимум ${max} символов.`;
    }
    return undefined;
};

export const requiredValidator = (value: string) => {
    if (!value) {
        return "Обязательное поле";
    }
    return undefined;
};

const emailRegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
export const emailValidator = (value: string) => {
    if (!emailRegExp.test(value)) {
        return `Неверный формат email.`;
    }
    return undefined;
};
