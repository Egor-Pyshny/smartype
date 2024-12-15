import { Provider } from "react-redux";
import { ReduxLoginForm } from "../../Components/Forms/LoginForm";
import { store } from "../../store/store";
import { render, screen } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { ReduxRegisterForm } from "../../Components/Forms/RegisterForm";
import { CreateLevelFormRedux } from "../../Components/Forms/CreateLevelForm";

describe("Валидация полей в форме 'Вход'", () => {
    beforeEach(() => {
        render(
            <MemoryRouter>
                <Provider store={store}>
                    <ReduxLoginForm />
                </Provider>
            </MemoryRouter>
        );
    });

    it("Поле email должно быть невалидным", () => {
        const emailInput = screen.getByTestId("emailInput");
        act(() => {
            userEvent.type(emailInput, "testgmail.com");
            userEvent.tab();
        });
        expect(
            screen.queryByText(/Неверный формат email./i)
        ).toBeInTheDocument();
    });

    it("Поле email должно быть валидным", () => {
        const emailInput = screen.getByTestId("emailInput");
        act(() => {
            userEvent.type(emailInput, "test@gmail.com");
            userEvent.tab();
        });
        expect(
            screen.queryByText(/Неверный формат email./i)
        ).not.toBeInTheDocument();
    });

    it("Поле password должно быть невалидным", () => {
        const passwordInput = screen.getByTestId("passwordInput");
        act(() => {
            userEvent.type(passwordInput, "test");
            userEvent.tab();
        });
        expect(screen.queryByText(/Минимум 6 символов./i));
    });

    it("Поле password должно быть валидным", () => {
        const passwordInput = screen.getByTestId("passwordInput");
        act(() => {
            userEvent.type(passwordInput, "testpass");
            userEvent.tab();
        });
        expect(
            screen.queryByText(/Минимум 6 символов./i)
        ).not.toBeInTheDocument();
    });
});

describe("Валидация полей в форме 'Регистрация'", () => {
    beforeEach(() => {
        render(
            <MemoryRouter>
                <Provider store={store}>
                    <ReduxRegisterForm />
                </Provider>
            </MemoryRouter>
        );
    });

    it("Поле username должно быть валидным", () => {
        const usernameInput = screen.getByTestId("username-input");
        act(() => {
            userEvent.type(usernameInput, "username");
            userEvent.tab();
        });
        expect(
            screen.queryByText(/Обязательное поле/i)
        ).not.toBeInTheDocument();
    });

    it("Поле username должно быть невалидным", () => {
        const usernameInput = screen.getByTestId("username-input");
        act(() => {
            userEvent.clear(usernameInput);
            userEvent.tab();
        });
        expect(screen.queryByText(/Обязательное поле/i)).toBeInTheDocument();
    });
});

describe("Валидация полей в форме создания уровня", () => {
    beforeEach(() => {
        render(
            <MemoryRouter>
                <Provider store={store}>
                    <CreateLevelFormRedux />
                </Provider>
            </MemoryRouter>
        );
    });

    it("Поле 'Название уровня' должно быть валидным", () => {
        const levelnameInput = screen.getByTestId("text-input");
        act(() => {
            userEvent.type(levelnameInput, "level name");
            userEvent.tab();
        });
        expect(
            screen.queryByText(/Обязательное поле/i)
        ).not.toBeInTheDocument();
    });

    it("Поле 'Название уровня' должно быть невалидным", () => {
        const levelnameInput = screen.getByTestId("text-input");
        act(() => {
            userEvent.clear(levelnameInput);
            userEvent.tab();
        });
        expect(screen.queryByText(/Обязательное поле/i)).toBeInTheDocument();
    });

    it("Поле 'Название уровня' не принимает текст длиной > 15 символов", () => {
        const levelnameInput = screen.getByTestId("text-input") as HTMLInputElement;
        const text = 'This is level 1';
        expect(text).toHaveLength(15);
        act(() => {
            userEvent.type(levelnameInput, text);
            userEvent.tab();
        });
        expect(levelnameInput.value).toHaveLength(15);

        act(() => {
            userEvent.type(levelnameInput, "more");
        });
        expect(levelnameInput.value).toHaveLength(15);
        expect(levelnameInput).toHaveValue(text);
        expect(screen.queryByText(/максимум 15 символов./i)).toBeInTheDocument();
    });

    it("Поле 'Контент уровня' должно быть валидным", () => {
        const levelContentInput = screen.getByTestId("textarea-input");
        act(() => {
            userEvent.type(levelContentInput, "level content");
            userEvent.tab();
        });
        expect(
            screen.queryByText(/Обязательное поле/i)
        ).not.toBeInTheDocument();
    });

    it("Поле 'Контент уровня' должно быть невалидным", () => {
        const levelContentInput = screen.getByTestId("textarea-input");
        act(() => {
            userEvent.clear(levelContentInput);
            userEvent.tab();
        });
        expect(screen.queryByText(/Обязательное поле/i)).toBeInTheDocument();
    });

    it("Поле 'Контент уровня' не принимает текст длиной > 350 символов", () => {
        const levelContentInput = screen.getByTestId("textarea-input");
        const text =
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent eu lacinia justo. Integer in congue nulla. Sed sollicitudin, odio sed efficitur fringilla, ipsum turpis commodo diam, ac porttitor nulla augue sit amet est. Vestibulum varius accumsan diam, sit amet facilisis urna tempus vitae. Sed id dui vitae libero commodo rhoncus. In varius ante.";
        expect(text).toHaveLength(350);

        act(() => {
            userEvent.type(levelContentInput, text);
        });
        expect(levelContentInput.textContent).toHaveLength(350);

        act(() => {
            userEvent.type(levelContentInput, "more");
        });
        expect(levelContentInput.textContent).toHaveLength(350);
        expect(levelContentInput).toHaveTextContent(text);  
    });
});
