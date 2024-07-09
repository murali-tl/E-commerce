'use strict';

const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('roles', [
      {
        role_id: uuidv4(),
        role_name: 'customer',
        actions_allowed: JSON.stringify(["viewProducts", "viewProduct", "viewHisOrders", "viewHisOrder", "updateCart", "updateWishList"]),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_id: uuidv4(), 
        role_name: 'admin',
        actions_allowed: JSON.stringify(["viewProducts", "viewProduct", "addProduct", "editProduct", "deleteProduct", "viewOrders", "viewOrder", "editOrder", "viewOrderStatus"]),
        created_at: new Date(),
        updated_at: new Date(),
      }
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('roles', null, {});
  },
};
