const DATABASE_URL =
  'postgresql://daniel:AX3lpr3OkXp3ZpUuWiwbEA@mrkt-latam-10806.7tt.cockroachlabs.cloud:26257/marketplace?sslmode=verify-full';
  

const { Client } = require('pg');

const client = new Client(DATABASE_URL);

// Creacion de tablas
const crearTablaUsuarios = async () => {
  await client.connect();
  try {
    const consulta =
      'CREATE TABLE usuarios (id_usuario serial primary key, nombre varchar(255) not null, email varchar(255) not null, password varchar(255) not null)';
    const results = await client.query(consulta);
    console.log(results);
  } catch (err) {
    console.error('Error en ejecutar la query:', err);
  } finally {
    client.end();
  }
};

const crearTablaProductos = async () => {
  await client.connect();
  try {
    const consulta =
      'create table productos (id_producto serial primary key, titulo varchar(255), descripcion varchar(255), precio int, imagen varchar, favoritos int, id_usuario int references usuarios(id_usuario))';
    const results = await client.query(consulta);
    console.log(results);
  } catch (err) {
    console.error('Error en ejecutar la query:', err);
  } finally {
    client.end();
  }
};

const crearTablaCarro = async () => {
  await client.connect();
  try {
    const consulta =
      'create table carro (id_carro serial primary key, cantidad_total int, precio_total int, id_producto int references productos(id_producto), id_usuario int references usuarios(id_usuario))';
    const results = await client.query(consulta);
    console.log(results);
  } catch (err) {
    console.error('Error en ejecutar la query:', err);
  } finally {
    client.end();
  }
};

const crearTablaFavoritos = async () => {
  await client.connect();
  try {
    const consulta =
      'create table favoritos (id_favorito serial primary key, id_usuario int references usuarios(id_usuario), id_producto int references productos(id_producto))';
    const results = await client.query(consulta);
    console.log(results);
  } catch (err) {
    console.error('Error en ejecutar la query:', err);
  } finally {
    client.end();
  }
};

// Botar tablas en caso de ser necesario
const eliminarTablaUsuarios = async () => {
  await client.connect();
  try {
    const consulta = 'DROP TABLE usuarios';
    const results = await client.query(consulta);
    console.log(results);
  } catch (err) {
    console.error('Error en ejecutar la query:', err);
  } finally {
    client.end();
  }
};

const eliminarTablaProducto = async () => {
  await client.connect();
  try {
    const consulta = 'DROP TABLE productos';
    const results = await client.query(consulta);
    console.log(results);
  } catch (err) {
    console.error('Error en ejecutar la query:', err);
  } finally {
    client.end();
  }
};

const eliminarTablaCarro = async () => {
  await client.connect();
  try {
    const consulta = 'DROP TABLE carro';
    const results = await client.query(consulta);
    console.log(results);
  } catch (err) {
    console.error('Error en ejecutar la query:', err);
  } finally {
    client.end();
  }
};

const eliminarTablaFavoritos = async () => {
  await client.connect();
  try {
    const consulta = 'DROP TABLE favoritos';
    const results = await client.query(consulta);
    console.log(results);
  } catch (err) {
    console.error('Error en ejecutar la query:', err);
  } finally {
    client.end();
  }
};

// crearTablaUsuarios();
// crearTablaProductos();
 crearTablaCarro();
//crearTablaFavoritos();

//En caso de botar
// eliminarTablaUsuarios();
// eliminarTablaProducto();
//eliminarTablaCarro();
// eliminarTablaFavoritos();


