const service = require("../services/samples.service");
const { success, error } = require("../responses/response");
const AppError = require("../responses/apperror");
const Constant = require("../utils/constants");
const singularName = "sample";
const pluralName = "samples";

class Controller {
  create = async (req, res, next) => {
    try {
      const data = await service.create(req.user, req.body);
      if (data.error)
        throw new AppError({
          message: data.error,
        });
      success(res, { message: "Data created successfully", data: data });
    } catch (error) {
      next(error);
      console.log(`${pluralName}:create: `, error);
    }
  };

  getAll = async (req, res, next) => {
    try {
      const { from, to } = req.query;
      const data = await service.getAll(from, to);
      if (data.error)
        throw new AppError({
          message: data.error,
        });
      success(res, { message: "Data retrieved successfully", data: data });
    } catch (error) {
      next(error);
      console.log(`${pluralName}:getAll: `, error);
    }
  };
  getById = async (req, res, next) => {
    try {
      const data = await service.getById(req.params.id);
      if (data.error)
        throw new AppError({
          message: data.error,
          status: 404,
        });
      success(res, { message: "Data retrieved successfully", data: data });
    } catch (error) {
      next(error);
      console.log(`${pluralName}:getById: `, error);
    }
  };

  update = async (req, res, next) => {
    try {
      const data = await service.update(req.user, req.params.id, req.body);
      if (data.error)
        throw new AppError({
          message: data.error,
        });
      success(res, { message: "Data updated successfully", data: data });
    } catch (error) {
      next(error);
      console.log(`${pluralName}:update: `, error);
    }
  };

  delete = async (req, res, next) => {
    try {
      const data = await service.delete(req.user, req.params.id);
      if (data.error)
        throw new AppError({
          message: data.error,
          status: data.status || Constant.HTTP_STATUS_400,
        });
      success(res, { message: "Data deleted successfully", data: data });
    } catch (error) {
      next(error);
      console.log(`${pluralName}:delete: `, error);
    }
  };
}

module.exports = new Controller();
