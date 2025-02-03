import React, { useState } from "react";
import axios from "axios";
import Header from "./Header";
import Footer from "./Footer";
import './css/Update.scss'
import './css/UpdateTO.scss'
import { useMachine } from "./context";
import { useNavigate } from "react-router-dom";
import loader from './assets/775.gif'

export default function Update() {
    const navigate = useNavigate()
    const { dataTO } = useMachine()
    const { idSec } = useMachine()
    const role = localStorage.getItem('role')
    const token = localStorage.getItem('Token')
    const [err, setError] = useState(false)
    const [loading, setLoading] = useState(false)
    const [validErr, setValidErr] = useState()
    const [typeTo, setTypeTo] = useState(dataTO.TypeTO)
    const [dateTo, setDateTo] = useState(dataTO.dateTO)
    const [devTo, setDevTo] = useState(dataTO.development)
    const [orderNum, setOrderNum] = useState(dataTO.orderNumber)
    const [dataOrder, setDataOrder] = useState(dataTO.dataOrder)
    const [machine, setMachine] = useState(dataTO.machine)
    const [serviceCompany, setServiceCompany] = useState(dataTO.serviceCompany)
    const [organizationDoTO, setOrganizationDoTO] = useState(dataTO.organizationDoTO)
    console.log(idSec)

    const handleUseButton = (id) => {
        if (id == idSec){
            if (typeTo && dataTO && devTo && orderNum && dataOrder && machine && serviceCompany && organizationDoTO){
                UpdateRequest(id)
            }}
        setValidErr(true)
    }

    const handelChangeStateType = (e) => {
        if (!typeTo){
            setError(true)
        }  
        setTypeTo(e.target.value)
    }
    const handelChangeStateDate = (e) => {
        if (!dataTO){
            setError(true)
        }  
        setDateTo(e.target.value)
    }
    const handelChangeStateDevelopment = (e) => {
        if (!devTo){
            setError(true)
        }  
        setDevTo(e.target.value)
    }
    const handelChangeStateOrderNum = (e) => {
        if (!orderNum){
            setError(true)
        }  
        setOrderNum(e.target.value)
    }
    const handelChangeStateDataOrder = (e) => {
        if (!dataOrder){
            setError(true)
        }  
        setDataOrder(e.target.value)
    }
    const handelChangeStateMachine = (e) => {
        if (!machine){
            setError(true)
        }  
        setMachine(e.target.value)
    }
    const handelChangeStateServiceCompany = (e) => {
        if (!serviceCompany){
            setError(true)
        }  
        setServiceCompany(e.target.value)
    }
    const handelChangeStateOrganizationDoTO = (e) => {
        if (!organizationDoTO){
            setError(true)
        }  
        setOrganizationDoTO(e.target.value)
    }

    const UpdateRequest = async (id) => { 
        try {
            setLoading(true)
            const data = {
                "TypeTO": typeTo,
                "dateTO": dateTo,
                "development": devTo,
                "orderNumber": orderNum,
                "dataOrder": dataOrder,
                "organizationDoTO": organizationDoTO,
                "machine": machine,
                "serviceCompany": serviceCompany
            };
            await axios.put(`http://127.0.0.1:8001/api/to/update/${id}/`, data, {
                headers: {
                     Authorization: `Bearer ${token}`
                }
            });
            setLoading(false)
            navigate('/home')
        }
        catch (err){
            setError(true)
            setLoading(false)
        }
    }

    return (
    <>
        <wrapper className='wrapper'>
        <Header/>
        <main className="update-to">
        {idSec ? (
        !loading ? ( 
            <>
            <h3 className="title-update">Редактирование информации ТО</h3>
            <p className="note">*вписаное значение должно совпадать с существующим значением</p>
            <div className="container-update">
                <input 
                    className={`update-input ${validErr && !typeTo ? 'error' : ''}`}
                    placeholder='Тип ТО' 
                    type='text' 
                    value={typeTo} 
                    onChange={handelChangeStateType}>
                </input>
                <h3 className="name-sector">Тип ТO: {dataTO.TypeTO}</h3>
                <input 
                    className={`update-input ${validErr && !dateTo ? 'error' : ''}`}
                    placeholder='Дата ТО' 
                    type='date' 
                    value={dateTo} 
                    onChange={handelChangeStateDate}>
                </input>
                <h3 className="name-sector">Дата ТО: {dataTO.dateTO}</h3>
                <input 
                    className={`update-input ${validErr && !devTo ? 'error' : ''}`}
                    placeholder='Наработка часов' 
                    type="number" 
                    value={devTo} 
                    onChange={handelChangeStateDevelopment}>
                </input>
                <h3 className="name-sector">Наработка часов: {dataTO.development} м/час</h3>
                <input 
                    className={`update-input ${validErr && !orderNum ? 'error' : ''}`}
                    placeholder='Номер заказа' 
                    type='text' 
                    value={orderNum} 
                    onChange={handelChangeStateOrderNum}>
                </input>
                <h3 className="name-sector">Номер заказа: {dataTO.orderNumber}</h3>
                <input 
                    className={`update-input ${validErr && !dataOrder ? 'error' : ''}`}
                    placeholder='Дата заказа' 
                    type='date' 
                    value={dataOrder} 
                    onChange={handelChangeStateDataOrder}>
                </input>
                <h3 className="name-sector">Дата заказа: {dataTO.dataOrder}</h3>
                <input 
                    className={`update-input ${validErr && !organizationDoTO ? 'error' : ''}`}
                    placeholder='Организатор' 
                    type='text' 
                    value={organizationDoTO} 
                    onChange={handelChangeStateOrganizationDoTO}>
                </input>
                <h3 className="name-sector">Организатор: {dataTO.organizationDoTO}</h3>
                <input 
                    className={`update-input ${validErr && !machine ? 'error' : ''}`}
                    placeholder='Машина' 
                    type='text' 
                    value={machine} 
                    onChange={handelChangeStateMachine}>
                </input>
                <h3 className="name-sector">Машина: {dataTO.machine}</h3>
                <input 
                    className={`update-input ${validErr && !serviceCompany ? 'error' : ''}`}
                    placeholder='Сервисная компания' 
                    type='text' 
                    value={serviceCompany} 
                    onChange={handelChangeStateServiceCompany}>
                </input>
                <h3 className="name-sector">Сервисная компания: {dataTO.serviceCompany}</h3>
            </div>
            <h3 className={`error-faild ${err ? 'active': ''}`}>Введите корректные данные</h3>

            <button className="full-update-button" onClick={() => handleUseButton(dataTO.id)}>Сохранить изменения</button>
            </>
        ):(
            <div className="contaner-loader">
                <img src={loader} className="video-loading-update" autoPlay muted loop />
            </div>
        )):(
            <div className="not-access-section">
                <h3>В целях безопасности у вас нет доступа к этой странице, повторите попытку с главной страници</h3>
                <button className='button-not-access-section' onClick={() => navigate('/home')}>На главную</button>
            </div>
        )}
        </main>
        <Footer/>
        </wrapper>
    </>
    )
}