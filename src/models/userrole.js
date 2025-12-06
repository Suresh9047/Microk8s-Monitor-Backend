"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserRole extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  UserRole.init(
    {
      user_id: DataTypes.INTEGER,
      role_id: DataTypes.INTEGER,
      created_by: DataTypes.INTEGER,
      modified_by: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "UserRole",
      tableName: "user_roles",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "modified_at",
    }
  );
  UserRole.associate = function (models) {
    UserRole.belongsTo(models.User, { as: "user", foreignKey: "user_id" });
    UserRole.belongsTo(models.Role, { as: "role", foreignKey: "role_id" });
  };
  return UserRole;
};
