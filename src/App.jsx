import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/home/Home'; // Ruta corregida
import NewRequest from './pages/new-request/NewRequest'; // Ruta corregida
import ShareRequest from './pages/share/ShareRequest'; // Ruta corregida
import ApprovalView from './pages/approval/ApprovalPage'; // Ruta corregida
import SolicitantView from './pages/solicitant/SolicitantView'; // Ruta corregida

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/new-request" element={<NewRequest />} />
        <Route path="/share/:id" element={<ShareRequest />} />
        <Route path="/approve/:id" element={<ApprovalView />} />
        <Route path="/solicitante/:email" element={<SolicitantView />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;