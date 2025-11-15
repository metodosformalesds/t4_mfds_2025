/* 
    Autor: Ian Domínguez
    Fecha: 15 de noviembre de 2025
    Descripción: Muestra una página con los posibles métodos de pago de la plataforma
*/

import React from "react";
import { Footer } from '../../components/Footer';
import { Header } from '../../components/Header'; 
import "./metodo_pago.css";

export default function PaymentMethods() {
  return (
    <div className="payment-page">
      <Header />

      <div className="payment-container">
        <h1 className="payment-main-title">Métodos de Pago Aceptados</h1>

        <p className="payment-intro">
          Reborn acepta una variedad de opciones de pago, incluyendo tarjetas de
          crédito y débito.
        </p>

        <hr className="payment-divider" />

        <div className="payment-section">
          <p className="payment-section-intro">
            Los siguientes métodos de pago están disponibles:
          </p>

          <ul className="payment-list">
            <li>Visa</li>
            <li>Mastercard</li>
            <li>American Express</li>
            <li>Tarjetas de débito con logo Visa o Mastercard</li>
            <li>OXXO Pay (pago en efectivo)</li>
          </ul>

          <p className="payment-text">
            Puedes agregar un nuevo método de pago o cambiar tus datos
            existentes en cualquier momento desde la sección de{" "}
            <strong>Mi cuenta</strong>.
          </p>
        </div>

        <div className="payment-note-section">
          <p className="payment-note-title">Nota:</p>
          <ul className="payment-note-list">
            <li>
              Todos los pagos son procesados de forma segura a través de Stripe,
              un proveedor certificado PCI DSS Nivel 1.
            </li>
            <li>
              Los pagos realizados en OXXO tienen una vigencia de 72 horas y se
              confirman en 1-2 días hábiles.
            </li>
            <li>
              Todos los precios están expresados en Pesos Mexicanos (MXN) e
              incluyen IVA.
            </li>
            <li>
              Para solicitar factura fiscal, selecciona la opción "Requiero
              factura" durante el proceso de pago.
            </li>
          </ul>
        </div>

        <hr className="payment-divider" />

        <div className="payment-section">
          <h2 className="payment-section-title">Seguridad en los pagos</h2>
          <p className="payment-text">
            Tu información financiera está protegida con encriptación SSL de 256
            bits. Nunca almacenamos los datos completos de tu tarjeta en
            nuestros servidores. Todas las transacciones incluyen autenticación
            3D Secure para mayor protección.
          </p>
        </div>

        <div className="payment-section">
          <h2 className="payment-section-title">Problemas con tu pago</h2>
          <p className="payment-text">
            Si tu pago fue rechazado, verifica que los datos de tu tarjeta sean
            correctos y que tengas fondos suficientes. Si el problema persiste,
            contacta a tu banco o comunícate con nosotros.
          </p>
          <p className="payment-text">
            Para pagos en OXXO no confirmados después de 2 días hábiles,
            envíanos una foto de tu recibo de pago a{" "}
            <span className="email-link">info@reborn.com</span>.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}
