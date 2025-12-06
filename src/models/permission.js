"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Permission extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Permission.init(
    {
      name: DataTypes.STRING,
      desc: DataTypes.STRING,
      created_by: DataTypes.INTEGER,
      modified_by: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Permission",
      tableName: "permissions",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "modified_at",
    }
  );
  Permission.associate = function (models) {
    Permission.belongsToMany(models.Role, {
      as: "roles",
      through: models.RolePermission,
      foreignKey: "permission_id",
      otherKey: "role_id",
    });
  };
  return Permission;
};
