import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

// Estilos
import '../styles/Carrito.css';

function Carrito() {
  const [loading, setLoading] = useState(true);
  const [precioTotalCarro, setPrecioTotalCarro] = useState(0);
  const [noImplementado, setNoImplementado] = useState(false);
  const [carro, setCarro] = useState();
  const { id_usuario } = useParams();

  // Obtener carro del usuario
  const obtenerCarroUsuario = async () => {
    const urlServidor = 'http://localhost:3000';
    const endpoint = `/carro/${id_usuario}`;

    try {
      const { data } = await axios.get(urlServidor + endpoint);
      const dataFormateado = data.map((item) => {
        return {
          ...item,
          precio_total: Number(item.precio_total),
          precio_unitario: Number(item.precio_unitario),
          cantidad_total: Number(item.cantidad_total),
        };
      });

      // Calcular Total del carro
      const sum = dataFormateado.reduce((accumulator, obj) => {
        return accumulator + obj.precio_total;
      }, 0);

      setPrecioTotalCarro(sum);
      setCarro(dataFormateado);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // Debe estar con sesion iniciada para entrar a esta view (por si tipea la url a mano)
    const usuarioSinIniciarSesion = () => {
      if (!localStorage.getItem('token')) {
        navigate('/error');
      }
    };

    usuarioSinIniciarSesion();
    obtenerCarroUsuario();
  }, []);

  const sumarUnoAlProducto = async (producto) => {
    const urlServidor = 'http://localhost:3000';
    const endpointSumar = '/sumar_uno';

    try {
      axios.post(urlServidor + endpointSumar, {
        id_usuario: id_usuario,
        precio: producto.precio_unitario,
        id_producto: producto.id_producto,
      });

      await setPrecioTotalCarro(precioTotalCarro + producto.precio_unitario);
      obtenerCarroUsuario();
    } catch (err) {
      console.log(err.message);
    }
  };

  const restarUnoAlProducto = async (producto) => {
    const urlServidor = 'http://localhost:3000';

    //Revisar si es el ultimo producto en el carro
    if (producto.cantidad_total === 1) {
      const endpoint = `/carro/${producto.id_producto}`;

      const requestBody = {
        id_usuario: id_usuario,
      };

      try {
        await axios.delete(urlServidor + endpoint, { data: requestBody });
        await setPrecioTotalCarro(precioTotalCarro - producto.precio_unitario);
        obtenerCarroUsuario();
      } catch (err) {
        console.log(err.message);
      }
    } else {
      //En caso de que no sea el ultimo producto resta uno a la cantidad
      const endpoint = '/restar_uno';

      const requestBody = {
        id_usuario: id_usuario,
        precio: producto.precio_unitario,
        id_producto: producto.id_producto,
      };

      try {
        await axios.post(urlServidor + endpoint, requestBody);
        await setPrecioTotalCarro(precioTotalCarro - producto.precio_unitario);
        obtenerCarroUsuario();
      } catch (err) {
        console.log(err.message);
      }
    }
  };

  return (
    <div className='cart-items-container'>
      <h2>Detalles del pedido</h2>
      {loading && <p>Cargando carro...</p>}
      {!loading && (
        <div className='cart-items mb-5'>
          {carro.map((producto) => (
            <div className='item flex-wrap' key={producto.id_producto}>
              <div className='item-detail'>
                <img src={producto.imagen} alt={producto.titulo} />
                <p>
                  {producto.titulo.charAt(0).toUpperCase() +
                    producto.titulo.slice(1)}
                </p>
              </div>
              <div className='item-price-detail'>
                <span className='item-price'>
                  {producto.precio_total.toLocaleString('es-CL', {
                    style: 'currency',
                    currency: 'CLP',
                  })}
                </span>
                <button
                  className='item-decrease-btn'
                  onClick={() => restarUnoAlProducto(producto)}
                >
                  -
                </button>
                <span className='item-quantity'>{producto.cantidad_total}</span>
                <button
                  className='item-increase-btn'
                  onClick={() => sumarUnoAlProducto(producto)}
                >
                  +
                </button>
              </div>
            </div>
          ))}
          <p className='total-price'>
            Total: $ {precioTotalCarro.toLocaleString('es-CL')}
          </p>
          {carro && (
            <button
              className='pay-btn'
              onClick={() => setNoImplementado(!noImplementado)}
            >
              Ir a Pagar
            </button>
          )}
          {noImplementado && <span> Gracias por comprar!</span>}
        </div>
      )}
    </div>
  );
}

export default Carrito;