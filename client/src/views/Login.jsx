import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Container } from 'react-bootstrap';
import MyContext from '../my-context';
import axios from 'axios';

// Estilos
import '../styles/Login.css';

function Login() {
  const { setUsuario } = useContext(MyContext);
  const navigate = useNavigate();
  const [usuario, setUsuarioLocal] = useState({});

  const handleSetUsuario = ({ target: { value, name } }) => {
    const field = {};
    field[name] = value;
    setUsuarioLocal({ ...usuario, ...field });
  };

  const iniciarSesion = async () => {
    const urlServidor = 'http://localhost:3000';
    const endpoint = '/login';
    const { email, password } = usuario;
    try {
      if (!email || !password)
        return alert('Porfavor ingresar email y password');
      const { data: token } = await axios.post(urlServidor + endpoint, usuario);
      alert('Sesion iniciada');
      localStorage.setItem('token', token);
      setUsuario();
      navigate('/');      
      window.location.reload(false)
    } catch (error) {
      if (error.message.includes('code 500')) {
        alert('Porfavor ingresar contraseñas validas');
      } else {
        alert(error.message);
        console.log(error.message);
      }
    }
  };

  return (
    <Container className='container-login'>
      <h2>Ingresar</h2>
      <Form className='form-container'>
        <Form.Group className='input-container' controlId='formBasicEmail'>
          <Form.Label className='input-label'>Email</Form.Label>
          <Form.Control
            type='email'
            name='email'
            value={usuario.email}
            placeholder='Ingresa tu email'
            onChange={handleSetUsuario}
          />
        </Form.Group>

        <Form.Group className='input-container' controlId='formBasicPassword'>
          <Form.Label className='input-label'>Password</Form.Label>
          <Form.Control
            type='password'
            name='password'
            value={usuario.password}
            placeholder='Ingresa tu Password'
            onChange={handleSetUsuario}
          />
        </Form.Group>
        <Button className='btn-login' onClick={iniciarSesion}>
          Ingresar
        </Button>
      </Form>
    </Container>
  );
}

export default Login;