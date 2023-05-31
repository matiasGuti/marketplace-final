const {
  obtenerProductos,
  agregarProducto,
  eliminarProducto,
} = require('./consultas/consultasProducto');
const {
  registrarUsuario,
  verificarCredenciales,
  obtenerUsuario,
  obtenerUsuarios,
} = require('./consultas/consultasUsuario');
const {
  obtenerCarroUsuario,
  agregarProductoAlCarro,
  eliminarProductoDelCarro,
  sumarCantidadProducto,
  restarCantidadProducto,
  checkProductoAgregado,
} = require('./consultas/consultasCarro');
const { obtenerFavoritosUsuario, revisarSiProductoYaAgregado, agregarAFavorito, eliminarFavorito } = require('./consultas/consultasFavoritos')
const { validarToken } = require('./middlewares/middlewares');
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();

app.listen(3000, console.log('SERVIDOR ENCENDIDO'));

app.use(express.json());
app.use(cors());

// --------------------------- RUTAS ---------------------------
//--------------- Rutas usuarios
app.post('/usuarios', async (req, res) => {
  try {
    const { nombre, email, password } = req.body;
    await registrarUsuario(nombre, email, password);
    res.send('Usuario creado con éxito!');
  } catch (error) {
    res.status(error.code || 500).send(error);
  }
});

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email, password);
    await verificarCredenciales(email, password);
    const token = jwt.sign({ email }, 'az_AZ');
    res.send(token);
  } catch (error) {
    console.log('me cai');
    console.log(error.message);
    res.status(error.code || 500).send(error);
  }
});

app.get('/usuarios', validarToken, async (req, res) => {
  try {
    const { email } = req.user;
    const usuario = await obtenerUsuario(email);
    res.send(usuario);
  } catch (error) {
    res.status(error.code || 500).send(error);
  }
});

//TODOS LOS USUARIOS
app.get('/usu', async (req, res) => {
  try {
    const usuarios = await obtenerUsuarios();
    res.send(usuarios);
  } catch (error) {
    res.status(error.code || 500).send(error);
  }
});

//--------------- Rutas producto
app.get('/productos', async (req, res) => {
  try {
    const productos = await obtenerProductos();
    res.json(productos);
  } catch (error) {
    res.status(error.code || 500).send(error);
  }
});

app.post('/productos', async (req, res) => {
  try {
    //ojo con este, revisar si en vez del id_usuario pasar el email y con el email despues buscar el id?
    const { titulo, descripcion, precio, img, id_usuario } = req.body;
    await agregarProducto(titulo, descripcion, precio, img, id_usuario);
    res.send('Producto agregado con exito');
  } catch (error) {
    res.status(error.code || 500).send(error);
  }
});

app.delete('/productos/:id_producto', async (req, res) => {
  try {
    const { id_producto } = req.params;
    const { id_usuario } = req.body;
    await eliminarProducto(id_producto, id_usuario);
    res.send('Producto eliminado con exito');
  } catch (err) {
    res.status(error.code || 500).send(err);
  }
});

//--------------- Rutas carro
app.get('/carro/:id_usuario', async (req, res) => {
  try {
    const { id_usuario } = req.params;
    const carro = await obtenerCarroUsuario(id_usuario);
    res.json(carro);
  } catch (error) {
    res.status(error.code || 500).send(error);
  }
});

app.post('/carro', async (req, res) => {
  try {
    const { id_usuario, precio, id_producto } = req.body;
    await agregarProductoAlCarro(id_usuario, precio, id_producto);
    res.send('Producto agregado al carro con exito');
  } catch (error) {
    res.status(error.code || 500).send(error);
  }
});

app.get('/check_carro', async (req, res) => {
  try {
    const queryStrings = req.query;
    const resultado = await checkProductoAgregado(queryStrings);
    res.send(resultado);
  } catch (error) {
    res.status(error.code || 500).send(error);
  }
});

//Sumar uno a la cantidad
app.post('/sumar_uno', async (req, res) => {
  try {
    const { id_usuario, precio, id_producto } = req.body;
    await sumarCantidadProducto(precio, id_usuario, id_producto);
    res.send('Cantidad aumentada con exito');
  } catch (err) {
    res.status(err.code || 500).send(err);
  }
});

//Restar uno a la cantidad
app.post('/restar_uno', async (req, res) => {
  try {
    const { id_usuario, precio, id_producto } = req.body;
    await restarCantidadProducto(precio, id_usuario, id_producto);
    res.send('Cantidad restada con exito');
  } catch (err) {
    res.status(err.code || 500).send(err);
  }
});

//Borrar producto del carro
app.delete('/carro/:id_producto', async (req, res) => {
  try {
    const { id_producto } = req.params;
    const { id_usuario } = req.body;
    await eliminarProductoDelCarro(id_usuario, id_producto);
    res.send('Producto eliminado del carro con exito');
  } catch (err) {
    res.status(error.code || 500).send(err);
  }
});

//--------------- Rutas Favoritos
app.get('/favoritos/:id_usuario', async (req, res) => {
  try {
    const { id_usuario } = req.params;
    const favoritos = await obtenerFavoritosUsuario(id_usuario)
    res.json(favoritos)
  } catch (err) {
    res.status(err.code || 500).send(err);
  }
})

app.get('/favoritos_check', async (req, res) => {
  try {
    const queryStrings = req.query;
    const resultado = await revisarSiProductoYaAgregado(queryStrings)
    res.send(resultado)
  } catch (err) {
    res.status(err.code || 500).send(err);
  }
})

app.post('/favoritos', async (req, res) => {
  try {
    const { id_usuario, id_producto } = req.body;
    await agregarAFavorito(id_usuario, id_producto)
    res.send('Producto agregado a favoritos exitosamente')
  } catch (err) {
    res.status(err.code || 500).send(err);
  }
});

app.delete('/favoritos/:id_producto', async (req, res) => {
  try {
    const { id_producto } = req.params;
    const { id_usuario } = req.body;
    await eliminarFavorito(id_usuario, id_producto);
    res.send('Producto eliminado de favoritos');
  } catch (err) {
    res.status(error.code || 500).send(err);
  }
});