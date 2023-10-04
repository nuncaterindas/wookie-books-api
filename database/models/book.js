/* eslint-disable func-names */
const bcrypt = require('bcryptjs');
const moment = require('moment');
require('moment-timezone');

module.exports = (sequelize, DataTypes) => {
  const Book = sequelize.define('book', {
    title: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.TEXT('long'),
    },
    cover_image: {
      type: DataTypes.STRING,
    },
    price: {
      type: DataTypes.FLOAT,
      defaultValue: 0.0,
    },
    created_at: {
      type: DataTypes.DATE,
    },
    updated_at: {
      type: DataTypes.DATE,
    },
    deleted_at: {
      type: DataTypes.DATE,
    },
  }, {
    paranoid: true,
    timestamps: true,
    deletedAt: 'deleted_at',
    hooks: {
      /* eslint-disable no-param-reassign */
      beforeCreate: (user) => {
        user.created_at = moment().tz('Asia/Manila').format('YYYY-MM-DD HH:mm:ss');
        user.updated_at = moment().tz('Asia/Manila').format('YYYY-MM-DD HH:mm:ss');
      },
      beforeUpdate: (user) => {
        user.updated_at = moment().tz('Asia/Manila').format('YYYY-MM-DD HH:mm:ss');
      },
      /* eslint-enable no-param-reassign */
    },
  });



  Book.associate = function (models) {
    Book.hasMany(models.RefreshToken),
    Book.belongsTo(models.User, { foreignKey: 'user_id' })
  };

  return Book;
};
