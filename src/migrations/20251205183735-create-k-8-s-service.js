'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('k8s_services', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      namespace: {
        type: Sequelize.STRING
      },
      type: {
        type: Sequelize.STRING
      },
      cluster_ip: {
        type: Sequelize.STRING
      },
      ports: {
        type: Sequelize.STRING
      },
      created_at: {
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        type: Sequelize.DATE,
      },
      created_by: {
        allowNull: false,
        defaultValue: 1,
        type: Sequelize.INTEGER,
      },
      modified_at: {
        allowNull: true,
        defaultValue: Sequelize.literal("NULL ON UPDATE CURRENT_TIMESTAMP"),
        type: Sequelize.DATE,
      },
      modified_by: {
        allowNull: true,
        type: Sequelize.INTEGER,
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('k8s_services');
  }
};