import React from 'react';
import ReactDOM from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import App from './App.jsx';
import { RequestProvider } from './context/RequestContext';
import './index.css';

// Datos de prueba
const testData = [
  {
    id: '9zn8jred5',
    fechaSolicitud: '2024-12-19',
    nombreSolicitante: 'Test User',
    correoSolicitante: 'test@example.com',
    nombreProveedor: 'Test Provider',
    codigoProveedor: 'TEST001',
    valorActual: '100',
    valorNuevo: '120',
    variacionCalculada: '20',
    tipoEntrada: 'precios',
    status: 'pending',
    comentarios: 'Test comment'
  }
];

// Sobrescribe localStorage con los datos de prueba
localStorage.setItem('requests', JSON.stringify(testData));

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RequestProvider>
      <App />
      <Toaster position="top-right" />
    </RequestProvider>
  </React.StrictMode>
);