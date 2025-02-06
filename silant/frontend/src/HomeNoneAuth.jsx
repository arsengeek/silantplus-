import React, {useState, useEffect} from "react";
import './css/HomeNoneAuth.scss'
import './css/HomeNoneAuthMobile.scss'
import Header from "./Header.jsx" 
import Footer from "./Footer.jsx";
import axios from "axios";
import loadererror from './assets/775.gif'

export default function HomeNoneAuth() {

    const [InputNumber, setInputNumber] = useState('')
    const [MachineData, setMachineData] = useState()
    const [err, setError] = useState()
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        document.title = "Поиск информации";
      }, []);

    const handleChangesInputNumber = (e) => {
        setInputNumber(e.target.value)
        setError()
    }

    const machineRequest = async () => {
        setLoading(true)
        setMachineData()
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/machine/', {
                "factory_number": InputNumber
            },)
            setMachineData(response.data)
            setLoading(false)
        }
        catch (err) {
            setError(err.message)
            setInputNumber('')
            setLoading(false)
        }
    }
    

    return (
        <>
        <wrapper className='wrapper'>
            <Header/>
            <main className="main-cintainer">
                <h2 className="title-main-section" >Проверте комплектацию и технические характеристики техники Силант</h2>
                <div className='container-input-numbers'>
                    <input
                        className={`input-factory-number ${err ? 'error' : ''}`}
                        type='text'
                        placeholder="Заводской номер"
                        value={InputNumber}
                        onChange={handleChangesInputNumber}
                        >
                    </input>
                    <button
                        className='button-factory-number'
                        onClick={(e) => { e.preventDefault(); machineRequest(); }}
                        >Поиск
                    </button>
                    {err ? (
                        <p className="error-text">Введите корректные данные</p>
                    ):(
                        <></>
                    )}
                </div>
                <h3 className="text-results">Результат поиска</h3>
                <h3 className="text-machine-silant">Проверте комплектацию и технические характеристики техники Силант</h3>
                {loading ? (
                        <img src={loadererror} className="video-loading-home" autoPlay mute loop/>
                ) : (
                <>
                <section className="container-results">
                    {MachineData ? (
                        <table>
                            <thead>
                                <tr>
                                    <th>Зав. № машины</th>
                                    <th>Модель техники</th>
                                    <th>Модель двигателя</th>
                                    <th>Зав. № двигателя</th>
                                    <th>Модель трансмиссии</th>
                                    <th>Зав. № трансмиссии</th>
                                    <th>Модель ведущего моста</th>
                                    <th>Зав. № ведущего моста</th>
                                    <th>Модель управляемого моста</th>
                                    <th>Зав. № управляемого моста</th>
                                    <th>Договор поставки №, дата</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{MachineData.factoryNumber}</td>
                                    <td>{MachineData.model}</td>
                                    <td>{MachineData.modelEngine}</td>
                                    <td>{MachineData.factoryNumberEngine}</td>
                                    <td>{MachineData.modelTransmission}</td>
                                    <td>{MachineData.factoryNumberTransmission}</td>
                                    <td>{MachineData.modelLeadingBridge}</td>
                                    <td>{MachineData.factoryNumberLeadingBridge}</td>
                                    <td>{MachineData.modelManagedBridge}</td>
                                    <td>{MachineData.factoryNumberManagedBridge}</td>
                                    <td>{MachineData.factoryNumberManagedBridge}</td>
                                </tr>
                            </tbody>
                        </table>
                    ) : (
                        <></>
                    )}
                </section>
                </>
                )}  
            </main>
            <Footer/>
            </wrapper>
        </>
    )
}