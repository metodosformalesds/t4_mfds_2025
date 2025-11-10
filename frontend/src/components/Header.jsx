import "./Header.css";

function Header() {
  return (
    <header>
      <div className="container">
        <div className="header-top">
          <div className="logo">Re<span>born</span></div>

          <div className="user-actions">
            <a href="#">Iniciar sesión</a>
            <a href="#">Registrarse</a>
            <a href="#">Carrito (0)</a>
          </div>
        </div>
      </div>

      <nav>
        <div className="container">
          <ul className="nav-links">
            <li><a href="#">Inicio</a></li>
            <li><a href="#">Productos</a></li>
            <li><a href="#">Artistas</a></li>
            <li><a href="#">Categorías</a></li>
            <li><a href="#">Comisiones</a></li>
            <li><a href="#">Sobre nosotros</a></li>
          </ul>
        </div>
      </nav>
    </header>
  );
}

export default Header;