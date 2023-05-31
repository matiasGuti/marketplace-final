const bcrypt = require('bcryptjs');
const pool = require('../database/clientConnect')


const obtenerUsuarios = async (email) => {
  const consulta = 'SELECT * FROM usuarios';
  const { rows: usuarios } = await pool.query(consulta);

  return usuarios;
};


const registrarUsuario = async (nombre, email, password) => {
  const consulta = 'INSERT INTO usuarios VALUES (DEFAULT, $1, $2, $3)';
  const passwordEncriptado = bcrypt.hashSync(password);
  const valores = [nombre, email, passwordEncriptado];
  await pool.query(consulta, valores);
};

const verificarCredenciales = async (email, password) => {
  const consulta = 'SELECT * FROM usuarios WHERE email = $1';
  const valor = [email];
  const { rows: [usuario], rowCount } = await pool.query(consulta, valor);

  const { password: passwordEncriptada } = usuario;
  const passwordEsCorrecta = bcrypt.compareSync(password, passwordEncriptada);

  if (!passwordEsCorrecta || !rowCount) {
    throw { code: 401, message: 'Email y/o contraseña incorrecta' };
  }
};

const obtenerUsuario = async (email) => {
  const consulta = 'SELECT * FROM usuarios WHERE email = $1';
  const valor = [email];
  const { rows: [usuario], rowCount } = await pool.query(consulta, valor);

  if (!rowCount) {
    throw { code: 401, message: 'Usuario no encontrado' };
  }

  delete usuario.password;
  return usuario;
};


module.exports = {
  registrarUsuario,
  verificarCredenciales,
  obtenerUsuario,
  obtenerUsuarios,
};
