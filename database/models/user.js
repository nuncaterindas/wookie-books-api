/* eslint-disable func-names */
const bcrypt = require('bcryptjs');
const moment = require('moment');
require('moment-timezone');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    username: {
      type: DataTypes.STRING,
      unique: true,
    },
    password: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    author_pseudonym: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    created_at: {
      type: DataTypes.DATE,
    },
    updated_at: {
      type: DataTypes.DATE,
    },
  }, {
    scopes: {
      withoutPassword: {
        attributes: { exclude: ['password'] },
      },
    },
    hooks: {
      /* eslint-disable no-param-reassign */
      beforeBulkCreate: (users) => {
        users.forEach((user) => {
          if (user) {
            user.created_at = moment().tz('Asia/Manila').format('YYYY-MM-DD HH:mm:ss');
            user.updated_at = moment().tz('Asia/Manila').format('YYYY-MM-DD HH:mm:ss');
          }
        });
      },
      beforeBulkUpdate: (users) => {
        users.forEach((user) => {
          if (user) {
            user.updated_at = moment().tz('Asia/Manila').format('YYYY-MM-DD HH:mm:ss');
          }
        });
      },
      /* eslint-disable no-param-reassign */
      beforeCreate: (user) => {
        user.created_at = moment().tz('Asia/Manila').format('YYYY-MM-DD HH:mm:ss');
        user.updated_at = moment().tz('Asia/Manila').format('YYYY-MM-DD HH:mm:ss');
        user.password = bcrypt.hashSync(user.password);
      },
      beforeUpdate: (user) => {
        user.updated_at = moment().tz('Asia/Manila').format('YYYY-MM-DD HH:mm:ss');
      },
      /* eslint-enable no-param-reassign */
    },
  });

  User.prototype.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
  };

  User.prototype.setPassword = function (password) {
    this.password = bcrypt.hashSync(password);
  };


  User.associate = function (models) {
    User.hasMany(models.RefreshToken);
    User.hasMany(models.Book);
  };

  return User;
};
