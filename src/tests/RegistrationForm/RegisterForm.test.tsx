import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { LoginPage } from "../../Components/LoginPage/LoginPage";
import { store } from "../../store/store";
import { RegisterPage } from "../../Components/RegisterPage/RegisterPage";

describe("Блокировка кнопки 'Регистрация'", () => {
    beforeEach(() => {
        render(
            <MemoryRouter>
                <Provider store={store}>
                    <RegisterPage />
                </Provider>
            </MemoryRouter>
        );
    });

    it("При открытии страницы кнопка задизеблина", () => {
        const button = screen.getByTestId("register-button");
        expect(button).toBeDisabled();
    });

    it("Email валидный, password - нет => кнопка задизейблина", () => {
        const emailInput = screen.getByTestId("emailInput");
        const passwordInput = screen.getByTestId("passwordInput");
        const button = screen.getByTestId("register-button");
        act(() => {
            userEvent.type(emailInput, "test@gmail.com");

            userEvent.clear(passwordInput);
            userEvent.type(passwordInput, "pass");
            userEvent.tab();
        });
        expect(
            screen.queryByText(/Неверный формат email./i)
        ).not.toBeInTheDocument();
        expect(screen.queryByText(/Минимум 6 символов./i)).toBeInTheDocument();
        expect(button).toBeDisabled();
    });

    it("Password валидный, email - нет => кнопка задизейблина", () => {
        const emailInput = screen.getByTestId("emailInput");
        const passwordInput = screen.getByTestId("passwordInput");
        const button = screen.getByTestId("register-button");
        act(() => {
            userEvent.type(emailInput, "abracadabra");
            userEvent.tab();

            userEvent.clear(passwordInput);
            userEvent.type(passwordInput, "testpass");
            userEvent.tab();
        });
        expect(
            screen.queryByText(/Неверный формат email./i)
        ).toBeInTheDocument();
        expect(
            screen.queryByText(/Минимум 6 символов./i)
        ).not.toBeInTheDocument();
        expect(button).toBeDisabled();
    });

    it("Все поля валидны => кнопка раздизейблина", () => {
        const emailInput = screen.getByTestId("emailInput");
        const passwordInput = screen.getByTestId("passwordInput");
        const usernameInput = screen.getByTestId("username-input");
        const button = screen.getByTestId("register-button");
        act(() => {
            userEvent.type(emailInput, "test@gmail.com");
            userEvent.tab();

            userEvent.clear(usernameInput);
            userEvent.type(usernameInput, "test user");
            userEvent.tab();

            userEvent.clear(passwordInput);
            userEvent.type(passwordInput, "testpass");
            userEvent.tab();
        });
        expect(
            screen.queryByText(/Неверный формат email./i)
        ).not.toBeInTheDocument();
        expect(
            screen.queryByText(/Минимум 6 символов./i)
        ).not.toBeInTheDocument();
        expect(
            screen.queryByText(/Обязательное поле/i)
        ).not.toBeInTheDocument();
        expect(button).not.toBeDisabled();
    });
});
