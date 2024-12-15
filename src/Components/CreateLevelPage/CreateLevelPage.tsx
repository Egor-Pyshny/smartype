import { FC } from "react";
import { Navbar } from "../Navbar/Navbar";
import style from "./CreateLevelPage.module.css";
import { CreateLevelFormRedux } from "../Forms/CreateLevelForm";
import { Footer } from "../Footer/Footer";

type CreateLevelPageProps = {};

export const CreateLevelPage: FC<CreateLevelPageProps> = ({}) => {
    return (
        <>
            <Navbar />
            <div className="container">
                <div className={style.content}>
                    <CreateLevelFormRedux />
                </div>
            </div>
            <Footer />
        </>
    );
};
