'use strict';
const { Model, DataTypes, Sequelize } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
module.exports = (sequelize, DataTypes) => {
  class role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      role.hasMany(models.user, {
        foreignKey: 'role_id',
        as: 'users'
      });
    }
  }
  role.init({
    role_id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
    role_name: DataTypes.STRING,
    actions_allowed: DataTypes.JSON
  }, {
    sequelize,
    modelName: 'role',
    underscored:true,
    paranoid:true,
  });
  return role;
};