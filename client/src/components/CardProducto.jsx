import { useNavigate } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import MyContext from '../my-context';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import axios from 'axios';
import '../styles/CardProducto.css';

//Estilos
import '../styles/CardProducto.css';
import { Container } from 'react-bootstrap';

function CardProducto({ producto, paginaFav }) {
  const [esDueño, setEsDueño] = useState(false);
  const [esFavorito, setEsFavorito] = useState(false);
  const navigate = useNavigate();
  const { usuario } = useContext(MyContext);

  useEffect(() => {
    const revisarSiEsDueño = async () => {
      try {
        if (usuario.id_usuario == producto.id_usuario) setEsDueño(true);
      } catch (err) {
        //console.log('cargando productos...');
      }
    };

    const revisarSiProductoEnFavoritos = async () => {
      if(!localStorage.getItem('token') || !usuario) return

      const urlServidor = 'http://localhost:3000';
      const endpoint = `/favoritos_check?id_usuario=${usuario.id_usuario}&id_producto=${producto.id_producto}`;
    
      try {
        const { data: yaEnFavs } = await axios.get(urlServidor + endpoint)
        if(yaEnFavs) setEsFavorito(true)
      } catch(err) {
        console.log(err.message);
      }

    }

    revisarSiEsDueño();
    revisarSiProductoEnFavoritos();
  }, [usuario]);

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

  const agregarAFavoritos = async (producto) => {
    // Revisar si inicio sesion, sino se manda a iniciar sesion
    if (!localStorage.getItem('token')) {
      navigate('/login');
      return;
    }

    const urlServidor = 'http://localhost:3000';

    // Revisar si el producto ya esta agregado como favorito
    if (esFavorito) {
      try {
        const endpoint = `/favoritos/${producto.id_producto}`;

        const requestBody = {
          id_usuario: usuario.id_usuario,
        };
  
        try {
          await axios.delete(urlServidor + endpoint, { data: requestBody });
          setEsFavorito(false)
          if(paginaFav) window.location.reload(false)
        } catch (err) {
          console.log(err.message);
        }        
      } catch (err) {
        console.log(err.message);
      }
    } else {
      try {   
        const endpoint = '/favoritos';

        const requestBody = {
          id_usuario: usuario.id_usuario,
          id_producto: producto.id_producto
        }

        await axios.post(urlServidor + endpoint, requestBody)

        setEsFavorito(true)
      } catch (err) {
        console.log(err.message);
      }
    }
  };

  return (
    <Card
      className='card-container d-inline-flex p-5 m-3'
      key={producto.id_producto}
      style={{ width: '18rem' }}
    >
      <Card.Img className='card-img' variant='top' src={producto.imagen} />
      <Card.Body className='card-content-container'>
        <Card.Title>{producto.titulo}</Card.Title>
        <Card.Text>
          {producto.precio.toLocaleString('es-CL', {
            style: 'currency',
            currency: 'CLP',
          })}
        </Card.Text>
        <Container className='d-flex p-1 justify-content-around gap-3'>
          <Button
            variant='outline-success'
            onClick={() => navigate(`/producto/${producto.id_producto}`)}
          >
            Detalles
          </Button>
          {!esDueño && (
            <Button
              variant='outline-dark'
              onClick={() => agregarAlCarro(producto)}
            >
              Al Carro
            </Button>
          )}
          {!esDueño && <Button variant={esFavorito ? 'warning' : 'outline-warning'} onClick={() => agregarAFavoritos(producto)}>Favorito</Button>}
        </Container>
      </Card.Body>
    </Card>
  );
}

export default CardProducto;
