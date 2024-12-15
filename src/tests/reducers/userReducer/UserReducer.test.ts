import { MarketHistory, PacmanForm } from "../../../models/types";
import userReducer, {
    IUser,
    PacmanSettings,
    setCoins,
    setMarketHistory,
    setUser,
} from "../../../store/reducers/UserSlice";

const initialState: IUser & PacmanSettings & MarketHistory = {
    name: null,
    email: null,
    img: null,
    coins: 0,
    uid: null,
    pacmanColor: "",
    pacmanType: "",
    colors: [],
    pacmans: [],
};

describe("User Reducer", () => {
    it("Setting name", () => {
        const newUser: IUser = {
                coins: 0,
                email: "email@gmail.com",
                img: null,
                name: "Test User",
                uid: "testuseruid",
            
        }
        expect(
            userReducer(
                initialState,
                setUser(newUser)
            )
        ).toEqual({...initialState, ...newUser})
    });

    it("Setting coins", ()=> {
        const coins = 1000;
        expect(userReducer(initialState, setCoins(coins))).toEqual({...initialState, coins});
    })

    it('Setting market history', ()=> {
        const colors: string[] = ['red', 'green', 'blue'];
        const pacmans: PacmanForm[] = ['circle', 'square'];
        const marketHostory: MarketHistory = {
            colors,
            pacmans
        } 
        expect(userReducer(initialState, setMarketHistory(marketHostory))).toEqual({...initialState, ...marketHostory});
    })
});
