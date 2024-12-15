import { FC, useEffect, useState } from "react";
import { useGetProfileDataQuery } from "../../api/profileApi/profileApi";
import { useLazyGetUserCoinsQuery } from "../../api/userApi/userApi";
import { useAppDispatch, useAppSelector } from "../../store/hooks/redux-hooks";
import { useAuth } from "../../store/hooks/useAuth";
import { setProfileUserData } from "../../store/reducers/ProfileSlice";
import { setCoins } from "../../store/reducers/UserSlice";
import { Alert } from "../Alerts/Alert";
import { Loader } from "../Loader/Loader";
import { Navbar } from "../Navbar/Navbar";
import { ProfilePage } from "./ProfilePage";

interface IProfilePageContainer {}

export const ProfilePageContainer: FC<IProfilePageContainer> = () => {
    const dispatch = useAppDispatch();
    const { maxTestAccuracy, maxTestSpeed, levelsCount } = useAppSelector(
        (state) => state.profilePage
    );
    const { name, coins } = useAppSelector((state) => state.user);
    const user = useAuth();
    const { data, isLoading } = useGetProfileDataQuery({
        uid: user.uid as string,
    });
    const [getCoins] = useLazyGetUserCoinsQuery();
    const [errorAlert, setErrorAlert] = useState(false);
    const [alertText, setAlertText] = useState("");

    const hideErrorAlert = () => setErrorAlert(false);
    const showErrorAlert = (text: string) => {
        setErrorAlert(true);
        setAlertText(text);
        setTimeout(() => {
            hideErrorAlert();
        }, 4500);
    };

    useEffect(() => {
        if (data) {
            dispatch(setProfileUserData(data));
        }
    }, [data]);

    useEffect(() => {
        const fetchCoins = async () => {
            try {
                const coins = await getCoins(user.uid as string).unwrap();
                dispatch(setCoins(coins));
            } catch (error: any) {
                showErrorAlert(error.message);
            }
        };
        if (user.uid) {
            fetchCoins();
        }
    }, [user.uid]);

    return (
        <>
            {<Alert message={alertText} open={errorAlert} type="error" />}
            <Navbar />
            {isLoading ? (
                <Loader
                    width={80}
                    height={80}
                    style={{ display: "flex", justifyContent: "center" }}
                    strokeWidth={5}
                />
            ) : (
                <ProfilePage
                    accuracy={maxTestAccuracy}
                    count={levelsCount}
                    speed={maxTestSpeed}
                    username={String(name)}
                    coins={coins}
                />
            )}
        </>
    );
};
