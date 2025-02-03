import React, {useState} from "react";
import { useMachine } from "./context";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "./Header";
import Footer from "./Footer";
import loader from './assets/775.gif';
import './css/UpdateReclamations.scss';
import './css/UpdateReclamationMobile.scss';

export default function UpdateReclamations() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState()
    const [err, setError] = useState(false)
    const { dataReclamation } = useMachine()
    const { idSec } = useMachine()
    const [validErr, setValidErr] = useState()
    const role = localStorage.getItem('role')
    const token = localStorage.getItem('Token')

    const [dateReclamation, setDateReclamation] = useState(dataReclamation.dateReclamation)
    const [development, setDevelopment] = useState(dataReclamation.development)
    const [rejectNode, setRejectNode] = useState(dataReclamation.rejectNode)
    const [descriotionReject, setDescriotionReject] = useState(dataReclamation.descriotionReject)
    const [recoveryMethod, setRecoveryMethod] = useState(dataReclamation.recoveryMethod)
    const [useSpareParts, setUseSpareParts] = useState(dataReclamation.useSpareParts)
    const [dataRecovery, setDataRecovery] = useState(dataReclamation.dataRecovery)
    const [downtimeEquipment, setDowntimeEquipment] = useState(dataReclamation.downtimeEquipment)    
    const [machine, setMachine] = useState(dataReclamation.machine)
    const [serviceCompany, setServiceCompany] = useState(dataReclamation.serviceCompany) 
    
    const handleUseButton = (id) => {
        if (id == idSec){
            if (dateReclamation && development && rejectNode && descriotionReject && recoveryMethod && machine && serviceCompany && useSpareParts && dataRecovery && downtimeEquipment){
                UpdateRequest(id)
            }}
        setValidErr(true)
    }

    const handelChangeStateDate = (e) => {
        if (!dateReclamation){
            setError(true)
        }  
        setDateReclamation(e.target.value)
    }
    const handelChangeStateDevelopment = (e) => {
        if (!development){
            setError(true)
        }  
        setDevelopment(e.target.value)
    }
    const handelChangeStateRejectNode = (e) => {
        if (!rejectNode){
            setError(true)
        }  
        setRejectNode(e.target.value)
    }
    const handelChangeStateDescReject = (e) => {
        if (!descriotionReject){
            setError(true)
        }  
        setDescriotionReject(e.target.value)
    }
    const handelChangeStateRecoveryMethod = (e) => {
        if (!recoveryMethod){
            setError(true)
        }  
        setRecoveryMethod(e.target.value)
    }
    const handelChangeStateUseSpareParts = (e) => {
        if (!useSpareParts){
            setError(true)
        }  
        setUseSpareParts(e.target.value)
    }
    const handelChangeStateDataRecovery = (e) => {
        if (!dataRecovery){
            setError(true)
        }  
        setDataRecovery(e.target.value)
    }
    const handelChangeStateDowntimeEquipment = (e) => {
        if (!downtimeEquipment){
            setError(true)
        }  
        setDowntimeEquipment(e.target.value)
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
    const UpdateRequest = async (id) => { 
        try {
            setLoading(true)
            const data = {
                "dateReclamation": dateReclamation,
                "development": development,
                "rejectNode": rejectNode,
                "descriotionReject": descriotionReject,
                "recoveryMethod": recoveryMethod,
                "useSpareParts": useSpareParts,
                "dataRecovery": dataRecovery,
                "downtimeEquipment": downtimeEquipment,
                "machine": machine,
                "serviceCompany": serviceCompany
            };
            await axios.put(`http://127.0.0.1:8001/api/reclamation/update/${id}/`, data, {
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
              <main className="update-rec">
              {idSec ? (
              !loading ? ( 
                  <>
                  <h3 className="title-update">Редактирование информации ТО</h3>
                  <p className="note">*вписаное значение должно совпадать с существующим значением</p>
                  <div className="container-update-rec">
                      <input 
                          className={`update-input ${validErr && !dataReclamation ? 'error' : ''}`}
                          placeholder='Дата рекламации' 
                          type='date' 
                          value={dateReclamation} 
                          onChange={handelChangeStateDate}>
                      </input>
                      <h3 className="name-sector">Дата рекламации: {dataReclamation.dateReclamation}</h3>
                      <input 
                          className={`update-input ${validErr && !development ? 'error' : ''}`}
                          placeholder='Наработка часов' 
                          type='number' 
                          value={development} 
                          onChange={handelChangeStateDevelopment}>
                      </input>
                      <h3 className="name-sector">Наработка часов: {dataReclamation.development}м/ч</h3>
                      <input 
                          className={`update-input ${validErr && !rejectNode ? 'error' : ''}`}
                          placeholder='Узел отказа' 
                          type="text" 
                          value={rejectNode} 
                          onChange={handelChangeStateRejectNode}>
                      </input>
                      <h3 className="name-sector">Узел отказа: {dataReclamation.rejectNode} </h3>
                      <input 
                          className={`update-input ${validErr && !descriotionReject ? 'error' : ''}`}
                          placeholder='Описание отказа' 
                          type='text' 
                          value={descriotionReject} 
                          onChange={handelChangeStateDescReject}>
                      </input>
                      <h3 className="name-sector">Описание отказа: {dataReclamation.descriotionReject}</h3>
                      <input 
                          className={`update-input ${validErr && !recoveryMethod ? 'error' : ''}`}
                          placeholder='Метод востановления' 
                          type='date' 
                          value={recoveryMethod} 
                          onChange={handelChangeStateRecoveryMethod}>
                      </input>
                      <h3 className="name-sector">Метод востановления: {dataReclamation.recoveryMethod}</h3>
                      <input 
                          className={`update-input ${validErr && !useSpareParts ? 'error' : ''}`}
                          placeholder='Используемые запасные части' 
                          type='text' 
                          value={useSpareParts} 
                          onChange={handelChangeStateUseSpareParts}>
                      </input>
                      <h3 className="name-sector">Используемые запасные части: {dataReclamation.useSpareParts}</h3>
                      <input 
                          className={`update-input ${validErr && !dataRecovery ? 'error' : ''}`}
                          placeholder='Дата востановления' 
                          type='date' 
                          value={dataRecovery} 
                          onChange={handelChangeStateDataRecovery}>
                      </input>
                      <h3 className="name-sector">Дата востановления: {dataReclamation.dataRecovery}</h3>
                      <input 
                          className={`update-input ${validErr && !downtimeEquipment ? 'error' : ''}`}
                          placeholder='Время простоя техники' 
                          type='text' 
                          value={downtimeEquipment} 
                          onChange={handelChangeStateDowntimeEquipment}>
                      </input>
                      <h3 className="name-sector">Время простоя техники: {dataReclamation.downtimeEquipment}</h3>
                      <input 
                          className={`update-input ${validErr && !machine ? 'error' : ''}`}
                          placeholder='Машина' 
                          type='text' 
                          value={machine} 
                          onChange={handelChangeStateMachine}>
                      </input>
                      <h3 className="name-sector">Машина: {dataReclamation.machine}</h3>
                      <input 
                          className={`update-input ${validErr && !serviceCompany ? 'error' : ''}`}
                          placeholder='Сервисная компания' 
                          type='text' 
                          value={serviceCompany} 
                          onChange={handelChangeStateServiceCompany}>
                      </input>
                      <h3 className="name-sector">Сервисная компания: {dataReclamation.serviceCompany}</h3>
                  </div>
                  <h3 className={`error-faild ${err ? 'active': ''}`}>Введите корректные данные</h3>
      
                  <button className="full-update-button" onClick={() => handleUseButton(dataReclamation.id)}>Сохранить изменения</button>
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