const service = require("../services/auth.service");
const { success, error } = require("../responses/response");
const AppError = require("../responses/apperror");
class Controller {
  //All Service's methods.. will return direct(whatever we need) data or {error: <message>}
  //So, we check for <returnVairable>.error and throw AppError on error otherwise
  //otherwise return thru success(see in response.js)
  // eg. all Controller's method should start with following..
  // const data = await service.login(req.body);
  //     if (data.error)
  //       throw new AppError({
  //         message: data.error,
  //         status: 401,
  //       });

  async getAll(req, res, next) {
    try {
      const data = await service.getAll();
      if (data.error)
        throw new AppError({
          message: data.error,
        });
      success(res, { message: "Data retrieval success", data: data });
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const data = await service.getById(req.params.id);
      if (data.error)
        throw new AppError({
          message: data.error,
          status: 404,
        });
      success(res, { message: "Data retrieval success", data: data });
    } catch (error) {
      next(error);
    }
  }

  async register(req, res, next) {
    try {
      const data = await service.register(req.body);
      if (data.error)
        throw new AppError({
          message: data.error,
        });
      success(res, { message: "Registration failed", data: data });
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const data = await service.login(req.body);
      if (data.error)
        throw new AppError({
          message: data.error,
          status: 401,
        });

      success(res, { message: "Successful Login.", data: data });
    } catch (error) {
      next(error);
      console.log("auth:login: ", error);
    }
  }
}

module.exports = new Controller();
