import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { MachineProvider } from './context.jsx';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <MachineProvider>
      <App />
    </MachineProvider>
  </React.StrictMode>
);


