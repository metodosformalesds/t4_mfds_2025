/* 
    Autor: Ian Domínguez
    Fecha: 15 de noviembre de 2025
    Descripción: Se muestra una página para términos y condiciones.
*/

import React from "react";
import { Footer } from '../../components/Footer';
import { Header } from '../../components/Header'; 
import "./terminos_condiciones.css";

export default function TermsAndConditions() {
  return (
    <div className="terms-page">
       <Header />

      <div className="terms-container">
        <h1 className="terms-main-title">Términos y Condiciones</h1>
        <br />
        <div className="terms-content">
          <section className="terms-section">
            <h2 className="terms-section-title">
              1. Aceptación de los Términos
            </h2>
            <p className="terms-text">
              Al acceder y utilizar la plataforma Reborn, usted acepta estar
              sujeto a estos Términos y Condiciones. Si no está de acuerdo con
              alguna parte de estos términos, no podrá acceder al servicio.
              Estos términos se aplican a todos los visitantes, usuarios y otras
              personas que accedan o utilicen el servicio.
            </p>
          </section>

          <section className="terms-section">
            <h2 className="terms-section-title">2. Descripción del Servicio</h2>
            <p className="terms-text">
              Reborn es una plataforma dedicada a promover y comercializar la
              artesanía mexicana, conectando a artesanos talentosos con amantes
              del arte tradicional. Facilitamos la compra y venta de productos
              artesanales únicos, proporcionando un espacio seguro para
              transacciones entre compradores y vendedores.
            </p>
          </section>

          <section className="terms-section">
            <h2 className="terms-section-title">3. Registro de Cuenta</h2>
            <p className="terms-text">
              Para utilizar ciertas funciones de nuestra plataforma, debe
              registrar una cuenta. Al hacerlo, usted se compromete a:
            </p>
            <ul className="terms-list">
              <li>Proporcionar información veraz, precisa y completa</li>
              <li>Mantener y actualizar su información de registro</li>
              <li>
                Ser responsable de mantener la confidencialidad de su contraseña
              </li>
              <li>
                Notificar inmediatamente cualquier uso no autorizado de su
                cuenta
              </li>
              <li>
                Ser responsable de todas las actividades que ocurran bajo su
                cuenta
              </li>
            </ul>
          </section>

          <section className="terms-section">
            <h2 className="terms-section-title">
              4. Productos y Transacciones
            </h2>
            <p className="terms-text">
              Los artesanos son responsables de la descripción precisa de sus
              productos, incluyendo materiales, dimensiones y cualquier otra
              característica relevante. Reborn actúa como intermediario entre
              compradores y vendedores, facilitando las transacciones pero no
              siendo responsable directo de la calidad de los productos.
            </p>
            <p className="terms-text">
              Nos reservamos el derecho de rechazar o cancelar pedidos por
              cualquier motivo, incluyendo disponibilidad del producto, errores
              en la descripción o precio, o problemas identificados en el
              sistema de pago.
            </p>
          </section>

          <section className="terms-section">
            <h2 className="terms-section-title">5. Política de Pagos</h2>
            <p className="terms-text">
              Todos los pagos se procesan a través de Stripe, un proveedor de
              servicios de pago seguro. Al realizar una compra, usted autoriza a
              Reborn a cobrar el monto total del pedido, incluyendo impuestos y
              costos de envío aplicables.
            </p>
            <p className="terms-text">
              Los precios están expresados en pesos mexicanos (MXN) y pueden
              estar sujetos a cambios sin previo aviso.
            </p>
          </section>

          <section className="terms-section">
            <h2 className="terms-section-title">6. Entregas</h2>
            <p className="terms-text">
              {/* Los tiempos de envío varían según la ubicación del artesano y del
              comprador. Los artesanos son responsables de enviar los productos
              en el tiempo acordado y en condiciones adecuadas. Reborn no se
              hace responsable por retrasos causados por servicios de mensajería
              externos o circunstancias fuera de nuestro control. */}
              Los artesanos son responsables de tener el producto en el tiempo
              acordado y en condiciones adecuadas. Los clientes deben acudir a
              la ubicación del artesano para la recepción del producto. Reborn
              no se hace responsable por circunstancias fuera de nuestro
              control.
            </p>
          </section>

          <section className="terms-section">
            <h2 className="terms-section-title">
              7. Devoluciones y Reembolsos
            </h2>
            <p className="terms-text">
              Las solicitudes de devolución deben realizarse dentro de los 14
              días posteriores a la recepción del producto. El producto debe
              estar en su estado original y sin daños.
              {/*   Los costos de envío de devolución corren por cuenta del comprador,
              excepto en casos de productos defectuosos o errores del vendedor. */}
            </p>
          </section>

          <section className="terms-section">
            <h2 className="terms-section-title">8. Propiedad Intelectual</h2>
            <p className="terms-text">
              Todo el contenido de la plataforma, incluyendo logotipos, diseños,
              textos y código, es propiedad de Reborn o de sus licenciantes. Los
              artesanos conservan los derechos de sus creaciones, otorgando a
              Reborn una licencia limitada para mostrar y promocionar sus
              productos en la plataforma.
            </p>
          </section>

          <section className="terms-section">
            <h2 className="terms-section-title">9. Conducta del Usuario</h2>
            <p className="terms-text">
              Los usuarios se comprometen a no utilizar la plataforma para
              actividades ilegales, fraudulentas o que violen estos términos.
              Está prohibido publicar contenido ofensivo, difamatorio o que
              infrinja derechos de terceros.
            </p>
          </section>

          <section className="terms-section">
            <h2 className="terms-section-title">
              10. Limitación de Responsabilidad
            </h2>
            <p className="terms-text">
              Reborn no será responsable por daños indirectos, incidentales,
              especiales o consecuentes que resulten del uso o la imposibilidad
              de usar nuestros servicios. Nuestra responsabilidad máxima estará
              limitada al monto pagado por el usuario en los últimos 12 meses.
            </p>
          </section>

          <section className="terms-section">
            <h2 className="terms-section-title">11. Modificaciones</h2>
            <p className="terms-text">
              Nos reservamos el derecho de modificar estos términos en cualquier
              momento. Los cambios entrarán en vigor inmediatamente después de
              su publicación en la plataforma. El uso continuado del servicio
              después de dichos cambios constituye su aceptación de los nuevos
              términos.
            </p>
          </section>

          <section className="terms-section">
            <h2 className="terms-section-title">12. Contacto</h2>
            <p className="terms-text">
              Si tiene preguntas sobre estos Términos y Condiciones, puede
              contactarnos en:
            </p>
            <p className="terms-contact">
              info@reborn.com
              <br />
              Reborn App
            </p>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
}
