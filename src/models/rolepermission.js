"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class RolePermission extends Model {
    static associate(models) {
      RolePermission.belongsTo(models.Role, {
        as: "role",
        foreignKey: "role_id",
      });
      RolePermission.belongsTo(models.Permission, {
        as: "permission",
        foreignKey: "permission_id",
      });
    }
  }

  RolePermission.init(
    {
      role_id: DataTypes.INTEGER,
      permission_id: DataTypes.INTEGER,
      created_by: DataTypes.INTEGER,
      modified_by: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "RolePermission",
      tableName: "role_permissions",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "modified_at",
    }
  );

  return RolePermission;
};
