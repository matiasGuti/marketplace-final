import 'bootstrap/dist/css/bootstrap.min.css';
import MyContext from './my-context';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

//Views
import Carrito from './views/Carrito';
import Registrar from './views/Registrar';
import Login from './views/Login';
import NewHome from './views/NewHome';
import Perfil from './views/Perfil';
import Pagina404 from './views/Pagina404';
import Productos from './views/Productos';
import CrearProducto from './views/CrearProducto';
import DetalleProducto from './views/DetalleProducto';
import Favoritos from './views/Favoritos';

//Components
import Navbar2 from './components/Navbar2';

// Estilos
import './App.css';

function App() {
  const [market, setMarket] = useState([]);
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const datos = async () => {
      const urlServidor = 'http://localhost:3000';
      const endpoint = '/productos';
      try {
        const { data } = await axios.get(urlServidor + endpoint);
        setMarket(data);
      } catch (error) {
        console.log(error);
      }
    };

    datos();
  }, []);

  const globalState = { market, usuario, setUsuario };

  return (
    <>
      <MyContext.Provider value={globalState}>
        <BrowserRouter>
          <Navbar2 />
          <Routes>
            <Route path='/' element={<NewHome />} />
            <Route path='/registrar' element={<Registrar />} />
            <Route path='/login' element={<Login />} />
            <Route path='/carrito/:id_usuario' element={<Carrito />} />
            <Route path='/perfil' element={<Perfil />} />
            <Route path='/productos' element={<Productos />} />
            <Route path='/favoritos' element={<Favoritos />} />
            <Route path='/producto/:id_producto' element={<DetalleProducto />} />
            <Route path='/subir' element={<CrearProducto />} />
            <Route path='*' element={<Pagina404 />} />
          </Routes>
        </BrowserRouter>
      </MyContext.Provider>
    </>
  );
}

export default App;