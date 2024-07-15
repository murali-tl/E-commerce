'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('payments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        type: Sequelize.INTEGER
      },
      payment_id: {
        type: Sequelize.UUID,
        primaryKey: true,
      },
      payment_status: {
        type: Sequelize.STRING
      },
      user_id: {
        type: Sequelize.UUID
      },
      amount: {
        type: Sequelize.FLOAT
      },
      order_id: {
        type: Sequelize.STRING
      },
      payment_type: {
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
    await queryInterface.dropTable('payments');
  }
};