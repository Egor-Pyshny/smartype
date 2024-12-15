import { useGetRatingQuery } from "../../../api/profileApi/profileApi";
import {
    useAppSelector
} from "../../../store/hooks/redux-hooks";
import { Loader } from "../../Loader/Loader";
import { RatingItem } from "../RatingItem/RatingItem";
import s from "./Rating.module.css";

export const RatingList = () => {
    const { uid } = useAppSelector((state) => state.user);
    const { data, isLoading } = useGetRatingQuery(null);


    return (
        <div className={s.profileRating}>
            {isLoading ? (
                <Loader
                    width={55}
                    height={55}
                    style={{ display: "flex", justifyContent: "center" }}
                    strokeWidth={5}
                />
            ) : data?.length === 0 ? (
                <div style={{ marginTop: 20, textAlign: "center" }}>
                    Результаты отсутствуют
                </div>
            ) : (
                data?.map((item, ind) => (
                    <RatingItem
                        accuracy={item.accuracy}
                        speed={item.speed}
                        username={item.username}
                        num={ind + 1}
                        me={uid === item.uid}
                        key={item.uid}
                    />
                ))
            )}
        </div>
    );
};
