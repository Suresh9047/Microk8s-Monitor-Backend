"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Sample extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Sample.init(
    {
      name: DataTypes.STRING,
      description: DataTypes.STRING,
      pur_price: DataTypes.DOUBLE,
      sale_price: DataTypes.DOUBLE,
      pur_date: DataTypes.DATE,
      stock: DataTypes.INTEGER,
      created_by: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Sample",
      tableName: "samples",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "modified_at",
    }
  );
  return Sample;
};
