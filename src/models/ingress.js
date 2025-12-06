'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Ingress extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Ingress.init({
    name: DataTypes.STRING,
    namespace: DataTypes.STRING,
    rules: DataTypes.TEXT,
    address: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Ingress',
  });
  return Ingress;
};