export const STORAGE_USERNAME = '__STP_username__';
export const STORAGE_LEVEL_SYMBOLS = '__STP_level-symbols__';
export const STORAGE_LEVEL_COUNT = '__STP_level-count__';
export const STORAGE_LEVEL_ID = '__STP_level-id__';
export const STORAGE_IS_CUSTOM = '__STP_is-custom__';
export const STORAGE_PRACTICE_LANG = '__STP_practice-lang__';
export const STORAGE_CUSTOM_SYMBOLS = '__STP_custom-symbols__'

type TLangHash ={
    readonly [key: string]: string
}
export const langHash: TLangHash = {
    'ru': 'Русская раскладка',
    'en': 'English layout',
}

const someArr = ['Tab', 'CapsLock', 'Shift', 'Backspace', 'Control', 'Alt', 'Enter', 'ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft'];
const someMoreArr = ['Escape', 'AudioVolumeMute', 'AudioVolumeDown', 'AudioVolumeUp', 'Meta', 'Insert', 'Delete'];
export const insignificantKeys = new Set([...someArr, ...someMoreArr]);

export const enum routes {
    MAIN_PAGE = '/',
    LOGIN_PAGE = '/login',
    REGISTRATION_PAGE = '/registration',
    LEVEL_PAGE = '/level',
    TEST_PAGE = '/test',
    TESTING_PAGE = '/testing',
    THEORY_PAGE = '/theory',
    PROFILE_PAGE = '/profile',
    CREATE_LEVEL_PAGE = '/create-level',

}

export const defaultPacmanColor = '#f2d648';
export const defaultPacmanType = 'circle';

export const enAlphabet = 'abcdefghijklmnopqrstuvwxyz';
export const ruAlphabet = 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя';