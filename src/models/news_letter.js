'use strict';
const { Model, DataTypes, Sequelize } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
module.exports = (sequelize, DataTypes) => {
  class news_letter extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  news_letter.init({
    email: DataTypes.STRING,
    subscribed: DataTypes.BOOLEAN,
    user_id: DataTypes.UUID
  }, {
    sequelize,
    modelName: 'news_letter',
    underscored:true,
    paranoid:true,
  });
  return news_letter;
};