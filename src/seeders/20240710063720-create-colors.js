'use strict';
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('colors', [
      {
        color_id: uuidv4(),
        color_name: 'Red',
        color_code: '#FF0000',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        color_id: uuidv4(),
        color_name: 'Pink',
        color_code: '#FFC0CB',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        color_id: uuidv4(),
        color_name: 'Orange',
        color_code: '#FFA500',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        color_id: uuidv4(),
        color_name: 'Yellow',
        color_code: '#FFFF00',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        color_id: uuidv4(),
        color_name: 'Purple',
        color_code: '#800080',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        color_id: uuidv4(),
        color_name: 'Violet',
        color_code: '#EE82EE',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        color_id: uuidv4(),
        color_name: 'Green',
        color_code: '#008000',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        color_id: uuidv4(),
        color_name: 'Blue',
        color_code: '#0000FF',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        color_id: uuidv4(),
        color_name: 'Brown',
        color_code: '#A52A2A',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        color_id: uuidv4(),
        color_name: 'White',
        color_code: '#FFFFFF',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        color_id: uuidv4(),
        color_name: 'Gray',
        color_code: '#808080',
        created_at: new Date(),
        updated_at: new Date(),
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('colors', null, {});
  }
};
