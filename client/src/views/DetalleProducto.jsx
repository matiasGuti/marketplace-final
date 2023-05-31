import { useParams, useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import MyContext from '../my-context';
import axios from 'axios';

//Estilos
import '../styles/DetalleProducto.css';

function DetalleProducto() {
  const [productoActual, setProductoActual] = useState(null);
  const [esDueño, setEsDueño] = useState(false);
  const [loading, setLoading] = useState(true);
  const [esFavorito, setEsFavorito] = useState(false)
  const { id_producto } = useParams();
  const { usuario, market } = useContext(MyContext);
  const navigate = useNavigate();

  useEffect(() => {
    const filtrarProducto = () => {
      const prodAct = market.filter((prod) => prod.id_producto === id_producto);

      const dataFormateada = prodAct.map((item) => {
        return {
          ...item,
          precio: Number(item.precio),
        };
      });

      setProductoActual(dataFormateada[0]);
      setLoading(false);
    };

    filtrarProducto();
  }, []);

  useEffect(() => {
    const revisarSiEsDueño = async () => {
      try {
        if (usuario.id_usuario == productoActual.id_usuario) setEsDueño(true);
      } catch (err) {
        //console.log('cargando productos...');
      }
    };

    const revisarSiProductoEnFavoritos = async () => {
      if(!localStorage.getItem('token') || !usuario) return

      const urlServidor = 'http://localhost:3000';
      const endpoint = `/favoritos_check?id_usuario=${usuario.id_usuario}&id_producto=${id_producto}`;
    
      try {
        const { data: yaEnFavs } = await axios.get(urlServidor + endpoint)
        if(yaEnFavs) setEsFavorito(true)
      } catch(err) {
        //console.log(err.message);
      }
    }

    revisarSiEsDueño();
    revisarSiProductoEnFavoritos()
  }, [productoActual]);

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

  const eliminarProducto = async (producto) => {
    const urlServidor = 'http://localhost:3000';
    const endpoint = `/productos/${producto.id_producto}`;

    const requestBody = {
      id_usuario: usuario.id_usuario,
    };

    try {
      await axios.delete(urlServidor + endpoint, { data: requestBody });
      alert('Producto eliminado exitosamente');
      navigate('/');
      window.location.reload(false);
    } catch (err) {
      console.log(err.message);
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
    <>
      {loading && <p>Cargando...</p>}
      {productoActual && (
        <div className='producto-view-container vh-50'>
          <div className='producto-view-img-container'>
            <img src={productoActual.imagen} alt={productoActual.titulo} />
          </div>
          <div className='producto-view-detail-container'>
            <h1 className='producto-view-detail-title'>
              {productoActual.titulo.charAt(0).toUpperCase() +
                productoActual.titulo.slice(1)}
            </h1>
            <p className='producto-view-detail-description'>
              {productoActual.descripcion}
            </p>
            <p className='producto-view-price'>
              Precio: ${productoActual.precio.toLocaleString('es-CL')}
            </p>
            <div className='producto-view-detail-price-container'>
              {!esDueño && (
                <button className={ esFavorito ? 'fav-producto-detail-button' : 'fav-producto-detail-button no-fav'} onClick={() => agregarAFavoritos(productoActual)}>
                  A Favoritos
                </button>
              )}
              {!esDueño && (
                <button
                  className='cart-producto-detail-button'
                  onClick={() => agregarAlCarro(productoActual)}
                >
                  Añadir 🛒
                </button>
              )}
              {esDueño && (
                <button
                  className='delete-producto-detail-button'
                  onClick={() => eliminarProducto(productoActual)}
                >
                  Eliminar producto
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default DetalleProducto;
