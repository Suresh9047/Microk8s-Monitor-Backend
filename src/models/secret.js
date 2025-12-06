'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Secret extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Secret.init({
    name: DataTypes.STRING,
    namespace: DataTypes.STRING,
    type: DataTypes.STRING,
    expiry_date: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Secret',
  });
  return Secret;
};