import { useState, useContext, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link, useNavigate } from 'react-router-dom';
import MyContext from '../my-context';
import axios from 'axios';

// Estilos
import '../styles/Navbar.css';

function Navbar2() {
  const { usuario, setUsuario } = useContext(MyContext);
  const [sesionIniciada, setSesionIniciada] = useState(false);
  const navigate = useNavigate();

  const obtenerDatosUsuario = async () => {
    const urlServidor = 'http://localhost:3000';
    const endpoint = '/usuarios';
    const token = localStorage.getItem('token');

    try {
      const { data } = await axios.get(urlServidor + endpoint, {
        headers: { Authorization: 'Bearer ' + token },
      });
      setUsuario(data);
      setSesionIniciada(true);
    } catch (error) {
      console.log(error.message);
    }
  };

  const cerrarSesion = async () => {
    try {
      localStorage.clear();
      alert('Has cerrado sesion');
      setSesionIniciada(false);
      navigate('/');
      window.location.reload(false)
    } catch (error) {
      console.log(error.message);
    }
  };

  const revisarInicioSesionCarro = () => {
    if (!localStorage.getItem('token')) {
      navigate('/login')
    } else {
      navigate(`/carrito/${usuario.id_usuario}`)
    }
  }

  useEffect(() => {
    obtenerDatosUsuario();
  }, []);

  return (
    <Navbar className='navbar' expand='lg'>
      <Container fluid>
        <Link className='text-light fs-1 text-bold text-decoration-none' to='/'>
          MarketPlace
        </Link>
        <Navbar.Toggle aria-controls='navbarScroll' className='bg-light'/>
        <Navbar.Collapse id='navbarScroll'>
          <Nav className='nav-container' navbarScroll>
            {!sesionIniciada && (
              <Link
                className='link-navbar fs-6 text-decoration-none'
                to='/registrar'
              >
                Crea tu cuenta
              </Link>
            )}

            {!sesionIniciada && (
              <Link
                className='link-navbar fs-6 text-decoration-none'
                to='/login'
              >
                Ingresa
              </Link>
            )}
            {sesionIniciada && (
              <Link
                className='link-navbar fs-6 text-decoration-none'
                to='/perfil'
              >
                Perfil
              </Link>
            )}
            {sesionIniciada && (
              <button className='btn-cerrar-session' onClick={cerrarSesion}>
                Cerrar Sesion
              </button>
            )}
            <a className='carro-navbar fs-5 text-decoration-none' onClick={revisarInicioSesionCarro}>🛒</a>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navbar2;
