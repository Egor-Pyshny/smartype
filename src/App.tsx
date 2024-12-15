import { Route, Routes } from "react-router-dom";
import { AboutTest } from "./Components/AboutTest/AboutTest";
import { CheckAuth } from "./Components/CheckAuth/CheckAuth";
import { CreateLevelPage } from "./Components/CreateLevelPage/CreateLevelPage";
import { SingleLevel } from "./Components/Level/SingleLevel";
import { LevelsPage } from "./Components/Levels/LevelsPage";
import { LoginPage } from "./Components/LoginPage/LoginPage";
import { ProfilePageContainer } from "./Components/ProfilePage/ProfilePageContainer";
import { RegisterPage } from "./Components/RegisterPage/RegisterPage";
import { TestingPage } from "./Components/TestingPage/TestingPage";
import { TheoryPage } from "./Components/TheoryPage/TheoryPage";
import { routes } from "./models/constants/constants";
import { useAppDispatch, useAppSelector } from "./store/hooks/redux-hooks";
import { useEffect } from "react";
import { useGetUserMarketHistoryQuery, useGetUserPacmanSettingsQuery } from "./api/userApi/userApi";
import { setMarketHistory, setPacmanColor, setPacmanType } from "./store/reducers/UserSlice";
import { MarketHistory } from "./models/types";
import { keyboard } from "@testing-library/user-event/dist/keyboard";
import { Error } from "./Components/Error/Error";

function App() {
    const dispatch = useAppDispatch();
    const { uid } = useAppSelector((state) => state.user);
    const {data} = useGetUserPacmanSettingsQuery({uid: uid as string});

    const {data: marketHistory} = useGetUserMarketHistoryQuery({uid: uid as string});

    useEffect(() => {
        if(data){
          dispatch(setPacmanColor(data.pacmanColor));
          dispatch(setPacmanType(data.pacmanType));
        }
    }, [data]);

    useEffect(() => {
        if(marketHistory){
          dispatch(setMarketHistory(marketHistory));
        }
    }, [marketHistory]);

    return (
        <div className="App">
            <Routes>
                <Route path={routes.LOGIN_PAGE} element={<LoginPage />} />
                <Route
                    path={routes.REGISTRATION_PAGE}
                    element={<RegisterPage />}
                />
                <Route
                    path={routes.MAIN_PAGE}
                    element={
                        <CheckAuth>
                            <LevelsPage />
                        </CheckAuth>
                    }
                />
                <Route
                    path={routes.LEVEL_PAGE}
                    element={
                        <CheckAuth>
                            <SingleLevel />
                        </CheckAuth>
                    }
                />
                <Route
                    path={routes.TEST_PAGE}
                    element={
                        <CheckAuth>
                            <AboutTest />
                        </CheckAuth>
                    }
                />
                <Route
                    path={routes.TESTING_PAGE}
                    element={
                        <CheckAuth>
                            <TestingPage />
                        </CheckAuth>
                    }
                />
                <Route
                    path={routes.THEORY_PAGE}
                    element={
                        <CheckAuth>
                            <TheoryPage />
                        </CheckAuth>
                    }
                />
                <Route
                    path={routes.PROFILE_PAGE}
                    element={
                        <CheckAuth>
                            <ProfilePageContainer />
                        </CheckAuth>
                    }
                />
                <Route
                    path={routes.CREATE_LEVEL_PAGE}
                    element={
                        <CheckAuth>
                            <CreateLevelPage />
                        </CheckAuth>
                    }
                />
                <Route path="/*" element={<Error />}/>
            </Routes>
        </div>
    );
}

export default App;
