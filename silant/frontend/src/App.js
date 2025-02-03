import './App.css';
import LoginSection from './LoginSection.jsx'
import HomeNoneAuth from './HomeNoneAuth.jsx'
import Home from './Home.jsx'
import UpdateTO from './UpdateTO.jsx';
import UpdateMachine from './UpdateMachine.jsx'
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useMachine } from './context.jsx';
import UpdateReclamations from './UpdateReclamations.jsx';


function App() {
  const { token } = useMachine()
  const role = localStorage.getItem('Role')
  const localToken = localStorage.getItem('Token')
  console.log(role)
  
  return (
      <BrowserRouter>
      <Routes>
        <Route path='/login' element={(localToken || token) ? <Navigate to="/home" /> : <LoginSection />}></Route>
        <Route path='/home' element={!(localToken || token) ? <HomeNoneAuth/> : <Home />} ></Route>
        <Route path='/update/:id' element={role == 'guest' ? <HomeNoneAuth /> : <UpdateTO/>} ></Route>
        <Route path='/machine/update/:id' element={role == 'guest' ? <HomeNoneAuth /> : <UpdateMachine/>} ></Route>
        <Route path='/reclamation/update/:id' element={role == 'guest' ? <HomeNoneAuth /> : <UpdateReclamations/>} ></Route>
      </Routes>
      </BrowserRouter>
  );
}

export default App;
