'use strict';
const { Model, DataTypes, Sequelize } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
module.exports = (sequelize, DataTypes) => {
  class cart extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      
    }
  }
  cart.init({
    user_id: DataTypes.UUID,
    product_details: DataTypes.ARRAY(DataTypes.JSON)
  }, {
    sequelize,
    modelName: 'cart',
    underscored:true,
  });
  return cart;
};