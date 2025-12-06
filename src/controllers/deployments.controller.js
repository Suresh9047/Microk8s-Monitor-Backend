const service = require("../services/deployments.service");
const { success, error } = require("../responses/response");
const AppError = require("../responses/apperror");
const Constant = require("../utils/constants");

class Controller {
    getAll = async (req, res, next) => {
        try {
            const data = await service.getAll();
            success(res, { message: "Data retrieved successfully", data });
        } catch (err) {
            next(err);
        }
    };
    create = async (req, res, next) => {
        try {
            const data = await service.create(req.user, req.body);
            if (data.error) throw new AppError({ message: data.error, status: 403 });
            success(res, { message: "Created successfully", data });
        } catch (err) {
            next(err);
        }
    };
    update = async (req, res, next) => {
        try {
            const data = await service.update(req.user, req.params.id, req.body);
            if (data.error) throw new AppError({ message: data.error, status: 403 });
            success(res, { message: "Updated successfully", data });
        } catch (err) {
            next(err);
        }
    };
    delete = async (req, res, next) => {
        try {
            const data = await service.delete(req.user, req.params.id);
            if (data.error) throw new AppError({ message: data.error, status: 403 });
            success(res, { message: "Deleted successfully", data });
        } catch (err) {
            next(err);
        }
    };
}
module.exports = new Controller();
