import s from './Navbar.module.css';
import {useState} from 'react';
import {NavLink} from 'react-router-dom';
import { routes } from '../../models/constants/constants';

export const Navbar = ()=> {
    const [collapsed, setCollapsed] = useState(true)
    const navigationCollapse = ()=>{
        setCollapsed(prev => !prev);
    }

    return(
        <div className={"container" + (collapsed ? '' : " "+s.heightAlign)} data-testid='navigation-bar'>
            <header className={s.header}>
                <nav className={s.nav}>
                    <div className={s.logo}>
                        <NavLink to={routes.MAIN_PAGE}>SmarType</NavLink>
                        <div className={s.burger} onClick={navigationCollapse}>
                            <span className={s.burgerItem + (collapsed ? '' : " "+s.first)}></span>
                            <span className={s.burgerItem + (collapsed ? '' : " "+s.second)}></span>
                            <span className={s.burgerItem + (collapsed ? '' : " "+s.third)}></span>
                        </div>
                    </div>
                    <ul className={s.navigationList + (collapsed ? '' : " " +s.opacity)}>
                        <li className={s.navigationItem}><NavLink to={routes.MAIN_PAGE} 
                                                                  className={({ isActive }) =>
                                                                    isActive ? s.active : ""
                                                                  }
                                                                  >уровни</NavLink></li>
                        <li className={s.navigationItem}><NavLink to={routes.TEST_PAGE} 
                                                                  className={({ isActive }) =>
                                                                    isActive ? s.active : ""
                                                                  }
                                                                  >тестирование</NavLink></li>
                        <li className={s.navigationItem}><NavLink to={routes.THEORY_PAGE} 
                                                                  className={({ isActive }) =>
                                                                    isActive ? s.active : ""
                                                                  }
                                                                  >теория</NavLink></li>
                        <li className={s.navigationItem}><NavLink to={routes.PROFILE_PAGE} 
                                                                  className={({ isActive }) =>
                                                                    isActive ? s.active : ""
                                                                  }
                                                                  >профиль</NavLink></li>
                    </ul>
                </nav>
            </header>
        </div>
    )
}