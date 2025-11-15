import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Inicio } from './pages/inicio';
import { Catalogo } from './pages/catalogo';
import { ProductDetail } from './pages/producto_detallado';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/catalogo" element={<Catalogo />} />
        <Route path="/artistas" element={<Inicio />} />
        <Route path="/categorias" element={<Inicio />} />
        <Route path="/login" element={<Inicio />} />
        <Route path="/producto/:productId" element={<ProductDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;