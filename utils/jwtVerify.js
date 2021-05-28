const jwt = require('jsonwebtoken');
const { secretKey } = require('../.config/jwt');

module.exports = (req, res, callback) => {
  const { authorization } = req.headers;

  jwt.verify(authorization, secretKey, (_, decoded) => {
    if (decoded) {
      try {
        callback(decoded);
        return;
      } catch (error) {
        res.status(500).json({ responseMessage: 'failure', responseData: null, error });
      }
    } else res.status(401).json({ responseMessage: 'jwt token verification is required.' });
  });
};
