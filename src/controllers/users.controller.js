const service = require("../services/users.service");
const { success, error } = require("../responses/response");
const AppError = require("../responses/apperror");
const Constant = require("../utils/constants");
const singularName = "user";
const pluralName = "users";

class Controller {
  // // user create is in the auth.routes(as open url(register)), so this may be used for user's profile create
  create = async (req, res, next) => {
    try {
      const data = await service.create(req.user, req.body);
      if (data.error)
        throw new AppError({
          message: data.error,
          status: data.status || Constant.HTTP_STATUS_400,
        });
      success(res, { message: "Data created successfully", data: data });
    } catch (error) {
      next(error);
      console.log(`${pluralName}:create: `, error);
    }
  };

  getAll = async (req, res, next) => {
    try {
      const user = req.user;
      const { from, to } = req.query;
      const data = await service.getAll(user, from, to);
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
  // this may be used for user's profile update
  update = async (req, res, next) => {
    try {
      const data = await service.update(req.user, req.params.id, req.body);
      if (data.error)
        throw new AppError({
          message: data.error,
          status: data.status || Constant.HTTP_STATUS_400,
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

  // login realted starts
  async createLoginHistory(data) {
    try {
      const data = await service.createLoginHistory(data);
      if (data.error)
        throw new AppError({
          message: data.error,
          status: data.status || Constant.HTTP_STATUS_400,
        });
      success(res, {
        message: "Login record created successfully",
        data: data,
      });
    } catch (error) {
      next(error);
      console.log(`${pluralName}:delete: `, error);
    }
  }

  getAllActiveLogins = async (req, res, next) => {
    try {
      const data = await service.getAllActiveLogins();

      if (data.error)
        throw new AppError({
          message: data.error,
        });

      success(res, { message: "Active Logins fetched", data });
    } catch (error) {
      next(error);
      console.log(`users:getAllActiveLogins: `, error);
    }
  };

  getUserLoginHistory = async (req, res, next) => {
    try {
      const data = await service.getUserLoginHistory(req.params.id);

      if (data.error)
        throw new AppError({
          message: data.error,
          status: 404,
        });

      success(res, { message: "User login history fetched", data });
    } catch (error) {
      next(error);
      console.log(`users:getUserLoginHistory: `, error);
    }
  };

  logout = async (req, res, next) => {
    try {
      const data = await service.logout(req.user);
      if (data.error) throw new AppError({ message: data.error });
      success(res, { message: "Logged out successfully", data: data });
    } catch (error) {
      next(error);
    }
  };
  // login realted ends
}

module.exports = new Controller();
