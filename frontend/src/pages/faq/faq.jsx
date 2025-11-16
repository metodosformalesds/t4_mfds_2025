/* 
    Autor: Ian Domínguez
    Fecha: 15 de noviembre de 2025
    Descripción: Muestra una página para la revisar preguntas 'frecuentes' o posibles de los usuarios.
*/

import React, { useState } from "react";
import { Footer } from '../../components/Footer';
import { Header } from '../../components/Header'; 
import "./faq.css";

export default function FAQ() {
  const [openItems, setOpenItems] = useState([]);

  const toggleItem = (index) => {
    if (openItems.includes(index)) {
      setOpenItems(openItems.filter((i) => i !== index));
    } else {
      setOpenItems([...openItems, index]);
    }
  };

  const faqData = [
    {
      category: "Cuenta y Registro",
      questions: [
        {
          question: "¿Cómo creo una cuenta en Reborn?",
          answer:
            "Para crear una cuenta, haz clic en 'Identifícate' en la parte superior de la página y selecciona 'Crear una cuenta'. Deberás proporcionar tu nombre de usuario, nombre completo, correo electrónico, dirección y crear una contraseña segura. Una vez completado el formulario, recibirás un correo de confirmación.",
        },
        {
          question: "¿Olvidé mi contraseña, cómo la recupero?",
          answer:
            "En la página de inicio de sesión, haz clic en 'Olvidé mi contraseña'. Ingresa tu nombre de usuario y correo electrónico registrado. Te enviaremos un enlace para restablecer tu contraseña. El enlace es válido por 24 horas.",
        },
        {
          question: "¿Puedo cambiar mi información de perfil?",
          answer:
            "Sí, puedes actualizar tu información accediendo a 'Mi cuenta' y seleccionando 'Editar perfil'. Podrás modificar tu nombre, dirección, biografía, teléfono y foto de perfil. El nombre de usuario y correo electrónico requieren verificación adicional para ser cambiados.",
        },
      ],
    },
    {
      category: "Compras",
      questions: [
        {
          question: "¿Cómo realizo una compra?",
          answer:
            "Navega por nuestro catálogo de productos artesanales. Cuando encuentres algo que te guste, haz clic en 'Ver producto' para más detalles. Puedes agregar el producto al carrito o comprarlo directamente. Sigue el proceso de pago seguro para completar tu compra.",
        },
        {
          question: "¿Es seguro comprar en Reborn?",
          answer:
            "Absolutamente. Utilizamos Stripe como procesador de pagos, uno de los más seguros del mundo. Tu información financiera está encriptada y nunca almacenamos los datos completos de tu tarjeta. Además, todas las transacciones están protegidas.",
        },
        {
          question: "¿Cómo agrego productos a mis favoritos?",
          answer:
            "Al visualizar cualquier producto, verás un ícono de corazón. Haz clic en él para agregarlo a tus favoritos. Puedes ver todos tus favoritos haciendo click en el ícono de corazón en el encabezado. También puedes guardar artistas favoritos para seguir sus nuevas creaciones.",
        },
      ],
    },
    {
      category: "Pagos y Facturación",
      questions: [
        {
          question: "¿Qué métodos de pago aceptan?",
          answer:
            "Aceptamos tarjetas de crédito y débito (Visa, Mastercard, American Express), así como pagos a través de OXXO Pay. Todos los pagos son procesados de forma segura a través de Stripe.",
        },
        {
          question: "¿Puedo pagar en efectivo?",
          answer:
            "Sí, ofrecemos la opción de pago en OXXO. Al seleccionar este método, recibirás un código de barras único que podrás presentar en cualquier tienda OXXO. El pago se refleja en 1-2 días hábiles.",
        },
        {
          question: "¿Emiten factura?",
          answer:
            "Sí, podemos emitir factura fiscal. Durante el proceso de pago, marca la opción 'Requiero factura' e ingresa tus datos fiscales. La factura se enviará a tu correo electrónico dentro de las 72 horas posteriores a la compra.",
        },
      ],
    },
    {
      category: "Devoluciones",
      questions: [
        {
          question: "¿Cuál es la política de devoluciones?",
          answer:
            "Tienes 14 días naturales después de recibir tu producto para solicitar una devolución. El producto debe estar sin uso y en su empaque original. Algunos productos personalizados no son elegibles para devolución.",
        },
        {
          question: "¿Cómo solicito una devolución?",
          answer:
            "Ve a 'Mis pedidos', selecciona el pedido correspondiente y haz clic en 'Solicitar devolución'. Describe el motivo y adjunta fotos si es necesario. Nuestro equipo revisará tu solicitud y te contactará en 24-48 horas.",
        },
        {
          question: "¿Cuánto tarda el reembolso?",
          answer:
            "Una vez aprobada la devolución y recibido el producto, el reembolso se procesa en 5-7 días hábiles. El tiempo que tarde en reflejarse en tu cuenta depende de tu banco o institución financiera.",
        },
      ],
    },
    {
      category: "Para Artesanos",
      questions: [
        {
          question: "¿Cómo puedo vender en Reborn?",
          answer:
            "Para convertirte en vendedor, debes registrarte como artesano. Ve a 'Crear cuenta' y selecciona el rol de artesano. Necesitarás completar tu perfil, verificar tu identidad y configurar tu cuenta de Stripe para recibir pagos.",
        },
        {
          question: "¿Cuánto cobra Reborn por comisión?",
          answer:
            "Reborn cobra una comisión del 15% sobre el precio de venta final. Esta comisión cubre los costos de la plataforma, procesamiento de pagos y soporte. Tú recibes el 85% restante directamente en tu cuenta de Stripe.",
        },
        {
          question: "¿Cómo recibo mis pagos?",
          answer:
            "Los pagos se transfieren a tu cuenta de Stripe conectada. Puedes retirar tus fondos a tu cuenta bancaria cuando lo desees. Las transferencias tardan 2-3 días hábiles en reflejarse en tu banco.",
        },
      ],
    },
  ];

  return (
    <div className="faq-page">
      <Header />

      <div className="faq-container">
        <h1 className="faq-main-title">Preguntas Frecuentes</h1>
        <p className="faq-subtitle">
          Encuentra respuestas a las preguntas más comunes sobre Reborn
        </p>

        <div className="faq-content">
          {faqData.map((category, catIndex) => (
            <div key={catIndex} className="faq-category">
              <h2 className="faq-category-title">{category.category}</h2>
              <div className="faq-questions">
                {category.questions.map((item, qIndex) => {
                  const itemIndex = `${catIndex}-${qIndex}`;
                  const isOpen = openItems.includes(itemIndex);

                  return (
                    <div key={qIndex} className="faq-item">
                      <button
                        className={`faq-question ${
                          isOpen ? "faq-question-open" : ""
                        }`}
                        onClick={() => toggleItem(itemIndex)}
                      >
                        <span>{item.question}</span>
                        <span className="faq-icon">{isOpen ? "−" : "+"}</span>
                      </button>
                      {isOpen && (
                        <div className="faq-answer">
                          <p>{item.answer}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="faq-contact-section">
          <h3 className="faq-contact-title">
            ¿No encontraste lo que buscabas?
          </h3>
          <p className="faq-contact-text">
            Contáctanos directamente y te ayudaremos con gusto.
          </p>
          <p className="faq-contact-info">info@reborn.com</p>
        </div>
      </div>

      <Footer />
    </div>
  );
}
