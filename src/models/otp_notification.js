'use strict';
const { Model, DataTypes, Sequelize } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
module.exports = (sequelize, DataTypes) => {
  class otp_notification extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  otp_notification.init({
    email: DataTypes.STRING,
    otp_hash: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'otp_notification',
    underscored:true,
    paranoid:true,
  });
  return otp_notification;
};