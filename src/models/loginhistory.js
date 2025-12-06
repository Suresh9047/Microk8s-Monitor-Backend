"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class LoginHistory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  LoginHistory.init(
    {
      user_id: DataTypes.INTEGER,
      login_time: DataTypes.DATE,
      logout_time: DataTypes.DATE,
      token: DataTypes.STRING,
      refresh_token: DataTypes.STRING,
      created_by: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "LoginHistory",
      tableName: "login_history",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "modified_at",
    }
  );
  LoginHistory.associate = function (models) {
    LoginHistory.belongsTo(models.User, {
      as: "user",
      foreignKey: "user_id",
    });
  };
  return LoginHistory;
};
