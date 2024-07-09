'use strict';
const { Model, DataTypes, Sequelize } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
module.exports = (sequelize, DataTypes) => {
  class review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  review.init({
    role_id: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true
    },
    product_id: DataTypes.UUID,
    user_id: DataTypes.UUID,
    rating: DataTypes.FLOAT,
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    useful_count: DataTypes.INTEGER,
    not_useful_count: DataTypes.INTEGER,
    inappropriate_flag_count: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'review',
    underscored:true,
    paranoid:true,
  });
  return review;
};