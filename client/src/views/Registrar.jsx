import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Container } from 'react-bootstrap';

// Estilos
import '../styles/Registrar.css'

function Registrar() {
  const [usuario, setUsuario] = useState('');
  const navigate = useNavigate();

  const handleSetUsuario = ({ target: { value, name } }) => {
    const field = {};
    field[name] = value;
    setUsuario({ ...usuario, ...field });
  };

  const registrarUsuario = async () => {
    const urlServidor = 'http://localhost:3000';
    const endpoint = '/usuarios';
    try {
      await axios.post(urlServidor + endpoint, usuario);
      navigate('/login');
      alert('Usuario registrado con exito');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Container className='container-registro'>
      <h2>Registrar</h2>
      <Form className='form-container'>
        <Form.Group className='input-container' controlId='formBasicName'>
          <Form.Label className='input-label'>Nombre</Form.Label>
          <Form.Control
            type='text'
            placeholder='Ingresa tu nombre'
            name='nombre'
            value={usuario.nombre}
            onChange={handleSetUsuario}
          />
        </Form.Group>

        <Form.Group className='input-container' controlId='formBasicEmail'>
          <Form.Label className='input-label'>Email</Form.Label>
          <Form.Control
            type='email'
            placeholder='Ingresa tu email'
            name='email'
            value={usuario.email}
            onChange={handleSetUsuario}
          />
        </Form.Group>

        <Form.Group className='input-container' controlId='formBasicPassword'>
          <Form.Label className='input-label'>Password</Form.Label>
          <Form.Control
            type='password'
            name='password'
            placeholder='Ingresa tu Password'
            value={usuario.password}
            onChange={handleSetUsuario}
          />
        </Form.Group>
        <Button className='btn-registro' onClick={registrarUsuario}>Crea tu cuenta</Button>
      </Form>
    </Container>
  );
}

export default Registrar;