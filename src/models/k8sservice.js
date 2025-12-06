'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class K8sService extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  K8sService.init({
    name: DataTypes.STRING,
    namespace: DataTypes.STRING,
    type: DataTypes.STRING,
    cluster_ip: DataTypes.STRING,
    ports: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'K8sService',
  });
  return K8sService;
};