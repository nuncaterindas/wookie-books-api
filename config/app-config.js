const { version: VERSION } = require('../package.json');

const port = process.env.SERVER_PORT || 3005;

module.exports = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: port,
  VERSION: process.env.APPLICATION_VERSION || VERSION,
  SERVER_URL: process.env.APP_URL || `http://localhost:${port}`,
  NO_HEADERS_ROUTES: [],
  UNAUTHED_ROUTES: [
    // authentication routes
    '/api/signup',
    '/api/signin',
    '/api/books',
    /^\/api\/book\/\d+$/ ,
  ],
  pool: {
    max: 100,
    min: 1,
    idle: 10000
  },
};
