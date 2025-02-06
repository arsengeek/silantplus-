import React, { useEffect, useState } from "react";
import './css/LoginSection.scss';
import './css/LoginSectionMobile.scss';
import axios from 'axios';
import Header from "./Header.jsx";
import Footer from './Footer.jsx'
import loader from './assets/775.gif'
import { useNavigate } from "react-router-dom";
import { useMachine } from './context.jsx'
import useWindowSize from './useWindowSize.jsx'


export default function LoginSection() {
    const { width } = useWindowSize();
    const [InputLogin, setInputLogin] = useState('');
    const [InputPassword, setInputPassword] = useState('');
    const [Token, setToken] = useState('')
    const [err, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [changeButtonEnter ,setChangeButtonEnter] = useState(false)
    const { setTokenLocal } = useMachine() 
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Авторизация";
      }, []);    

    const handleChangesInputLogin = (e) => {
        setInputLogin(e.target.value)
        setError()
    }

    const handleChangesInputPassword = (e) => {
        setInputPassword(e.target.value)
        setError()
    }


    const disable = () => {
        if (InputLogin != ''){
            if (InputPassword != ''){
                return false
            }
        }
        return true  
    }

    const tokenRequest = async () => {
        try {
            setLoading(true)
            const response = await axios.post('http://127.0.0.1:8000/api/token/', {
            "username": InputLogin,
            "password": InputPassword
            })
            setToken(response.data)
            setError()
            localStorage.setItem('login', InputLogin)
            localStorage.setItem('Token', response.data.access)
            localStorage.setItem('Role', response.data.role)
            const tokenLocal = localStorage.getItem('Token')
            if (tokenLocal) {
                setTokenLocal(tokenLocal)
                setLoading(false)
                navigate('/home')
            }

        }
        catch (err) {
            setError(err.message)
            setInputLogin('')
            setInputPassword('')
            setLoading(false)
        }
    }

    return (
        <>
        <wrapper className='wrapper'>
        {width > '360' ? (
            <>
            <main className="main-login">
                <Header/>
                <section className="component-login-section">
                <h3 className='login-section-title'>Авторизация</h3>
                {loading ? (
                        <div className='login-section'>
                            <img src={loader} className="video-loading" autoPlay mute loop/>
                        </div>
                ):(
                    <div className='login-section'>
                        <form className='login-form'>
                            <input 
                                className={`login-form-input ${err ? 'invalid' : ''}`}
                                type='text' 
                                placeholder='Логин'
                                value={InputLogin}
                                onChange={handleChangesInputLogin}>
                            </input>
                            <input 
                                className={`login-form-input ${err ? 'invalid' : ''}`}
                                type='password' 
                                placeholder='Пароль'
                                value={InputPassword}
                                onChange={handleChangesInputPassword}>
                            </input>
                            <h3 className={`text-error ${err ? 'invalid' : ''}`}>Неверный логин или пароль</h3>
                            <button 
                                className={`login-form-button ${changeButtonEnter ? 'action' : ''}`}
                                disabled={disable()} 
                                onMouseEnter={() => setChangeButtonEnter(true)}
                                onMouseLeave={() => setChangeButtonEnter(false)}
                                onClick={(e) => { e.preventDefault(); tokenRequest(); }}>Войти
                            </button>


                        </form>
                    </div>)}
                </section>
            </main>
            <Footer/>
            </>
        ):(
        <>
        <h3 className='login-section-title'>Авторизация</h3>
           <section className="component-login-section">
                <div className="image-logo"></div>
                {loading ? (
                        <div className='login-section'>
                            <img src={loader} className="video-loading" autoPlay mute loop/>
                        </div>
                ):(
                    <div className='login-section'>
                        <form className='login-form'>
                            <input 
                                className={`login-form-input ${err ? 'invalid' : ''}`}
                                type='text' 
                                placeholder='Логин'
                                value={InputLogin}
                                onChange={handleChangesInputLogin}>
                            </input>
                            <input 
                                className={`login-form-input ${err ? 'invalid' : ''}`}
                                type='password' 
                                placeholder='Пароль'
                                value={InputPassword}
                                onChange={handleChangesInputPassword}>
                            </input>
                            <h3 className={`error-text-login ${err ? 'active' : ''}`}>Неверный логин или пароль</h3>
                            <button 
                                className={`login-form-button ${changeButtonEnter ? 'action' : ''}`}
                                disabled={disable()} 
                                onMouseEnter={() => setChangeButtonEnter(true)}
                                onMouseLeave={() => setChangeButtonEnter(false)}
                                onClick={(e) => { e.preventDefault(); tokenRequest(); }}>Войти
                            </button>

                        </form>
                    </div>)}
                </section> 
        </>
    )}
        </wrapper>
        </>
    )
}