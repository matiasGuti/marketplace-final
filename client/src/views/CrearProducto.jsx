import { useState, useEffect, useContext } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import MyContext from '../my-context';

//Estilos
import '../styles/CrearProducto.css';

const CrearProducto = () => {
  const [producto, setProducto] = useState('');
  const { usuario } = useContext(MyContext);
  const navigate = useNavigate();

  // Debe estar con sesion iniciada para entrar a esta view (por si tipea la url a mano)
  const usuarioSinIniciarSesion = () => {
    if (!localStorage.getItem('token')) {
      navigate('/error');
    }
  };

  useEffect(() => {
    usuarioSinIniciarSesion();
  }, []);

  const handleSetProducto = ({ target: { value, name } }) => {
    const field = {};
    field[name] = value;
    setProducto({ ...producto, ...field });
  };

  const subirProducto = async () => {
    const urlServidor = 'http://localhost:3000';
    const endpoint = '/productos';
    try {
      const productoAEnviar = { ...producto, id_usuario: usuario.id_usuario };
      await axios.post(urlServidor + endpoint, productoAEnviar);
      navigate('/');
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className='crear-producto-container'>
      <h2>Ingresar información sobre el producto</h2>
      <Form className='form-container-subir'>
        <Form.Group className='input-container' controlId='formBasicName'>
          <Form.Label className='input-label'>Titulo</Form.Label>
          <Form.Control
            type='text'
            placeholder='Titulo del producto...'
            name='titulo'
            value={producto.titulo}
            onChange={handleSetProducto}
          />
        </Form.Group>

        <Form.Group className='input-container' controlId='formBasicEmail'>
          <Form.Label className='input-label'>Descripcion</Form.Label>
          <Form.Control
            as='textarea'
            rows={4}
            placeholder='Descripcion del producto...'
            name='descripcion'
            value={producto.descripcion}
            onChange={handleSetProducto}
          />
        </Form.Group>

        <Form.Group className='input-container' controlId='formBasicPassword'>
          <Form.Label className='input-label'>Precio</Form.Label>
          <Form.Control
            type='number'
            name='precio'
            placeholder='Precio'
            value={producto.precio}
            onChange={handleSetProducto}
          />
        </Form.Group>

        <Form.Group className='input-container' controlId='formBasicPassword'>
          <Form.Label className='input-label'>Imagen</Form.Label>
          <Form.Control
            type='text'
            name='img'
            placeholder='URL de la imagen'
            value={producto.img}
            onChange={handleSetProducto}
          />
        </Form.Group>
        <Button className='btn-registro' onClick={subirProducto}>
          Subir Producto
        </Button>
      </Form>
    </div>
  );
};

export default CrearProducto;
