'use strict';
const { Model, DataTypes, Sequelize } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
module.exports = (sequelize, DataTypes) => {
  class payment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  payment.init({
    payment_id: {
        type: DataTypes.STRING,
        primaryKey: true
      },
    payment_status: DataTypes.STRING,
    user_id: DataTypes.UUID,
    amount: DataTypes.FLOAT,
    order_id: DataTypes.STRING,
    contact: DataTypes.STRING,
    email: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'payment',
    underscored:true,
    paranoid:true,
  });
  return payment;
};