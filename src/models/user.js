"use strict";
const { Model } = require("sequelize");
const Role = require("./role");
const Util = require("../utils/utils");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init(
    {
      username: DataTypes.STRING,
      password: DataTypes.STRING,
      email: DataTypes.STRING,
      is_active: DataTypes.BOOLEAN,
      created_by: DataTypes.INTEGER,
      modified_by: DataTypes.INTEGER,
    },
    {
      // this is options object to init method.
      sequelize,
      modelName: "User",
      tableName: "users",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "modified_at",
      hooks: {
        beforeCreate: async (user) => {
          user.password = await Util.hashPassword(user.password);
        },
        //Sequelize Model's hooks life cycle:
        // hooks should be in options object in init method
        // 1. beforeValidate
        // 2. validate
        // 3. afterValidate
        // 4. beforeCreate
        // 5. (create in DB)
        // 6. afterCreate
      },
    }
  );
  User.associate = function (models) {
    User.belongsToMany(models.Role, {
      as: "roles",
      through: models.UserRole,
      foreignKey: "user_id",
      otherKey: "role_id",
    });
  };
  return User;
};
