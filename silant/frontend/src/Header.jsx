import React, {useState, useEffect} from "react";
import './css/Header.scss';
import './css/HeaderMobile.scss';
import { useNavigate } from "react-router-dom";
import { useMachine } from "./context.jsx"

export default function Header() {
    const token = localStorage.getItem("Token")
    const login = localStorage.getItem('login')
    const navigate = useNavigate()
    const { setTokenLocal, setDataTO, setDataMachine, setDataReclamation } = useMachine()

    const handleDeleteToken = () => {
        localStorage.clear()
        setTokenLocal('') 
        setDataTO('')
        setDataMachine('')
        setDataReclamation('')
        navigate('/login')
    }

    return (
    <>
        <header className='header'>
            <div className="logo"></div>
            <h3 className="text-header">Электронная сервисная книжка "Мой Силант"</h3>
            <h3 className="number-phone">+7-8352-20-12-09</h3>
            <a className="telegram-icon" href='https://t.me/seniusus'></a>
            {!token ? (
                <div className="button-authorization" onClick={() => navigate('/login')}>Войти</div>
            ):(
                <>
                <div className="name-authorization">{login}
                    <button
                        className="button-logout"
                        onClick={handleDeleteToken}>Выйти
                    </button>
                </div>
                </>
            )}

        </header>

    </> 
   )

}