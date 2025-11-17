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
import { FAQ } from './pages/estatico/faq';
import { TermsAndConditions } from './pages/estatico/terminos_condiciones';
import { PaymentMethods } from './pages/estatico/metodo_pago';
import { MiCuenta } from './pages/perfil/mi_cuenta';
import { MisProductos } from './pages/perfil/mis_productos';
import { MisPedidos } from './pages/perfil/mis_pedidos';
import { MiInformacion } from './pages/perfil/mi_informacion';
import { Seguridad } from './pages/perfil/mi_seguridad';
import { Favorites } from './pages/perfil/mis_favoritos';
import Artistas from './pages/artistas/Artistas';
import WriteReview from './pages/resenas/crearResena';
import ProductReviews from './pages/resenas/resenasProducto';
import { ArtistProfile } from './pages/artista_perfil';
import AgregarProducto from './pages/agregar_producto/agregar_producto';
import EditarProducto from './pages/editar_producto/editar_producto';

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/artistas" element={<Artistas />} />
          <Route path="/artista/:artistId" element={<ArtistProfile />} />
          <Route path="/categorias" element={<Inicio />} />
          <Route path="/producto/:productId" element={<ProductDetail />} />
          <Route path="/producto/:productId/resenas" element={<ProductReviews />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/carrito" element={<Carrito />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/orden-confirmada" element={<OrderConfirmationPage />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/terminos-condiciones" element={<TermsAndConditions />} />
          <Route path="/metodos-pago" element={<PaymentMethods />} />
          
          {/* Profile Routes */}
          <Route path="/mi-cuenta" element={<MiCuenta />} />
          <Route path="/mi-cuenta/mis-productos" element={<MisProductos />} />
          <Route path="/mi-cuenta/mis-pedidos" element={<MisPedidos />} />
          <Route path="/mi-cuenta/favoritos" element={<Favorites />} />
          <Route path="/mi-cuenta/informacion" element={<MiInformacion />} />
          <Route path="/mi-cuenta/seguridad" element={<Seguridad />} />
          <Route path="/mi-cuenta/pedidos/:orderId/resena/:productId" element={<WriteReview />} />
          <Route path="/mi-cuenta/agregar-producto" element={<AgregarProducto />} />
          <Route path="/mi-cuenta/productos/:productId/editar" element={<EditarProducto />} />
        </Routes>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;