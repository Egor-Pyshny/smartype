import s from './Footer.module.css';

export const Footer = ()=>{
    return(
        <footer className={s.footer}>© SMARTYPE {new Date().getFullYear()} - стремись к лучшему</footer>
        
    )
}