import { useGetPassedLevelsQuery } from '../../../../api/profileApi/profileApi';
import { useAuth } from '../../../../store/hooks/useAuth';
import { Loader } from '../../../Loader/Loader';
import { UserLevelItem } from "../UserLevelItem/UserLevelItem";
import s from './UserLevels.module.css';

export const UserLevelsList = () => {

    const {uid} = useAuth();
    const {data, isLoading} = useGetPassedLevelsQuery({uid: uid as string});

    return (
        <div className={s.profileLevels}>
            {
                isLoading ?
                    
                    <Loader width={55} height={55} strokeWidth={5} style={{ display: 'flex', justifyContent: 'center'}} />
                    :
                    data?.length === 0 ? <div style={{ marginTop: 20, textAlign: 'center' }}>Вы ещё не проходили уровней</div>
                        :
                        data?.map((lvl, ind) => <UserLevelItem
                            accuracy={lvl.accuracy}
                            count={lvl.count}
                            num={ind + 1}
                            speed={lvl.speed}
                            symb={lvl.symb}
                            time={lvl.time}
                            key={lvl.id}
                        />)
            }
        </div>
    )
}