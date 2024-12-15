import { IUser, PacmanSettings } from "../store/reducers/UserSlice";

export interface ILevelsPageState {
    layoutLang: KeyBoardLayouts;
    layoutNavbar: KeyBoardLayouts;
    levels: ILevels[];
    practice: IPractice[];
    levelsIsFetching: boolean;
    practiceIsFetching: boolean;
}
export type KeyBoardLayouts = 'ru' | 'en'
export interface ILevels {
    symb: string;
    count: number;
    time: string;
    speed: number;
    accuracy: number;
    id: number;
}
export interface IPractice {
    lang: string;
    short: string;
    time: string;
    speed: number;
    accuracy: number;
}

export interface ISingleLevel {
    symbols: string;
    lang: string;
    short: string;
    count: number;
    isPractice: boolean;
    isCustom: boolean;
    lvlId?: number; //потому что у practice нет id
    textToWrite: string;
    writtenText: string;
    isLoading: boolean;
    delta: number;
    error: string;
}

export interface ITestSlice {
    lang: string;
    text: string;
    isLoading: boolean;
    delta: number;
    error: string;
    bestSpeed: number;
    bestAccuracy: number;
}

export interface ITest {
    accuracy: number;
    speed: number;
    date: string;
}

export interface IRatingItem {
    accuracy: number;
    speed: number;
    uid: string;
    username: string;
}

export interface IProfile {
    levelsCount: number,
    maxTestSpeed: number,
    maxTestAccuracy: number,
    passedLevels: ILevels[];
    tests: ITest[];
    ratingList: IRatingItem[];
    products: ProductDto[];
    currentProduct: ProductDto | null,
}

export interface IFaqItem {
    q: string,
    a:{
        img: {
            name: string,
            alt: string,
        },
        p: string[],
        ul?: string[]
    }
}

export interface IFaqSlice {
    faqs: IFaqItem[],
}

export type QueryFnError = {
    message: string,
}

export type LoginDto = {
    email: string,
    password: string,
}

export type CreateUserDto = {
    name: string,
    email: string,
    password: string,
}

export type UserDbInitialization = IUser & PacmanSettings & {
    marketHistory: MarketHistory
}

export type UpdateLevel = ILevels & {layoutLang: string, uid: string}

export type UpdateProgress = Omit<UpdateLevel, 'layoutLang'>

export type UpdatePractice = Omit<IPractice & {uid: string}, 'short'>

export type BestResultsResponse = {
    speed: number;
    accuracy: number;
}

export type UpdateTestRecordDto = {
    uid: string,
    speed: number,
    accuracy: number,
}
export type UpdateTestDto = ITest & {uid: string}
export type UpdateRatingDto = UpdateTestDto;

export type GetProfileResponse = {
    count: number;
    accuracy: number;
    speed: number;
}

export type ICusomLevel = {
    name: string,
    time: string;
    speed: number;
    accuracy: number;
    id: number;
}

export type CreateLevelDto = {
    name: string,
    content: string,
}

export type UpdateCustomLevelDto = {
    id: number,
    accuracy: number,
    speed: number,
    time: string,
}

export type UpdateCoinsDto = {
    uid: string,
    coins: number,
}
export type UpdatePacmanColorDto = {
    uid: string,
    color: string,
}
export type UpdatePacmanTypeDto = {
    uid: string,
    pacmanType: PacmanForm,
}

// market api
export type PacmanForm = 'circle' | 'square' | '';
export type ProductType = 'pacman' | 'color';

export type ProductDto = {
    type: ProductType,
    cost: number,
    value: string | PacmanForm,

}
export type BuyColorDto = {
    uid: string,
    color: string,
}
export type BuyPacmanDto = {
    uid: string,
    pacman: PacmanForm,
}
export type MarketHistory = {
    colors: string[]
    pacmans: PacmanForm[]
}