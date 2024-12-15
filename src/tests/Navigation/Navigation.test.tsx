import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { act } from "react-dom/test-utils";
import { Provider } from "react-redux";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { AboutTest } from "../../Components/AboutTest/AboutTest";
import { SingleLevel } from "../../Components/Level/SingleLevel";
import { LevelsPage } from "../../Components/Levels/LevelsPage";
import { ProfilePageContainer } from "../../Components/ProfilePage/ProfilePageContainer";
import { TestingPage } from "../../Components/TestingPage/TestingPage";
import { TheoryPage } from "../../Components/TheoryPage/TheoryPage";
import { routes } from "../../models/constants/constants";
import { store } from "../../store/store";

describe("Тестирование роутера", () => {
    beforeEach(() => {
        render(
            <MemoryRouter>
                <Provider store={store}>
                    <Routes>
                        <Route
                            path={routes.MAIN_PAGE}
                            element={<LevelsPage />}
                        />
                        <Route
                            path={routes.LEVEL_PAGE}
                            element={<SingleLevel />}
                        />
                        <Route
                            path={routes.TEST_PAGE}
                            element={<AboutTest />}
                        />
                        <Route
                            path={routes.TESTING_PAGE}
                            element={<TestingPage />}
                        />
                        <Route
                            path={routes.THEORY_PAGE}
                            element={<TheoryPage />}
                        />
                        <Route
                            path={routes.PROFILE_PAGE}
                            element={<ProfilePageContainer />}
                        />
                    </Routes>
                </Provider>
            </MemoryRouter>
        );
    });

    it("Начальная страница - Levels Page", () => {
        const levelsPage = screen.queryByTestId("levels-page");
        expect(levelsPage).toBeInTheDocument();

        const levelsLabel = screen.getByText("уровни");
        expect(levelsLabel).toHaveStyle(
            "background-color: var(--bg-link-active)"
        );
    });

    it("переходы по роутам отрабатывают корректно", async () => {
        const levelsLabel = screen.getByText('уровни');
        expect(levelsLabel).toHaveStyle('background-color: var(--bg-link-active)');
        const testingLabel = screen.getByText("тестирование");
        act(() => {
            userEvent.click(testingLabel);
        });
        const testingPage = screen.queryByTestId("about-test-page");
        expect(testingPage).toBeInTheDocument();
        expect(testingLabel).toHaveStyle(
            "background-color: var(--bg-link-active)"
        );

        const theoryLabel = screen.getByText("теория");
        act(() => {
            userEvent.click(theoryLabel);
        });
        const theoryPage = screen.queryByTestId("theory-page");
        expect(theoryPage).toBeInTheDocument();
        expect(theoryLabel).toHaveStyle(
            "background-color: var(--bg-link-active)"
        );

        const profileLabel = screen.getByText("профиль");
        act(() => {
            userEvent.click(profileLabel);
        });
        expect(profileLabel).toHaveStyle(
            "background-color: var(--bg-link-active)"
        );
    });
});
