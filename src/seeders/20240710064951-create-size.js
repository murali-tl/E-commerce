'use strict';
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('sizes', [
      {
        size_id: uuidv4(),
        size_type: 'XS',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        size_id: uuidv4(),
        size_type: 'S',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        size_id: uuidv4(),
        size_type: 'M',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        size_id: uuidv4(),
        size_type: 'L',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        size_id: uuidv4(),
        size_type: 'XL',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        size_id: uuidv4(),
        size_type: 'XXL',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        size_id: uuidv4(),
        size_type: '3Xl',
        created_at: new Date(),
        updated_at: new Date(),
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('sizes', null, {});
  }
};
