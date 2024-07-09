'use strict';
const { Model, DataTypes, Sequelize } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      user.belongsTo(models.role, {
        foreignKey: 'role_id',
        as: 'role'
      });
      user.hasMany(models.user_addresses, {
        foreignKey: 'user_id', // Foreign key in Address model
        as: 'addresses' // Alias to access associated addresses
      });
    }
  }
  user.init({
    full_name: DataTypes.STRING,
    user_id: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          msg: "Must be a valid email address",
        }
      }
    },
    password: DataTypes.STRING,
    user_status: DataTypes.STRING,
    role_id: DataTypes.UUID
  
  }, {
    sequelize,
    modelName: 'user',
    underscored:true,
    paranoid:true,
  });
  return user;
};