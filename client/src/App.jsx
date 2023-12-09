import React from 'react';
import { Routes, Route } from 'react-router-dom';
// Componentes
import { HomeApp } from './components/HomeApp';
import { RegisterApp } from './components/Register/RegisterApp';
import { RecuperarApp } from './components/Recuperar/RecuperarApp';

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<HomeApp/>}/>
        <Route path='/Registro' element={<RegisterApp/>}/>
        <Route path='/Recuperar' element={<RecuperarApp/>}/>
      </Routes>
    </>
  )
}

export default App
