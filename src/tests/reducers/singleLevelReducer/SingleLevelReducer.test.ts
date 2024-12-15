import { ISingleLevel } from "../../../models/types";
import singleLevelReducer, { setIsCustom, setIsPractice, setSymbols, setTextToWrite, setWrittenText } from "../../../store/reducers/SingleLevelSclice";

const initialState: ISingleLevel = {
    isCustom: false,
    isPractice: false,
    symbols: "",
    lang: "",
    short: "",
    textToWrite: "",
    writtenText: "",
    isLoading: false,
    delta: 0,
    error: "",
    lvlId: 0,
    count: 0,
};

describe("SingleLevelReducer", ()=> {
    it("Setting symbols", ()=> {
        const symbols = 'symbols';
        expect(singleLevelReducer(initialState, setSymbols(symbols)).symbols).toBe(symbols);
    });

    it("Setting textToWrite", ()=> {
        const textToWrite = 'some text';
        expect(singleLevelReducer(initialState, setTextToWrite(textToWrite)).textToWrite).toBe(textToWrite);
    });

    it("Setting writtenText", ()=> {
        const writtemtText = 'written text';
        expect(singleLevelReducer(initialState, setWrittenText(writtemtText)).writtenText).toBe(writtemtText);
    });

    it("Setting isCustom", ()=> {
        const isCustom = true;
        expect(singleLevelReducer(initialState, setIsCustom(isCustom)).isCustom).toBe(isCustom);
    });

    it("Setting isPractice", ()=> {
        const isPractice = true;
        expect(singleLevelReducer(initialState, setIsPractice(isPractice)).isPractice).toBe(isPractice);
    });
})