const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const { camelCase } = require('lodash');

const basename = path.basename(__filename);
const models = {};

module.exports = (sequelize) => {
  sequelize.beforeDefine((attributes, options) => {
    const defaultOpts = {
      underscored: true,
      timestamps: false,
      paranoid: false,
    };
    Object.assign(options, { ...defaultOpts, ...options });
  });

  // Get all models in this directory and attach them to the sequelize object
  // and then associate them to eachother
  fs.readdirSync(__dirname)
    .filter(
      (file) => file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js',
    )
    .forEach((file) => {
      // eslint-disable-next-line
      const model = require(path.join(__dirname, file))(sequelize, Sequelize);
      const camelCased = camelCase(model.name);
      const upperFirstLetter = camelCased.charAt(0).toUpperCase();
      const modelName = upperFirstLetter + camelCased.slice(1);
      models[modelName] = model;
    });

  Object.keys(models).forEach((modelName) => {
    if (models[modelName].associate) {
      models[modelName].associate(models);
    }
  });

  return models;
};
