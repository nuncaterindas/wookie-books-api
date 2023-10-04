const moment = require('moment');
require('moment-timezone');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('books', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      title: {
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.TEXT('long'),
      },
      cover_image: {
        type: Sequelize.STRING,
      },
      price: {
        type: Sequelize.FLOAT,
        defaultValue: 0.0,
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
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
      deleted_at: {
        type: Sequelize.DATE,
        defaultValue: null
      },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('books');
  },
};
