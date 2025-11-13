import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from './components/Header/Header';
import Cuerpo from './components/Cuerpo/Cuerpo';
import Footer from './components/Footer/Footer';
import Payment from "./components/Payment";
import Carrito from "./components/Carrito/Carrito";

function App() {
  return (
    <Router>
      <Header />

      <Routes>
        <Route path="/" element={<Cuerpo />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/carrito" element={<Carrito />} />
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;