import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import MyContext from '../my-context';
import Card from 'react-bootstrap/Card';
import axios from 'axios';
import Button from 'react-bootstrap/Button';

import '../styles/CardUno.css';
import { Container } from 'react-bootstrap';


function CardUno({ market }) {
  const navigate = useNavigate();
  const { usuario } = useContext(MyContext);

  const agregarAlCarro = async (producto) => {
    // Revisar si inicio sesion, sino se manda a iniciar sesion
    if (!localStorage.getItem('token')) {
      navigate('/login');
      return;
    }

    const urlServidor = 'http://localhost:3000';
    const endpoint = '/carro';

    // Revisar si el usuario ya tiene el producto en su carro
    try {
      const endpointMasQuery = `/check_carro?id_usuario=${usuario.id_usuario}&id_producto=${producto.id_producto}`;
      var { data: productoExiste } = await axios.get(
        urlServidor + endpointMasQuery
      );
    } catch (error) {
      console.log(error.message);
    }

    const informacionProducto = {
      id_usuario: usuario.id_usuario,
      precio: producto.precio,
      id_producto: producto.id_producto,
    };

    // Reviso primero si el producto ya esta agregado al carro, en ese caso sumo uno a la cantidad
    if (productoExiste) {
      const endpointSumar = '/sumar_uno';

      await axios.post(urlServidor + endpointSumar, informacionProducto);
      alert('Producto agregado al carro');
    } else {
      // En caso contrario agrego el producto al carro
      try {
        await axios.post(urlServidor + endpoint, informacionProducto);
        alert('Producto agregado al carro');
      } catch (error) {
        console.log(error.message);
      }
    }
  };

  return (


    market &&
    market.map((producto) => (
      <Card key={producto.id_producto} className='d-inline-flex p-5 justify-content-around flex-wrap'>
        <Card.Img variant='top' src={producto.imagen}/>
        <Card.Body>
          <Card.Title>{producto.titulo}</Card.Title>
          <Card.Text>{producto.precio}</Card.Text>
          <Button
            variant="outline-success"
            onClick={() => navigate(`/producto/${producto.id_producto}`)}>
            Detalles
          </Button>
          <Button variant="outline-success" onClick={() => agregarAlCarro(producto)}>
            Al Carro
          </Button>
          <Button variant="outline-success">Favorito</Button>
        </Card.Body>
      </Card>
    ))


  );
}

export default CardUno;
