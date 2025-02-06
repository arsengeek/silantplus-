import React, { useEffect, useState, useRef } from "react";
import Header from "./Header";
import TableTo from './TableTo';
import TableReclamations from './TableReclamations'
import './css/Home.scss'
import './css/HomeMobile.scss'
import axios from "axios";
import Footer from "./Footer";
import loader from './assets/775.gif'
import { useMachine } from './context.jsx'
import { useNavigate } from "react-router-dom";


export default function Home() {

    const role = localStorage.getItem('Role') 
    const login = localStorage.getItem('login') 
    const token = localStorage.getItem('Token')
    const typeTo = localStorage.getItem('typeTo')
    const navigate = useNavigate()

    const [buttonFunc, setButtonFunc] = useState(true)
    const [buttonFuncTo, setButtonFuncTo] = useState(false)
    const [buttonFuncRec, setButtonFuncRec] = useState(false)
    const [buttonFuncUse, setButtonFuncUse] = useState(true)
    const [buttonFuncToUse, setButtonFuncToUse] = useState(false)
    const [buttonFuncRecUse, setButtonFuncRecUse] = useState(false)
    const [buttonFuncText, setButtonFuncText] = useState(true)
    const [buttonFuncToText, setButtonFuncToText] = useState(false)
    const [buttonFuncRecText, setButtonFuncRecText] = useState(false)
    const [filterItem, setFilterItem] = useState('none')
    const [filterNameItem, setFilterNameItem] = useState('')
    const [infoMachines, setInfoMaсhines] = useState({})
    const [infoTo, setInfoTo] = useState({})
    const [infoRec, setInfoRec] = useState({})
    const [dataModel, setDataModel] = useState({})
    const [loading, setLoading] = useState(false)
    const [err, setError] = useState()
    const [eterationMachineApi, setEterationMachineApi] = useState(false)
    const [eterationToApi, setEterationToApi] = useState(false)
    const [eterationRecApi, setEterationRecApi] = useState(false)
    const [hoveredValue, setHoveredValue] = useState(null);
    const [method, setMethod] = useState('')
    const { setMachine } = useMachine();
    const { setFilterNameItemLocal } = useMachine();
    const { setFilterItemLocal } = useMachine()
    const { setDataMachine } = useMachine()

    const targetRef = useRef(null);

    useEffect(() => {
        document.title = "Главная";
      }, []);
    
    const scrollToTarget = () => {
        targetRef.current.scrollIntoView({ behavior: 'smooth' })
        targetRef.current.classList.add('highlight');

        setTimeout(() => {
            targetRef.current.classList.remove('highlight');
        }, 2000);
    }

    const handleNavigateUpdateMachine = (id, data) => {
        console.log('click', data)
        setDataMachine(data)
        navigate(`/machine/update/${id}`)
    }

    const handleClick = (key, value) => {
        setHoveredValue(value);
        InfoRequestDec(key, value)
    };

    const handleCloseClick = () => {
        setHoveredValue(null);
    }

    const handleChangeButton = () => {
        setButtonFuncUse(true)
        setButtonFunc(true)
        setButtonFuncRec(false)
        setButtonFuncTo(false)
        setButtonFuncText(true)
        setButtonFuncToText(false)
        setButtonFuncRecText(false)
    }
    const handleChangeButtonTO = () => {
        setButtonFuncToUse(true)
        setButtonFunc(false)
        setButtonFuncRec(false)
        setButtonFuncTo(true)
        setButtonFuncToText(true)
        setButtonFuncText(false)
        setButtonFuncRecText(false)
    }
    const handleChangeButtonRec = () => {
        setButtonFuncRecUse(true)
        setButtonFunc(false)
        setButtonFuncRec(true)
        setButtonFuncTo(false)
        setButtonFuncRecText(true)
        setButtonFuncText(false)
        setButtonFuncToText(false)
    }

    const handleChangesFilterName = (e) => {
        setFilterNameItem(e.target.value)
        setFilterNameItemLocal(e.target.value)
        setError()
    }

    const sortDataByDate = (data, dateField, method) => {
        return data.sort((data1, data2) => {
          const dateA = new Date(data1[dateField]);
          const dateB = new Date(data2[dateField]);

          return method === "decreasing" ? dateB - dateA : dateA - dateB;
          
        });
      };

    /* вызов для получения данных для машин */
    const InfoRequest = async () => { 
        if(token) {
            try {
                if (!eterationMachineApi) {
                setLoading(true)
                const response = await axios.get('http://127.0.0.1:8000/api/machine/full/',{
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if (response.data) {
                    console.log(response.data)
                    const sortedData = sortDataByDate(response.data, 'dataShipment');
                    console.log(sortedData)
                    setInfoMaсhines(sortedData);
                } else {
                    setError('No data received');
                    setInfoMaсhines({});
                }
                setEterationMachineApi(true)
                setLoading(false);
            }}
            catch (err){
                setError(err.message)
                setInfoMaсhines({});
                setLoading(false)  
                setEterationToApi(false)   
            }
        }
    }


    
    /* получение данных о ТО */
    const InfoRequestTo = async () => {
        if(token) {
            try {
                if (!eterationToApi) {
                    setLoading(true)
                    const response = await axios.get('http://127.0.0.1:8000/api/to/', {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }) 
                    if (response.data && Array.isArray(response.data)) {
                        const dataTo = response.data; 
                        localStorage.setItem('DataTo', JSON.stringify(dataTo)); 
                        localStorage.setItem('errTo', false)
                        setInfoTo(dataTo);
                        setLoading(false)
                        setEterationToApi(true)
                    } else {
                        localStorage.setItem('errTo', err.message)
                        setInfoTo([]); 
                        setLoading(false)
                        setEterationToApi(false)
                    }
                }
            }
            catch (err) {
                localStorage.setItem('errTo', err.message )
                setLoading(false)  
                setEterationToApi(false) 
            }
        }
    }


    /* получение данных о Рекламациях */
    const InfoRequestRec = async () => {
        if(token) {
            try {
                if (!eterationRecApi) {
                    setLoading(true)
                    const response = await axios.get('http://127.0.0.1:8000/api/reclamation/', {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }) 
                    if (response.data && Array.isArray(response.data)) {
                        const dataRec = response.data; 
                        localStorage.setItem('DataRec', JSON.stringify(dataRec)); 
                        localStorage.setItem('errRec', 'true')
                        setInfoRec(dataRec);
                        setLoading(false)
                        setEterationRecApi(true)
                    } else {
                        localStorage.setItem('errRec', err.message)
                        console.log(err.message)
                        setInfoRec([]); 
                        setLoading(false)
                        setEterationRecApi(false)
                    }
                }
            }
            catch (err) {
                localStorage.setItem('errRec', err.message)
                setLoading(false)  
                setEterationRecApi(false) 
            }
        }
    }

    /* запрос для получения подробной информации о модели */
    const InfoRequestDec = async (key, value) => {
        try {
            if (
                key === 'model' ||
                key === 'modelEngine' ||
                key === 'modelTransmission' ||
                key === 'modelLeadingBridge' ||
                key === 'modelManagedBridge'
            ) {
                setLoading(true)
                const response = await axios.get('http://127.0.0.1:8000/api/checkmodel/', {
                    params: { name: value },
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }) 
                console.log(response.data)
                if (response.data) {
                    setDataModel(response.data)
                    setLoading(false)
                } else {
                    setError('No valid data received');
                    setLoading(false)
                }
            }
            else if (key === 'serviceCompany') {
                setLoading(true)
                const response = await axios.get('http://127.0.0.1:8000/api/servicecompany/', {
                    params: { name: value },
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }) 
                console.log(response.data)
                if (response.data) {
                    setDataModel(response.data)
                    setLoading(false)
                } else {
                    setError('No valid data received');
                    setLoading(false)
                }
            }
            else setDataModel('')
        }
        catch (err) {
            setError(err.message)
            setLoading(false)  
        }
    }

        if (buttonFuncUse) {
            InfoRequest()
            setButtonFuncUse(false)
        }
        if (buttonFuncToUse) {
            InfoRequestTo()
            setButtonFuncToUse(false)
        }
        if (buttonFuncRecUse) {
            InfoRequestRec()
            setButtonFuncRecUse(false)
        }

    return (
        <>
        <wrapper className='wrapper'>
            <Header/>    
            <main className='main-section-search-results'>
                {role == 'client' ? (
                    <h3 className="text-name-role">Добро пожаловать Клиент {login}</h3>
                ):(
                    role == 'serviceCompany' ? (
                        <h3 className="text-name-role">Добро пожаловать Сервисная компания {login}</h3>
                    ):(
                        <h3 className="text-name-role">Добро пожаловать Менеджер {login}</h3>
                    )
                )}
                <div className={`container-cars ${buttonFuncToText ? 'active' : ''}`}>
                    {buttonFuncToText &&
                        infoMachines && infoMachines.length > 0 ? ( 
                            <select
                            className="select"
                            ref={targetRef}
                            onChange={(e) => setMachine(e.target.value)} 
                            >
                            <option className="car-name">Выбрать машину</option>
                            {infoMachines.map((machine, index) =>
                                machine.model ? (
                                <option key={index} className="car-name" value={machine.model}>
                                    {machine.model}
                                </option>
                                ) : null
                            )}
                            </select>

                        ):(<></>)
                    }
                </div>
                {buttonFuncText && (<h3 className="title-section-results">Информаци о комплектации технических характеристик Вашей машины</h3>)}
                {buttonFuncToText && (<h3 className="title-section-results">Информация о проведённых ТО вашей техники</h3>)}
                {buttonFuncRecText && (<h3 className="title-section-results">Информация о Рекламациях</h3>)}
                
                <h3 className="title-table-results">Таблица с данными:</h3>
                <div className="image-table"></div>
            <div className="container-buttons">
                <button 
                    className={`button-information ${buttonFunc? 'active' : ''}`} 
                    onClick={handleChangeButton}
                    >Общая информация
                </button>
                <button 
                    className={`button-information-to ${buttonFuncTo ? 'active' : ''}`} 
                    onClick={handleChangeButtonTO}
                    >TO
                </button>
                <button 
                    className={`button-information-rec ${buttonFuncRec ? 'active' : ''}`} 
                    onClick={handleChangeButtonRec}
                    >Рекламации
                </button>
                {buttonFuncText &&
                    <select className="select" onChange={(e) => setFilterItem(e.target.value)}>
                        <option value={'none'}>Выбрать фильтрацию</option>
                        <option value={'factoryNumber'}>Заводской номер</option>
                        <option value={'model'}>Модель машины</option>
                        <option value={'modelEngine'}>Модель двигателя</option>
                        <option value={'modelTransmission'}>Модель трансмиссии</option>
                        <option value={'modelLeadingBridge'}>Модель управляемого моста</option>
                        <option value={'modelManagedBridge'}>Модель ведущего моста</option>
                    </select>}

                {buttonFuncToText &&
                    <select className="select" onChange={(e) => setFilterItemLocal(e.target.value)}>
                        <option value={'none'}>Выбрать фильтрацию</option>
                        <option value={'TypeTO'}>Вид ТО</option>
                        <option value={'serviceCompany'}>Сервисная компания</option>
                    </select>}   

                {buttonFuncRecText &&
                    <select className="select" onChange={(e) => setFilterItemLocal(e.target.value)}>
                        <option value={'none'}>Выбрать фильтрацию</option>
                        <option value={'rejectNode'}>Узел отказа</option>
                        <option value={'recoveryMethod'}>Способ востановления</option>
                        <option value={'serviceCompany'}>Сервисная компания</option>
                    </select>}                  

                <input 
                    className="input-filter" 
                    type='text'  
                    placeholder='Введите для фильтрации'
                    value={filterNameItem}
                    onChange={handleChangesFilterName}
                    >
                </input> 
            </div>
            <div className="container-table-results">
            {loading ? (
                <img src={loader} className="video-loading-homeresults" autoPlay muted loop />
            ) : (
                buttonFuncTo ? (
                    <TableTo scrollToTarget={scrollToTarget}/>
                ) : buttonFuncRec ? (
                    <TableReclamations />
                ) : (
                    <>
                        <table>
                            <thead>
                                <tr>
                                    {role == 'manager' && (
                                        <th className="button-sector">
                                            <div className='sorted-button' onClick={() => setMethod(method === "ascending" ? "decreasing" : "ascending")} title='Cортировка по дате'></div>
                                        </th>
                                    )}
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
                                    <th>Дата отгрузки с завода</th>
                                    <th>Грузополучатель</th>
                                    <th>Адрес поставки</th>
                                    <th>Комплектация</th>
                                    <th>Клиент</th>
                                    <th>Сервисная компания</th>
                                </tr>
                            </thead>
                            <tbody>
                                {infoMachines && infoMachines.length > 0 ? (
                                    infoMachines.map((machine, index) => (
                                        <tr key={index}>  
                                            {machine[filterItem] == filterNameItem || filterItem == 'none' ? (
                                                <>
                                                    {role == 'manager' && (
                                                    <td className='button-sector'>
                                                        <div className='update-button' onClick={() => handleNavigateUpdateMachine(machine.id, machine)}></div>
                                                    </td>)}
                                                    {Object.entries(machine).map(([key, value], idx) => (
                                                        <td
                                                            key={idx}
                                                            className={`sector ${key === 'id' ? 'notfound' : ''}`}
                                                            onClick={() => handleClick(key, value)}  
                                                        >
                                                            {value === null || key === 'id' ? "" : value}
                                                        </td>    
                                                    ))}    
                                                </>
                                            ) : (
                                                <></>
                                            )}
                                        </tr>
                                    ))
                                ) : (
                                    <tr></tr>
                                )}
                            </tbody>
                        </table>
                        {err && (
                            <> <h3 className="title-error-not-found">У вас нет машин</h3></>
                        )}
                        {hoveredValue && dataModel && (
                            <div className="details-value">
                                <div className="container-details-view">
                                <div className="close-button" onClick={handleCloseClick} title='Закрыть'></div>
                                {!loading ? (
                                    <>
                                        <p className="name-detail-view">Модель: {dataModel.name || "Имя не найдено"}</p>
                                        <p className="decsription-detail-view">Описание: {dataModel.description || "Описание не найдено"}</p>
                                    </>
                                ):(<img src={loader} className="video-loading-delains" autoPlay muted loop />)}
                                </div>
                            </div>
                        )}
                    </>
                )
            )}
        </div>
        </main>
            <Footer/>
        </wrapper>
        </>
    )
}