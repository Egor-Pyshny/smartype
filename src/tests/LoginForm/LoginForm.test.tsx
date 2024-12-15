import {
    act,
    fireEvent,
    render,
    screen,
    waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { useLoginMutation } from "../../api/authApi/authApi";
import { LevelsPage } from "../../Components/Levels/LevelsPage";
import { LoginPage } from "../../Components/LoginPage/LoginPage";
import { routes } from "../../models/constants/constants";
import { store } from "../../store/store";

// jest.mock("./api/authApi/authApi", () => ({
//     ...jest.requireActual("./api/authApi/authApi"),
//     login: jest.fn().mockReturnValue([
//         jest.fn().mockResolvedValue({
//             data: {
//                 user: {
//                     displayName: "Test User",
//                     uid: "Dcij46pJUDRReyUsDlal8W4WkCJ2",
//                 },
//             },
//         }),
//     ]),
// }));

// jest.mock("./api/authApi/authApi");

// mockedLoginMutation.mockReturnValueOnce([
//     jest.fn().mockResolvedValue({
//         data: {
//             user: {
//                 displayName: "Test User",
//                 uid: "Dcij46pJUDRReyUsDlal8W4WkCJ2",
//             },
//         },
//     }),
//     {
//         originalArgs: {
//             email: 'test@gmail.com',
//             password: 'testpass'
//         },
//         reset: ()=> console.log('object'),
//     }
// ]);

// const mockedLoginMutation = useLoginMutation as jest.MockedFunction<
//     typeof useLoginMutation
// >;

describe("Блокировка кнопки 'Вход'", ()=> {
    beforeEach(()=> {
        render(
            <MemoryRouter>
                <Provider store={store}>
                    <LoginPage />
                </Provider>
            </MemoryRouter>
        );
    })

    it('При открытии страницы кнопка задизеблина', ()=> {
        const button = screen.getByTestId('signIn-button');
        expect(button).toBeDisabled();
    })

    it('Email валидный, password - нет => кнопка задизейблина', ()=> {
        const emailInput = screen.getByTestId("emailInput");
        const passwordInput = screen.getByTestId("passwordInput");
        const button = screen.getByTestId('signIn-button');
        act(()=> {
            userEvent.type(emailInput, 'test@gmail.com');

            userEvent.clear(passwordInput);
            userEvent.type(passwordInput, 'pass');
            userEvent.tab();
        });
        expect(screen.queryByText(/Неверный формат email./i)).not.toBeInTheDocument();
        expect(screen.queryByText(/Минимум 6 символов./i)).toBeInTheDocument();
        expect(button).toBeDisabled();
    });

    it('Password валидный, email - нет => кнопка задизейблина', ()=> {
        const emailInput = screen.getByTestId("emailInput");
        const passwordInput = screen.getByTestId("passwordInput");
        const button = screen.getByTestId('signIn-button');
        act(()=> {
            userEvent.type(emailInput, 'abracadabra');
            userEvent.tab();

            userEvent.clear(passwordInput);
            userEvent.type(passwordInput, 'testpass');
            userEvent.tab();
        });
        expect(screen.queryByText(/Неверный формат email./i)).toBeInTheDocument();
        expect(screen.queryByText(/Минимум 6 символов./i)).not.toBeInTheDocument();
        expect(button).toBeDisabled();
    });

    it('Все поля валидны => кнопка раздизейблина', ()=> {
        const emailInput = screen.getByTestId("emailInput");
        const passwordInput = screen.getByTestId("passwordInput");
        const button = screen.getByTestId('signIn-button');
        act(()=> {
            userEvent.type(emailInput, 'test@gmail.com');
            userEvent.tab();

            userEvent.clear(passwordInput);
            userEvent.type(passwordInput, 'testpass');
            userEvent.tab();
        });
        expect(screen.queryByText(/Неверный формат email./i)).not.toBeInTheDocument();
        expect(screen.queryByText(/Минимум 6 символов./i)).not.toBeInTheDocument();
        expect(button).not.toBeDisabled();
    })

})