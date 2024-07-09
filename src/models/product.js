'use strict';
const { Model, DataTypes, Sequelize } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
module.exports = (sequelize, DataTypes) => {
  class product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  product.init({
    product_id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
    product_name: DataTypes.STRING,
    description: DataTypes.STRING,
    images: DataTypes.JSON,
    quantity: DataTypes.INTEGER,
    sizes: DataTypes.JSON,
    price: DataTypes.FLOAT,
    rating: DataTypes.FLOAT,
    colours: DataTypes.JSON,
    category: DataTypes.STRING,
    product_status: DataTypes.STRING,
    created_by: DataTypes.STRING,
    updated_by: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'product',
    underscored:true,
    paranoid:true,
  });
  return product;
};