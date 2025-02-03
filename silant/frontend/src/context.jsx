import React, { createContext, useState, useContext } from 'react';

const MachineContext = createContext();

// Провайдер контекста
export const MachineProvider = ({ children }) => {
    const [machine, setMachine] = useState(null);
    const [filterNameItemLocal, setFilterNameItemLocal] = useState('none');
    const [filterItemLocal, setFilterItemLocal] = useState('none');
    const [token, setTokenLocal] = useState('')
    const [dataTO, setDataTO] = useState({})
    const [dataMachine, setDataMachine] = useState({})
    const [dataReclamation, setDataReclamation] = useState({})
    const [idSec, setId] = useState(false)

    return (
        <MachineContext.Provider value={{ 
            machine,
            setMachine,
            filterItemLocal,
            setFilterItemLocal,
            filterNameItemLocal,
            setFilterNameItemLocal,
            token,
            setTokenLocal,
            dataTO,
            setDataTO,
            dataMachine,
            setDataMachine,
            dataReclamation,
            setDataReclamation,
            idSec,
            setId,
            }}>
            {children}
        </MachineContext.Provider>
    );  
};

// Пользовательский хук для доступа к контексту
export const useMachine = () => useContext(MachineContext);