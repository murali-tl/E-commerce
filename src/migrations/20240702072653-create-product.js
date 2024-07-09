'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('products', {
      id: {
        allowNull: false,
        autoIncrement: true,
        type: Sequelize.INTEGER
      },
      product_id: {
        type: Sequelize.UUID,
        primaryKey: true
      },
      product_name: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      },
      images: {
        type: Sequelize.JSON
      },
      quantity: {
        type: Sequelize.INTEGER
      },
      sizes: {
        type: Sequelize.JSON
      },
      price: {
        type: Sequelize.FLOAT
      },
      rating: {
        type: Sequelize.FLOAT
      },
      colours: {
        type: Sequelize.JSON
      },
      category: {
        type: Sequelize.STRING
      },
      product_status: {
        type: Sequelize.STRING
      },
      created_by: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('products');
  }
};