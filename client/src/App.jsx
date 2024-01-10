import React from 'react';
import { Routes, Route } from 'react-router-dom';
// Componentes
import { HomeApp } from './components/HomeApp';
import { RegisterApp } from './components/Register/RegisterApp';
import { RecuperarApp } from './components/Recuperar/RecuperarApp';
import { FacturarApp } from './components/Facturacion/FacturarApp';
import { FacturaImp } from './components/Facturacion/FacturaImpApp';
import { VerFacturas } from './components/Facturacion/VerFacturas';

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<HomeApp/>}/>
        <Route path='/Registro' element={<RegisterApp/>}/>
        <Route path='/Recuperar' element={<RecuperarApp/>}/>
        <Route path='/Facturacion' element={<FacturarApp/>} />
        <Route path='Facturas' element={<VerFacturas/>}/>
        <Route path='/FacturaImp' element={<FacturaImp/>}/>
      </Routes>
    </>
  )
}

export default App
