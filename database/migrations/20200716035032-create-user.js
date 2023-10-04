const moment = require('moment');
require('moment-timezone');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      username: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      author_pseudonym: {
        type: Sequelize.STRING,
      },
      status: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: moment().tz('Asia/Manila').format('YYYY-MM-DD HH:mm:ss'),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: moment().tz('Asia/Manila').format('YYYY-MM-DD HH:mm:ss'),
      },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('users');
  },
};
