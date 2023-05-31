const pool = require('../database/clientConnect');

const obtenerFavoritosUsuario = async (id_usuario) => {
  const consulta =
    'SELECT a.id_favorito, b.* \
   FROM favoritos as a \
   LEFT JOIN productos as b on a.id_producto = b.id_producto \
   WHERE a.id_usuario = $1';

  const valor = [id_usuario];
  const { rows } = await pool.query(consulta, valor);

  return rows;
};

const revisarSiProductoYaAgregado = async ({ id_usuario, id_producto }) => {
  const consulta =
    'SELECT * FROM favoritos WHERE id_usuario = $1 AND id_producto = $2';
  const valores = [id_usuario, id_producto];

  try {
    const { rows } = await pool.query(consulta, valores);
    if (rows.length === 0) return false;
    return true;
  } catch (error) {
    console.log(error.message);
  }
};

const agregarAFavorito = async (id_usuario, id_producto) => {
  const consulta = 'INSERT INTO favoritos VALUES (DEFAULT, $1, $2)';
  const valores = [id_usuario, id_producto];
  const result = await pool.query(consulta, valores);
  console.log('Producto agregado a favoritos');
};

const eliminarFavorito = async (id_usuario, id_producto) => {
  const consulta =
    'DELETE FROM favoritos WHERE id_usuario = $1 AND id_producto = $2';
  const valor = [id_usuario, id_producto];
  const result = await pool.query(consulta, valor);
  console.log('Producto eliminado de favoritos con exito');
};

module.exports = {
  obtenerFavoritosUsuario,
  revisarSiProductoYaAgregado,
  agregarAFavorito,
  eliminarFavorito,
};
