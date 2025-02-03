import React, { useState } from "react";
import { useEffect } from "react";
import { useMachine } from "./context";
import loader from './assets/775.gif'
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function TableTo() {
    const navigate = useNavigate()
    const storedData = localStorage.getItem('DataRec')
    const errRec = localStorage.getItem('errRec')
    const role = localStorage.getItem('Role')
    const [dataRec, setDataRec] = useState([])
    const { filterNameItemLocal } = useMachine();
    const { filterItemLocal } = useMachine();
    const { setId } = useMachine()
    const [hoveredValue, setHoveredValue] = useState()
    const [loading, setLoading] = useState(false)
    const [dataRecDetail, setDataRecDetail] = useState()
    const token = localStorage.getItem('Token')
    const [err, setError] = useState()
    const { setDataReclamation } = useMachine()

    
    const handleNavigateUpdateReclamation = (id, data) => {
        setDataReclamation(data)
        setId(id)
        navigate(`/reclamation/update/${id}`)
    }

    const handleClick = (key, value) => {
        setHoveredValue(value);
        InfoRequestDec(key, value)
    };

    const handleCloseClick = () => {
        setHoveredValue(null);
    }

    const sortDataByDate = (data, dateField) => {
        return data.sort((data1, data2) => {
          const dateA = new Date(data1[dateField]);
          const dateB = new Date(data2[dateField]);
          return dateB - dateA; 
        });
      };

    useEffect(() => {
        if (storedData) {
            try {
                const parsedData = JSON.parse(storedData);
                const arrayParsedData = Array.isArray(parsedData) ? parsedData : [parsedData];
                const sortedData = sortDataByDate(arrayParsedData, 'dataReclamation');
                setDataRec(sortedData)
            } catch (error) {
                console.error("Error localStorage:", error);
                setDataRec([]);
            }
        }
    }, [storedData]);

    /* запрос для получения подробной информации в рекламациях */
    const InfoRequestDec = async (key, data) => {
        try {
            if (key === 'rejectNode' || key === 'recoveryMethod') {
                setLoading(true)
                const response = await axios.get('http://127.0.0.1:8001/api/reject/', {
                    params: { name: data },
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }) 
                console.log(response.data)
                if (response.data) {
                    setDataRecDetail(response.data)
                    setLoading(false)
                } else {
                    setError('No valid data received');
                    setLoading(false)
                }
            }
            else setDataRecDetail('')
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
                        {(role === 'serviceCompany' || role === 'manager') && (
                            <th className="button-sector"></th>
                         )}
                        <th>Дата отказа</th>
                        <th>Наработка, м/час</th>
                        <th>Узел отказа</th>
                        <th>Описание отказа</th>
                        <th>Способ восстановления</th>
                        <th>Используемые запасные части</th>
                        <th>Дата восстановления</th>
                        <th>Время простоя техники</th>
                        <th>Mашина</th>
                        <th>Cервисная компания</th>
                    </tr>
                </thead>                      
                <tbody>        
                    {dataRec && dataRec.length > 0 ? ( 
                        dataRec.map((value, index) => (
                            value[filterItemLocal] == filterNameItemLocal || filterItemLocal == 'none'  ? (
                            <tr key={index}>
                                {(role === 'serviceCompany' || role === 'manager') && (
                                    <td className='button-sector'>
                                        <div className='update-button' onClick={() => handleNavigateUpdateReclamation(value.id, value)}></div>
                                    </td>
                                )}
                                {Object.entries(value).map(([key, data], idx) => (
                                    <>
                                        <td 
                                            key={idx}
                                            className={`sector ${key === 'id' ? 'notfound' : ''}`}
                                            onClick={() => handleClick(key, data)}>
                                            {data === null || key === 'id' ? "" : data}
                                        </td>
                                    </>
                                ))}
                            </tr>
                        ):(<></>)))
                    ) : (
                        <tr></tr>
                    )}
                </tbody>
            </table>{console.log(errRec)}
            {errRec != 'true' && ( 
                <h3 className="title-error-not-found">У вас нет рекламаций</h3>
            )}
            {hoveredValue && dataRecDetail && (
                <div className="details-value">
                   <div className="container-details-view">
                        {!loading ? (
                            <>
                                <p className="name-detail-view">Модель: {dataRecDetail.name || "Имя не найдено"}</p>
                                <p className="decsription-detail-view">Описание: {dataRecDetail.description || "Описание не найдено"}</p>
                                {console.log(dataRecDetail)}
                                <div className="close-button" onClick={handleCloseClick}>Закрыть</div>
                            </>
                        ):(<img src={loader} className="video-loading-delains" autoPlay muted loop />)}
                    </div>
               </div>
            )}
        </>            
    )
}