import NewCard from '../components/NewCard';
import MyContext from '../my-context';
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';

const Favoritos = () => {
  const [favs, setFavs] = useState();
  const { usuario } = useContext(MyContext);

  useEffect(() => {
    // Debe estar con sesion iniciada para entrar a esta view (por si tipea la url a mano)
    const usuarioSinIniciarSesion = () => {
      if (!localStorage.getItem('token')) {
        navigate('/error');
      }
    };

    usuarioSinIniciarSesion();
  }, []);

  useEffect(() => {
    const getFavoritos = async () => {
      try {
        const urlServidor = 'http://localhost:3000';
        const endpoint = `/favoritos/${usuario.id_usuario}`;
        const { data } = await axios.get(urlServidor + endpoint);
        setFavs(data);
      } catch (err) {
        //console.log(err.message);
      }
    };

    getFavoritos();
  }, [usuario]);

  return (
    <>
      <div className='cards-container'>
        {favs && <NewCard market={favs} paginaFav={true} />}
      </div>
    </>
  );
};

export default Favoritos;
