require('dotenv').config();

const appConfig = require('./app-config');
const dbConfig = require('./db-config');
const tokensConfig = require('./tokens-config');
const paginateConfig = require('./paginate-config');

module.exports = {
  ...appConfig,
  ...tokensConfig,
  ...paginateConfig,
  // Third Party
  // Business Rules
  // Database
  DB: dbConfig,
};
