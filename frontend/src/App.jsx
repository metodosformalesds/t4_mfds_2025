import React from 'react';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import BtnGeneral from './components/Botones/btn-general/btnGeneral';

function App() {
  return (
     <div style={{ padding: "20px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
      {/* Diferentes colores, misma estructura */}
      <BtnGeneral 
        color="morado" 
        text="Botón Morado" 
        onClick={() => console.log("Morado")}
      />
      
      <BtnGeneral 
        color="rosa" 
        text="Botón Rosa" 
        onClick={() => console.log("Rosa")}
      />
      
      <BtnGeneral 
        color="amarillo" 
        text="Botón Amarillo" 
        onClick={() => console.log("Amarillo")}
      />
      
      <BtnGeneral 
        color="morado-claro" 
        text="Botón Morado Claro" 
        onClick={() => console.log("Morado Claro")}
      />

      <BtnGeneral 
        color="morado" 
        property1="variant-2"
        text="Botón con Borde" 
      />
    </div>
  );
}

export default App;