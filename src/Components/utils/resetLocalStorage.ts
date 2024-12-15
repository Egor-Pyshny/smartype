import { STORAGE_CUSTOM_SYMBOLS, STORAGE_IS_CUSTOM, STORAGE_LEVEL_COUNT, STORAGE_LEVEL_ID, STORAGE_LEVEL_SYMBOLS, STORAGE_PRACTICE_LANG, STORAGE_USERNAME } from "../../models/constants/constants"

export const resetLocalStorage = ()=> {
    localStorage.removeItem(STORAGE_USERNAME);
    localStorage.removeItem(STORAGE_LEVEL_SYMBOLS);
    localStorage.removeItem(STORAGE_LEVEL_COUNT);
    localStorage.removeItem(STORAGE_LEVEL_ID);
    localStorage.removeItem(STORAGE_IS_CUSTOM);
    localStorage.removeItem(STORAGE_PRACTICE_LANG);
    localStorage.removeItem(STORAGE_CUSTOM_SYMBOLS);
}