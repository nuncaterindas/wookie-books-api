const AuthenticationSchemas = require('./authentication-schemas');
const bookSchemas =  require('./book-schemas');

module.exports = {
  ...AuthenticationSchemas,
  ...bookSchemas
};
