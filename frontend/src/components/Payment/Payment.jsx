import React, { useState } from "react";
import "./Payment.css";

const Payment = () => {
  const [form, setForm] = useState({
    cardNumber: "",
    cardHolder: "",
    email: "",
    expiry: "",
    cvv: "",
    city: "",
    street: "",
    zip: "",
    phone: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("efectivo");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Pago enviado:", { ...form, paymentMethod });
    alert("Pago confirmado ✅");
  };

  return (
    <div className="checkout-container">
      <div className="checkout-header">
        <h2>Checkout</h2>
      </div>

      <form className="checkout-form" onSubmit={handleSubmit}>
        <h3>Pago en {paymentMethod}</h3>

        <input
          type="text"
          name="cardNumber"
          placeholder="Número de tarjeta"
          value={form.cardNumber}
          onChange={handleChange}
        />
        <input
          type="text"
          name="cardHolder"
          placeholder="Propietario de la tarjeta"
          value={form.cardHolder}
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          value={form.email}
          onChange={handleChange}
        />

        <div className="row">
          <input
            type="text"
            name="expiry"
            placeholder="MM/AA"
            value={form.expiry}
            onChange={handleChange}
          />
          <input
            type="text"
            name="cvv"
            placeholder="CV"
            value={form.cvv}
            onChange={handleChange}
          />
        </div>

        <div className="row">
          <input
            type="text"
            name="city"
            placeholder="Ciudad"
            value={form.city}
            onChange={handleChange}
          />
          <input
            type="text"
            name="street"
            placeholder="Calle"
            value={form.street}
            onChange={handleChange}
          />
          <input
            type="text"
            name="zip"
            placeholder="ZIP"
            value={form.zip}
            onChange={handleChange}
          />
        </div>

        <input
          type="text"
          name="phone"
          placeholder="Número telefónico"
          value={form.phone}
          onChange={handleChange}
        />

        <button type="submit" className="confirm-button">
          Confirmar pago
        </button>
      </form>

      <aside className="checkout-summary">
        <p><strong>Subtotal:</strong> $0.00</p>
        <p><strong>Comisión:</strong> $0.00</p>
        <p><strong>Total:</strong> $0.00</p>
      </aside>
    </div>
  );
};

export default Payment;