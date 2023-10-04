const Sequelize = require('sequelize');
const { DB } = require('../config');
const modelGenerator = require('./models');

const sequelize = new Sequelize(DB);

module.exports = {
  sequelize,
  models: modelGenerator(sequelize),
};
