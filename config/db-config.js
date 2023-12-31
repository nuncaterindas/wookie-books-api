require('dotenv').config();

module.exports = {
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'wookie_book_db',
  host: process.env.DB_HOST || '127.0.0.1',
  dialect: 'mysql',
};
