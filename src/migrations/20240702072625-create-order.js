'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('orders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        type: Sequelize.INTEGER
      },
      order_id: {
        type: Sequelize.STRING,
        primaryKey: true
      },
      user_id: {
        type: Sequelize.UUID
      },
      product_details: {
        type: Sequelize.ARRAY(Sequelize.JSON)
      },
      amount: {
        type: Sequelize.FLOAT
      },
      payment_status: {
        type: Sequelize.STRING
      },
      order_status: {
        type: Sequelize.STRING
      },
      shipping_type: {
        type: Sequelize.STRING
      },
      address: {
        type: Sequelize.JSON
      },
      delivery_status: {
        type: Sequelize.STRING
      },
      estimated_delivery_date: {
        type: Sequelize.DATE
      },
      delivered_at: {
        type: Sequelize.DATE
      },
      updated_by: {
        type: Sequelize.STRING
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deleted_at: {
        allowNull:true,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('orders');
  }
};