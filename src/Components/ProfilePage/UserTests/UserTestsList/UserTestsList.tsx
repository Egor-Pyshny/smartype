import { useGetUserTestsQuery } from '../../../../api/profileApi/profileApi';
import { useAuth } from '../../../../store/hooks/useAuth';
import { Loader } from '../../../Loader/Loader';
import { UserTestItem } from "../UserTestItem/UserTestItem";
import s from './UserTests.module.css';

export const UserTestsList = () => {
    const {uid} = useAuth();
    const {data, isLoading} = useGetUserTestsQuery({uid: uid as string});

    return (
        <div className={s.profileTests}>
            {
                isLoading ?
                    <Loader width={55} height={55} style={{ display: 'flex', justifyContent: 'center' }} strokeWidth={5} />
                    :
                    data?.length === 0 ?
                        <div style={{ marginTop: 20, textAlign: 'center' }}>Вы ещё не проходили тестов</div>
                        :
                        data?.map((test, ind) => <UserTestItem
                            accuracy={test.accuracy}
                            date={test.date}
                            speed={test.speed}
                            num={ind + 1}
                            key={ind} />)
            }
        </div>
    )
}