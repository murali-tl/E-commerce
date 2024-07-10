'use strict';
const { Model, DataTypes, Sequelize } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
module.exports = (sequelize, DataTypes) => {
  class color extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  color.init({
    color_id: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true
    },
    color_name: DataTypes.STRING,
    color_code: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'color',
    //tableName: 'colors',
    underscored:true,
    paranoid:true,
  });
  return color;
};