import React, { useState, useRef } from "react";
import { useEffect } from "react";
import { useMachine } from './context.jsx';
import { data } from "react-router-dom";
import axios from "axios";
import loader from './assets/775.gif'
import { useNavigate } from "react-router-dom";

export default function TableTo({scrollToTarget}) {
    const storedData = localStorage.getItem('DataTo')
    const errTo = localStorage.getItem('errTo')
    const [method, setMethod] = useState('')
    const [dataTo, setDataTo] = useState([])
    const [dataValue, setDataValue] = useState()
    const [dataToDetail, setDataToDetail] = useState()
    const [err, setError] = useState()
    const [loading, setLoading] = useState()
    const { token } = useMachine()
    const { machine } = useMachine();  
    const { filterNameItemLocal } = useMachine();
    const { filterItemLocal } = useMachine();
    const { setDataTO } = useMachine()
    const { setId } = useMachine()
    const navigate = useNavigate()



    const handleClick = (key, value) => {
        if (key === 'TypeTO') {
            console.log(value)
            setDataValue(value);
            InfoRequestDec(key, value)
        }
        else if (key === 'serviceCompany') {
            console.log(value)
            setDataValue(value);
            InfoRequestDecSecviceCompany(key, value)
        }    
    };

    const handleCloseClick = () => {
        setDataValue(null);
    }

    const handleNavigateUpdateTO = (id, data) => {
        setDataTO(data)
        setId(id)
        navigate(`/update/${id}`)
    }

    const sortDataByDate = (data, dateField, method) => {
        return data.sort((data1, data2) => {
          const dateA = new Date(data1[dateField]);
          const dateB = new Date(data2[dateField]);

          return method === "decreasing" ? dateB - dateA : dateA - dateB;
          
        });
      };

    useEffect(() => {
        if (storedData) {
            try {
                const parsedData = JSON.parse(storedData);
                const arrayParsedData = Array.isArray(parsedData) ? parsedData : [parsedData];
                const sortedData = sortDataByDate(arrayParsedData, 'dateTO', method);
                setDataTo(sortedData)
                console.log('table', sortedData)
            } catch (error) {
                console.error("Error localStorage:", error);
                setDataTo([]);
            }
        }
    }, [storedData, method]);

    useEffect(() => {
        if (dataTo.length > 0) {
            localStorage.setItem('typeTo', dataTo[0].TypeTO || "Нет данных");
        }
    }, [dataTo]);

    /* запрос для получения подробной информации о виде то */
    const InfoRequestDec = async (key, data) => {
        try {
            setLoading(true)
            const response = await axios.get('http://127.0.0.1:8000/api/typeTo/', {
                params: { name: data },
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }) 
            console.log(response.data)
            if (response.data) {
                setDataToDetail(response.data)
                setLoading(false)
            } else {
                setError('No valid data received');
                setLoading(false)
            }
        }
        catch (err) {
            setError(err.message)
            setLoading(false)  
        }
    }    

     /* запрос для получения подробной информации о сервисной компании */
     const InfoRequestDecSecviceCompany = async (key, data) => {
        try {
            setLoading(true)
            const response = await axios.get('http://127.0.0.1:8000/api/servicecompany/', {
                params: { name: data },
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }) 
            console.log(response.data)
            if (response.data) {
                setDataToDetail(response.data)
                setLoading(false)
            } else {
                setError('No valid data received');
                setLoading(false)
            }
        }
        catch (err) {
            setError(err.message)
            setLoading(false)  
        }
    }    

    return (
        <>
        <table>
                <thead>
                    <tr>
                        <th className="button-sector">
                        <div className='sorted-button' onClick={() => setMethod(method === "ascending" ? "decreasing" : "ascending")} title='Cортировка по дате'></div>
                        </th>
                        <th>Вид ТО</th>
                        <th>Дата проведения ТО</th>
                        <th>Наработка, м/час</th>
                        <th>№ заказ-наряда</th>
                        <th>Дата заказ-наряда</th>
                        <th>Организация, проводившая ТО</th>
                        <th>Машина</th>
                        <th>Сервисная компания</th>
                    </tr>
                </thead>  
                <tbody>      
                {console.log(machine)}  
                {dataTo && dataTo.length > 0 ? (
                        dataTo
                        .filter((item) => item.machine === machine) 
                        .map((value, index) => (
                            value[filterItemLocal] == filterNameItemLocal || filterItemLocal == 'none'  ? (
                            <>  
                            <tr key={index}>
                                <td className='button-sector'>
                                    <div className='update-button' onClick={() => handleNavigateUpdateTO(value.id, value)} title='Рекдактировать'></div>
                                </td>
                                {Object.entries(value).map(([key, data], idx) => (
                                    <td key={idx}
                                        className={`sector ${key === 'id' ? 'notfound' : ''}`}
                                        onClick={() => handleClick(key, data)}
                                        title={data}
                                    >
                                        {data === null || key === 'id' ? "" : data}
                                    </td>
                                ))}
                            </tr>
                            </>  
                        ):(<></>)))
                ) : (
                    <tr>
                        <td colSpan="100%" onClick={scrollToTarget} >Выбирете машину</td>  
                    </tr>
                )}
        
                </tbody>
            </table>
            {!errTo && ( 
                <h3 className="title-error-not-found">У вас нет ТО</h3>
            )}
            {dataValue && dataToDetail && (
                <div className="details-value">
                    <div className="container-details-view">
                    <div className="close-button" onClick={handleCloseClick} title='Закрыть'></div>
                        {!loading ? (
                            <>
                                <p className="name-detail-view">Модель: {dataToDetail.name || "Имя не найдено"}</p>
                                <p className="decsription-detail-view">Описание: {dataToDetail.description || "Описание не найдено"}</p>
                                {console.log(dataToDetail)}
                            </>
                        ):(<img src={loader} className="video-loading-delains" autoPlay muted loop />)}
                    </div>
                </div>
            )}
        </>
    )
}