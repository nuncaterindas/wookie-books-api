const {unless} = require('express-unless');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');
const { AUTHORIZATION_ERROR } = require('../enums/error-codes');

const authMiddleware = async (req, res, next) => {
  const { token } = req;

  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      
      if (err || decoded.type !== 'access_token') {
        return res.status(403).send({
          code: AUTHORIZATION_ERROR,
          error: 'Bearer token is either invalid or has expired',
        });
      }
      req.user = {
        id: decoded.id,
        as: decoded.as,
        status:decoded.status,
        authorPseudonym: decoded.authorPseudonym
      };
      
      console.log(req.user,888)
      next();
    });
  } else {
    // if there is no token
    // return an error
    return res.status(401).send({
      code: AUTHORIZATION_ERROR,
      error: 'No access token provided',
    });
  }
};

authMiddleware.unless = unless;

module.exports = authMiddleware;
