import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Inicio } from './pages/inicio';
import { Catalogo } from './pages/catalogo';
import { ProductDetail } from './pages/producto_detallado';
import { Auth } from './components/auth';
import { CartProvider } from './context/CartContext';
import { Carrito } from './pages/carrito';
import { CheckoutPage } from './pages/checkout';
import { OrderConfirmationPage } from './pages/confirmation';
import { FAQ } from './pages/faq';
import { TermsAndConditions } from './pages/terminos_condiciones';
import { PaymentMethods } from './pages/metodo_pago';

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/artistas" element={<Inicio />} />
          <Route path="/categorias" element={<Inicio />} />
          <Route path="/producto/:productId" element={<ProductDetail />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/carrito" element={<Carrito />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/orden-confirmada" element={<OrderConfirmationPage />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/terminos-condiciones" element={<TermsAndConditions />} />
          <Route path="/metodos-pago" element={<PaymentMethods />} />
        </Routes>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;