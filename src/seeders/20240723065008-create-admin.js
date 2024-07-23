'use strict';

const { v4: uuidv4 } = require('uuid');
const { role } = require('../models/index');
const crypto = require('crypto');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const roleDetails = await role.findOne({
      where: {
          role_name: 'admin'
      }
    });
    return queryInterface.bulkInsert('users', [
      {
        full_name: 'Admin',
        user_id: uuidv4(),
        email: 'admin@gmail.com',
        password: crypto.createHash('md5').update('Admin@123').digest('hex'),
        user_status: 'active',
        role_id: roleDetails?.dataValues?.role_id,
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null
      }
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', null, {});
  },
};
