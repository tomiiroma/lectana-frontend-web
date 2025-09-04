import "./Navbar.css"

function Navbar() {
  return (
    <header className="header">
        <div className="container-header">
        <img src="/lectana.svg" alt="Logo" className="header-logo" />
        <span className="header-title">Lectana</span>
        </div>
        <nav className="navbar">
            <ul className="navbar-list">
                <li className="navbar-item"><a className="navbar-link" href="">Biblioteca</a></li>
                <li className="navbar-item"><a className="navbar-link" href="">Categorias</a></li>
                <li className="navbar-item"> <a className="navbar-link" href="">Docentes</a></li>
                <li className="navbar-item"><a className="navbar-link" href="">Contacto</a></li>

            </ul>
        </nav>
    </header>
  )
}

export default Navbar