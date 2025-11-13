import React from 'react';
import { CardProducto } from './components/Cards/card_producto';

function App() {
  return (
      <CardProducto 
        productName="Vestido tradicional"
        artistName="María González" 
        price="$650.00 mxn"
        imageUrl="https://placehold.co/600x400"
        onViewDetails={() => console.log("Ver detalles")}
        onAddToCart={() => console.log("Agregar al carrito")}
        buttonText="Comprar ahora"
      />
  );
}

export default App;