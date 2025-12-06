"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("user_roles", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_id: {
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        type: Sequelize.INTEGER,
      },
      role_id: {
        allowNull: false,
        references: {
          model: "roles",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        type: Sequelize.INTEGER,
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
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("user_roles");
  },
};
