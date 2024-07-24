'use strict';
const { Model, DataTypes, Sequelize } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
module.exports = (sequelize, DataTypes) => {
  class wishlist extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  wishlist.init({
    user_id: DataTypes.UUID,
    product_ids: DataTypes.ARRAY(DataTypes.UUID)
  }, {
    sequelize,
    modelName: 'wishlist',
    underscored:true,
    paranoid:true,
  });
  return wishlist;
};