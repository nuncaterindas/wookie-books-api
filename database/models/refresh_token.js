/* eslint-disable func-names */
const moment = require('moment');
require('moment-timezone');

module.exports = (sequelize, DataTypes) => {
  const RefreshToken = sequelize.define('refresh_token', {
    token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    is_valid: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    expires_at: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    refresh_count: {
      defaultValue: 0,
      type: DataTypes.INTEGER,
    },
    created_at: {
      type: DataTypes.STRING,
    },
    updated_at: {
      type: DataTypes.STRING,
    },
  }, {
    /* eslint-disable no-param-reassign */
    hooks: {
      beforeCreate: (refreshToken) => {
        refreshToken.created_at = moment().tz('Asia/Manila').format('YYYY-MM-DD HH:mm:ss');
        refreshToken.updated_at = moment().tz('Asia/Manila').format('YYYY-MM-DD HH:mm:ss');
      },
      beforeUpdate: (refreshToken) => {
        refreshToken.updated_at = moment().tz('Asia/Manila').format('YYYY-MM-DD HH:mm:ss');
      },
    },
    /* eslint-enable no-param-reassign */
  });

  RefreshToken.associate = function (models) {
    RefreshToken.belongsTo(models.User, { foreignKey: 'user_id' });
  };

  return RefreshToken;
};
