'use strict';

const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('categories', [
      {
        category_id: uuidv4(),
        category_name: 'Jackets',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        category_id: uuidv4(),
        category_name: 'Sweatshirts & Hoodies',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        category_id: uuidv4(),
        category_name: 'Sweaters',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        category_id: uuidv4(),
        category_name: 'Shirts',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        category_id: uuidv4(),
        category_name: 'T-Shirts',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        category_id: uuidv4(),
        category_name: 'Pants & Jeans',
        created_at: new Date(),
        updated_at: new Date(),
      }
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('categories', null, {});
  },
};
