"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("login_history", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      login_time: {
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        type: Sequelize.DATE,
      },
      logout_time: {
        type: Sequelize.DATE,
      },
      token: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      refresh_token: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      created_at: {
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        type: Sequelize.DATE,
      },
      created_by: {
        allowNull: false,

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
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("login_history");
  },
};
