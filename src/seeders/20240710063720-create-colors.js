'use strict';
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('colors', [
      {
        color_id: uuidv4(),
        color_name: 'Red',
        color_code: '#EB5757',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        color_id: uuidv4(),
        color_name: 'Light Blue',
        color_code: '#56CCF2',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        color_id: uuidv4(),
        color_name: 'Orange',
        color_code: '#DF9167',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        color_id: uuidv4(),
        color_name: 'Purple',
        color_code: '#7B61FF',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        color_id: uuidv4(),
        color_name: 'Violet',
        color_code: '#BB6BD9',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        color_id: uuidv4(),
        color_name: 'Green',
        color_code: '#219653',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        color_id: uuidv4(),
        color_name: 'Blue',
        color_code: '#2F80ED',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        color_id: uuidv4(),
        color_name: 'Black',
        color_code: '#4F4F4F',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        color_id: uuidv4(),
        color_name: 'White',
        color_code: '#F2F2F2',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        color_id: uuidv4(),
        color_name: 'Light Green',
        color_code: '#6FCF97',
        created_at: new Date(),
        updated_at: new Date(),
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('colors', null, {});
  }
};
