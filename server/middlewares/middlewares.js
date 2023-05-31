const jwt = require('jsonwebtoken');

const validarToken = (req, res, next) => {
  const token = req.header('Authorization').split('Bearer ')[1];

  try {
    jwt.verify(token, 'az_AZ');
    req.user = jwt.decode(token);
    next();
  } catch (error) {
    res.status(error.code || 500).send(error);
  }
};

module.exports = { validarToken }