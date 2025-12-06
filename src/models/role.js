"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Role.init(
    {
      name: DataTypes.STRING,
      desc: DataTypes.STRING,
      is_active: DataTypes.BOOLEAN,
      created_by: DataTypes.INTEGER,
      modified_by: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Role",
      tableName: "roles",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "modified_at",
    }
  );
  Role.associate = function (models) {
    Role.belongsToMany(models.User, {
      as: "users",
      through: models.UserRole,
      foreignKey: "role_id",
      otherKey: "user_id",
    });
  };
  Role.associate = function (models) {
    Role.belongsToMany(models.Permission, {
      as: "permissions",
      through: models.RolePermission,
      foreignKey: "role_id",
      otherKey: "permission_id",
    });
  };
  return Role;
};
