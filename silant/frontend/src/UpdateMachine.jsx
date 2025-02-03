import React, { useState } from "react";
import axios from "axios";
import Header from "./Header";
import Footer from "./Footer";
import './css/Update.scss'
import './css/UpdateMachine.scss'
import './css/UpdateMachineMobile.scss'
import { useMachine } from "./context";
import { useNavigate } from "react-router-dom";
import loader from './assets/775.gif'

export default function Update() {
    const navigate = useNavigate()
    const { dataMachine } = useMachine()
    const role = localStorage.getItem('Role')
    const token = localStorage.getItem('Token')
    const [err, setError] = useState(false)
    const [loading, setLoading] = useState(false)
    const [validErr, setValidErr] = useState()
    const [factoryNumber, setFactoryNumber] = useState(dataMachine.factoryNumber)
    const [model, setModel] = useState(dataMachine.model)
    const [modelEngine, setModelEngine] = useState(dataMachine.modelEngine)
    const [factoryNumberEngine, setFactoryNumberEngine] = useState(dataMachine.factoryNumberEngine)
    const [modelTransmission, setModelTransmission] = useState(dataMachine.modelTransmission)
    const [factoryNumberTransmission, setFactoryNumberTransmission] = useState(dataMachine.factoryNumberTransmission)
    const [modelLeadingBridge, setModelLeadingBridge] = useState(dataMachine.modelLeadingBridge)
    const [modelManagedBridge, setModelManagedBridge] = useState(dataMachine.modelManagedBridge)
    const [factoryNumberManagedBridge, setFactoryNumberManagedBridge] = useState(dataMachine.factoryNumberManagedBridge)
    const [factoryNumberLeadingBridge, setFactoryNumberLeadingBridge] = useState(dataMachine.factoryNumberLeadingBridge)
    const [factoryNumberSupplyContract, setFactoryNumberSupplyContract] = useState(dataMachine.factoryNumberSupplyContract)
    const [dataShipment, setDataShipment] = useState(dataMachine.dataShipment)
    const [consumer, setConsumer] = useState(dataMachine.consumer)
    const [complictation, setComplictation] = useState(dataMachine.complictation)
    const [client, setClient] = useState(dataMachine.client)
    const [serviceCompany, setServiceCompany] = useState(dataMachine.serviceCompany)

    const handleUseButton = (id) => {
        if (factoryNumber &&
            model && 
            modelEngine && 
            factoryNumberEngine && 
            modelTransmission && 
            factoryNumberTransmission && 
            modelLeadingBridge && 
            modelManagedBridge &&
            factoryNumberManagedBridge &&
            factoryNumberSupplyContract &&
            dataShipment &&
            consumer &&
            complictation &&
            client
        ){
            UpdateRequest(id)
        }
        setValidErr(true)
    }

    const handelChangeStateTypeFactoryNumber = (e) => {
        if (!factoryNumber){
            setError(true)
        }  
        setFactoryNumber(e.target.value)
    }
    const handelChangeStateDateModel = (e) => {
        if (!model){
            setError(true)
        }  
        setModel(e.target.value)
    }
    const handelChangeStateModelEngine = (e) => {
        if (!modelEngine){
            setError(true)
        }  
        setModelEngine(e.target.value)
    }
    const handelChangeStateFactoryNumberEngine = (e) => {
        if (!factoryNumberEngine){
            setError(true)
        }  
        setFactoryNumberEngine(e.target.value)
    }
    const handelChangeStateModelTransmissionr = (e) => {
        if (!modelTransmission){
            setError(true)
        }  
        setModelTransmission(e.target.value)
    }
    const handelChangeStateFactoryNumberTransmission = (e) => {
        if (!factoryNumberTransmission){
            setError(true)
        }  
        setFactoryNumberTransmission(e.target.value)
    }
    const handelChangeStateModelLeadingBridge = (e) => {
        if (!modelLeadingBridge){
            setError(true)
        }  
        setModelLeadingBridge(e.target.value)
    }
    const handelChangeStateModelManagedBridge = (e) => {
        if (!modelManagedBridge){
            setError(true)
        }  
        setModelManagedBridge(e.target.value)
    }
    const handelChangeStateFactoryNumberManagedBridge = (e) => {
        if (!factoryNumberManagedBridge){
            setError(true)
        }  
        setFactoryNumberManagedBridge(e.target.value)
    }
    const handelChangeStateDataShipment = (e) => {
        if (!dataShipment){
            setError(true)
        }  
        setDataShipment(e.target.value)
    }
    const handelChangeStateFactoryNumberSupplyContract = (e) => {
        if (!factoryNumberSupplyContract){
            setError(true)
        }  
        setFactoryNumberSupplyContract(e.target.value)
    }
    const handelChangeStateConsumer = (e) => {
        if (!consumer){
            setError(true)
        }  
        setConsumer(e.target.value)
    }
    const handelChangeStateComplictation = (e) => {
        if (!complictation){
            setError(true)
        }  
        setComplictation(e.target.value)
    }
    const handelChangeStateClient = (e) => {
        if (!client){
            setError(true)
        }  
        setClient(e.target.value)
    }
    const handelChangeStateFactoryNumberLeadingBridge = (e) => {
        if (!factoryNumberLeadingBridge){
            setError(true)
        }  
        setFactoryNumberLeadingBridge(e.target.value)
    }
    const handelChangeStateServiceCompany = (e) => {
        if (!serviceCompany){
            setError(true)
        }  
        setServiceCompany(e.target.value)
    }

    const UpdateRequest = async (id) => { 
        try {
            setLoading(true)
            const data = {
                "factoryNumber": factoryNumber,
                "model": model,
                "modelEngine": modelEngine,
                "factoryNumberEngine": factoryNumberEngine,
                "modelTransmission": modelTransmission,
                "factoryNumberTransmission": factoryNumberTransmission,
                "modelLeadingBridge": modelLeadingBridge,
                "modelManagedBridge": modelManagedBridge,
                "factoryNumberManagedBridge": factoryNumberManagedBridge,
                "factoryNumberSupplyContract": factoryNumberSupplyContract,
                "dataShipment": dataShipment,
                "consumer": consumer,
                "complictation": complictation,
                "client": client,
                "serviceCompany": serviceCompany,
            };
            await axios.put(`http://127.0.0.1:8001/api/machine/update/${id}/`, data, {
                headers: {
                     Authorization: `Bearer ${token}`
                }
            });
            setLoading(false)
            navigate('/home')
        }
        catch (err){
            console.log(err.response.data) 
            console.log(err.message)
            setError(true)
            setLoading(false)
        }
    }

    return (
    <>
        <wrapper className='wrapper'>
        <Header/>
        <main className="update-to">
        {role === 'manager' ? (
        !loading ? ( 
            <>
            <h3 className="title-update">Редактирование информации Машины</h3>
            <p className="note">*вписаное значение должно совпадать с существующим значением</p>
            <div className="container-update-machine">
                <input 
                    className={`update-input ${validErr && !factoryNumber ? 'error' : ''}`}
                    placeholder='Заводской номер' 
                    type='text' 
                    value={factoryNumber} 
                    onChange={handelChangeStateTypeFactoryNumber}>
                </input>
                <h3 className="name-sector">Заводской номер: {dataMachine.factoryNumber}</h3>
                <input 
                    className={`update-input ${validErr && !model ? 'error' : ''}`}
                    placeholder='Модель машины' 
                    type='text' 
                    value={model} 
                    onChange={handelChangeStateDateModel}>
                </input>
                <h3 className="name-sector">Модель машины: {dataMachine.model}</h3>
                <input 
                    className={`update-input ${validErr && !modelEngine ? 'error' : ''}`}
                    placeholder='Модель двигателя' 
                    type="text" 
                    value={modelEngine} 
                    onChange={handelChangeStateModelEngine}>
                </input>
                <h3 className="name-sector">Модель двигателя: {dataMachine.modelEngine}</h3>
                <input 
                    className={`update-input ${validErr && !factoryNumberEngine ? 'error' : ''}`}
                    placeholder='Номер двигателя' 
                    type='text' 
                    value={factoryNumberEngine} 
                    onChange={handelChangeStateFactoryNumberEngine}>
                </input>
                <h3 className="name-sector">Номер двигателя: {dataMachine.factoryNumberEngine}</h3>
                <input 
                    className={`update-input ${validErr && !modelTransmission ? 'error' : ''}`}
                    placeholder='Модель трансмисии' 
                    type='text' 
                    value={modelTransmission} 
                    onChange={handelChangeStateModelTransmissionr}>
                </input>
                <h3 className="name-sector">Модель трансмисии: {dataMachine.modelTransmission}</h3>
                <input 
                    className={`update-input ${validErr && !factoryNumberTransmission ? 'error' : ''}`}
                    placeholder='Номер трансмисии' 
                    type='text' 
                    value={factoryNumberTransmission} 
                    onChange={handelChangeStateFactoryNumberTransmission}>
                </input>
                <h3 className="name-sector">Номер трансмисии: {dataMachine.factoryNumberTransmission}</h3>
                <input 
                    className={`update-input ${validErr && !modelManagedBridge ? 'error' : ''}`}
                    placeholder='Модель управляемого поста' 
                    type='text' 
                    value={modelManagedBridge} 
                    onChange={handelChangeStateModelManagedBridge}>
                </input>
                <h3 className="name-sector">Модель управляемого моста: {dataMachine.modelManagedBridge}</h3>
                <input 
                    className={`update-input ${validErr && !factoryNumberManagedBridge ? 'error' : ''}`}
                    placeholder='Номер управляемого моста' 
                    type='text' 
                    value={factoryNumberManagedBridge} 
                    onChange={handelChangeStateFactoryNumberManagedBridge}>
                </input>
                <h3 className="name-sector">Номер управляемого поста: {dataMachine.factoryNumberManagedBridge}</h3>
                <input 
                    className={`update-input ${validErr && !modelLeadingBridge ? 'error' : ''}`}
                    placeholder='Модель ведушего моста' 
                    type='text' 
                    value={modelLeadingBridge} 
                    onChange={handelChangeStateModelLeadingBridge}>
                </input>
                <h3 className="name-sector">Модель ведушего моста: {dataMachine.modelLeadingBridge}</h3>
                <input 
                    className={`update-input ${validErr && !factoryNumberLeadingBridge ? 'error' : ''}`}
                    placeholder='Номер ведушего моста' 
                    type='text' 
                    value={factoryNumberLeadingBridge} 
                    onChange={handelChangeStateFactoryNumberLeadingBridge}>
                </input>
                <h3 className="name-sector">Номер ведушего моста: {dataMachine.factoryNumberLeadingBridge}</h3>
                <input 
                    className={`update-input ${validErr && !factoryNumberSupplyContract ? 'error' : ''}`}
                    placeholder='Дата отгрузки с завода' 
                    type='text' 
                    value={dataShipment} 
                    onChange={handelChangeStateDataShipment}>
                </input>
                <h3 className="name-sector">Дата отгрузки с завода {dataMachine.dataShipment}</h3>
                <input 
                    className={`update-input ${validErr && !factoryNumberSupplyContract ? 'error' : ''}`}
                    placeholder='Номер контракта' 
                    type='text' 
                    value={factoryNumberSupplyContract} 
                    onChange={handelChangeStateFactoryNumberSupplyContract}>
                </input>
                <h3 className="name-sector">Номер контракта: {dataMachine.factoryNumberSupplyContract}</h3>
                <input 
                    className={`update-input ${validErr && !consumer ? 'error' : ''}`}
                    placeholder='Консумер' 
                    type='text' 
                    value={consumer} 
                    onChange={handelChangeStateConsumer}>
                </input>
                <h3 className="name-sector">Консумер: {dataMachine.consumer}</h3>
                <input 
                    className={`update-input ${validErr && !complictation ? 'error' : ''}`}
                    placeholder='Комплектация' 
                    type='text' 
                    value={complictation} 
                    onChange={handelChangeStateComplictation}>
                </input>
                <h3 className="name-sector">Комплектация: {dataMachine.complictation}</h3>
                <input 
                    className={`update-input ${validErr && !client ? 'error' : ''}`}
                    placeholder='Клиент' 
                    type='text' 
                    value={client} 
                    onChange={handelChangeStateClient}>
                </input>
                <h3 className="name-sector">Клиент {dataMachine.client}</h3>
                <input 
                    className={`update-input ${validErr && !serviceCompany ? 'error' : ''}`}
                    placeholder='Сервисная компания' 
                    type='text' 
                    value={serviceCompany} 
                    onChange={handelChangeStateServiceCompany}>
                </input>
                <h3 className="name-sector">Сервисная компания {dataMachine.serviceCompany}</h3>

            </div>
            <h3 className={`error-faild ${err ? 'active': ''}`}>Введите корректные данные</h3>

            <button className="full-update-button" onClick={() => handleUseButton(dataMachine.id)}>Редактировать</button>
            </>
        ):(
            <div className="contaner-loader">
                <img src={loader} className="video-loading-update" autoPlay muted loop />
            </div>
        )):(<div className="not-access-section">
                <h3>В целях безопасности у вас нет доступа к этой странице, повторите попытку с главной страници</h3>
                <button className='button-not-access-section' onClick={() => navigate('/home')}>На главную</button>
            </div>)}
        </main>
        <Footer/>
        </wrapper>
    </>
    )
}