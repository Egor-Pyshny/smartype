import React, { FC, ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useAppDispatch } from "../../store/hooks/redux-hooks";
import { removeUser, setUser } from "../../store/reducers/UserSlice";
import { useAuth } from "../../store/hooks/useAuth";
import { routes } from "../../models/constants/constants";

interface IChechAuthProps {
    children: ReactNode;
}

export const CheckAuth: FC<IChechAuthProps> = (props) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { children } = props;
    const auth = getAuth();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const checkSessionTimeout = () => {
        onAuthStateChanged(auth, (userInfo) => {
            if (userInfo) {
                // Пользователь аутентифицирован и сессия активна
                dispatch(
                    setUser({
                        email: userInfo.email,
                        name: userInfo.displayName,
                        img: userInfo.photoURL,
                        coins: 0,
                        uid: userInfo.uid,
                    })
                );
                setIsLoading(false);
            } else {
                // Пользователь не аутентифицирован или сессия истекла
                dispatch(removeUser());
                setTimeout(() => {
                    navigate(routes.LOGIN_PAGE);
                }, 100);
            }
        });
    };

    useEffect(() => {
        checkSessionTimeout();
        return () => checkSessionTimeout();
    }, [auth]);

    if (isLoading) return <p style={{ fontSize: 16 }}>Loading...</p>;

    return <>{children}</>;
};
