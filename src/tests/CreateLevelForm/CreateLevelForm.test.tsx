import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { LoginPage } from "../../Components/LoginPage/LoginPage";
import { store } from "../../store/store";
import { RegisterPage } from "../../Components/RegisterPage/RegisterPage";
import { CreateLevelFormRedux } from "../../Components/Forms/CreateLevelForm";

describe("Блокировка кнопки 'Создать уровень'", () => {
    beforeEach(() => {
        render(
            <MemoryRouter>
                <Provider store={store}>
                    <CreateLevelFormRedux />
                </Provider>
            </MemoryRouter>
        );
    });

    it("При открытии страницы кнопка задизеблина", () => {
        const button = screen.getByTestId("create-level-button");
        expect(button).toBeDisabled();
    });

    it("LevelName валидный, Content - нет => кнопка задизейблина", () => {
        const levelName = screen.getByTestId("text-input");
        const button = screen.getByTestId("create-level-button");
        act(() => {
            userEvent.type(levelName, "test name");
        });
        expect(button).toBeDisabled();
    });

    it("Password валидный, email - нет => кнопка задизейблина", () => {
        const levelContent = screen.getByTestId("textarea-input");
        const button = screen.getByTestId("create-level-button");
        act(() => {
            userEvent.clear(levelContent);
            userEvent.type(levelContent, "new level content");
        });
        expect(button).toBeDisabled();
    });

    it("LevelName - превышен лимит текста, Content валидный => кнопка задизейблина", () => {
        const levelName = screen.getByTestId("text-input");
        const levelContent = screen.getByTestId("textarea-input");
        const button = screen.getByTestId("create-level-button");
        const text = 'Text name is test'
         expect(text).toHaveLength(17);
        act(() => {
            userEvent.type(levelContent, 'test content');

            userEvent.clear(levelName);
            userEvent.type(levelName, text);
        }); 
        expect(button).toBeDisabled();
    });

    it("LevelName валидно, Content - превышен лимит текста => кнопка задизейблина", () => {
        const levelName = screen.getByTestId("text-input");
        const levelContent = screen.getByTestId("textarea-input");
        const button = screen.getByTestId("create-level-button");
        const text = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent eu lacinia justo. Integer in congue nulla. Sed sollicitudin, odio sed efficitur fringilla, ipsum turpis commodo diam, ac porttitor nulla augue sit amet est. Vestibulum varius accumsan diam, sit amet facilisis urna tempus vitae. Sed id dui vitae libero commodo rhoncus. In varius dante.";
        expect(text).toHaveLength(351);
        act(() => {
            userEvent.type(levelName, "test name");
            userEvent.tab();

            userEvent.clear(levelContent);
            userEvent.type(levelContent, text);
        }); 
        expect(button).toBeDisabled();
    });

    it("Все поля валидны => кнопка раздизейблина", () => {
        const levelName = screen.getByTestId("text-input");
        const levelContent = screen.getByTestId("textarea-input");
        const button = screen.getByTestId("create-level-button");
        act(() => {
            userEvent.type(levelName, "test name");
            userEvent.tab();

            userEvent.clear(levelContent);
            userEvent.type(levelContent, "test content");
            userEvent.tab();
        });
        expect(button).not.toBeDisabled();
    });
});
