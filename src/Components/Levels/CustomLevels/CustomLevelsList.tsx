import { FC } from "react";
import { AddCustomLevelButton } from "../AddCustomLevelButton/AddCustomLevelButton";
import styles from "./CustomLevel.module.css";
import { ICusomLevel } from "../../../models/types";
import { CustomLevel } from "./CustomLevel";

type CustomLevelsListProps = {
    customLevels: ICusomLevel[];
};

export const CustomLevelsList: FC<CustomLevelsListProps> = ({
    customLevels,
}) => {
    return (
        <div className={styles.customLevelsWrap}>
            {customLevels?.map((level) => (
                <CustomLevel
                    key={level.id}
                    accuracy={level.accuracy}
                    name={level.name}
                    id={level.id}
                    time={level.time}
                    speed={level.speed}
                />
            ))}
            <AddCustomLevelButton />
        </div>
    );
};
