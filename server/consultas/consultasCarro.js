const pool = require('../database/clientConnect');
const format = require('pg-format');

const obtenerCarroUsuario = async (id_usuario) => {
  const consulta =
    'SELECT a.id_producto, a.cantidad_total, a.precio_total, b.imagen, b.titulo, b.precio as precio_unitario FROM carro as a LEFT JOIN productos as b on a.id_producto = b.id_producto WHERE a.id_usuario = $1';
  const valor = [id_usuario];
  const { rows: carro } = await pool.query(consulta, valor);

  return carro;
};

const agregarProductoAlCarro = async (id_usuario, precio, id_producto) => {
  const consulta = 'INSERT INTO carro VALUES (DEFAULT, 1, $1, $2, $3)';
  const valores = [precio, id_producto, id_usuario];
  const result = await pool.query(consulta, valores);
  console.log('Producto agregado al carro con exito');
};

const checkProductoAgregado = async ({ id_usuario, id_producto }) => {
  let filtros = [];

  //Revisar si los parametros no son nulos, en caso de que sea asi, crea el string formateado para cada parametro no nulo
  if (id_usuario) filtros.push(format('id_usuario = %s', id_usuario));
  if (id_producto) filtros.push(format('id_producto = %s', id_producto));

  //Crear consulta final con todos los filtros no nulos
  let consulta = 'SELECT * FROM carro';
  if (filtros.length > 0) {
    filtros = filtros.join(' AND ');
    consulta += format(' WHERE %s', filtros);
  }

  try {
    const { rows } = await pool.query(consulta);
    if (rows.length === 0) return false;
    return true;
  } catch (error) {
    console.log(error.message);
  }
};

const eliminarProductoDelCarro = async (id_usuario, id_producto) => {
  const consulta =
    'DELETE FROM carro WHERE id_usuario = $1 AND id_producto = $2';
  const valor = [id_usuario, id_producto];
  const result = await pool.query(consulta, valor);
  console.log('Producto eliminado del carro con exito');
};

const sumarCantidadProducto = async (precio, id_usuario, id_producto) => {
  const consulta =
    'UPDATE carro SET cantidad_total = cantidad_total + 1, precio_total= precio_total + $1  WHERE id_usuario = $2 AND id_producto = $3';
  const valores = [precio, id_usuario, id_producto];
  const result = await pool.query(consulta, valores);
  console.log('Cantidad sumada con exito');
};

const restarCantidadProducto = async (precio, id_usuario, id_producto) => {
  const consulta =
    'UPDATE carro SET cantidad_total = cantidad_total - 1, precio_total= precio_total - $1  WHERE id_usuario = $2 AND id_producto = $3';
  const valores = [precio, id_usuario, id_producto];
  const result = await pool.query(consulta, valores);
  console.log('Cantidad restada con exito');
};

module.exports = {
  obtenerCarroUsuario,
  agregarProductoAlCarro,
  eliminarProductoDelCarro,
  sumarCantidadProducto,
  restarCantidadProducto,
  checkProductoAgregado,
};
