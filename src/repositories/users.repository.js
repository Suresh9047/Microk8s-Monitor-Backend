const { literal } = require("sequelize");
const utils = require("../utils/utils");
const Constant = require("../utils/constants");
const db = require("../models");
const Model = db.UserProfile;
const LoginHistoryModel = db.LoginHistory;
const UserModel = db.User;
const singularName = "users";
const pluralName = "users";

class Repository {
  // Add more CRUD operations as needed CRUD maybe used for user's profile. (UserProfile model)
  async create(data) {
    return await Model.create(data, { raw: true });
  }

  async getAll(startDate, endDate) {
    const dateFilter = await utils.getDateFilter({
      startDate: startDate,
      endDate: endDate,
      fieldMap: { date: "created_at" },
    });
    return await Model.findAll({
      where: {
        ...dateFilter, // applies pur_date BETWEEN start & end
      },
      raw: true,
    });
  }

  async getById(id) {
    return await Model.findByPk(id, { raw: true });
  }

  async update(id, data) {
    const [updatedRows] = await Model.update(data, {
      where: { id: id },
    });
    if (!updatedRows) {
      return { error: `Data not found` };
    }
    return await Model.findByPk(id, { raw: true });
  }

  async delete(id) {
    const deleted = Model.destroy({
      where: { id: id },
    });
    if (!deleted) {
      return { error: "Delete failed." };
    }
    return deleted;
  }

  async getByName(name) {
    return await Model.findOne({ where: { name: name }, raw: true });
  }

  // login realted starts
  async createLoginHistory(data) {
    console.log("LH: ", data);
    return await LoginHistoryModel.create(data, { raw: true });
  }

  async getAllActiveLogins() {
    return await LoginHistoryModel.findAll({
      attributes: ["id", "login_time"],
      where: { logout_time: null },
      include: [
        {
          model: UserModel,
          as: "user",
          attributes: ["id", "username"],
        },
      ],
      order: [["login_time", "DESC"]],
      raw: false, // raw: true breaks include; set raw: false
    });
  }
  // async getAllActiveLogins() {
  //   return await LoginHistoryModel.findAll({
  //     where: { logout_time: null },
  //     raw: true,
  //   });
  // }

  async getUserLoginHistory(userId) {
    return await LoginHistoryModel.findAll({
      attributes: ["id", "login_time", "logout_time"],
      where: { user_id: userId },
      include: [
        {
          model: UserModel,
          as: "user",
          attributes: ["id", "username"],
        },
      ],
      order: [
        [literal(`CASE WHEN logout_time IS NULL THEN 0 ELSE 1 END`), "ASC"],
        ["logout_time", "DESC"],
      ],
      raw: false, // raw: true breaks include; set raw: false
    });
  }

  async logout(userId, data) {
    const [updated] = await LoginHistoryModel.update(data, {
      where: {
        user_id: userId,
        logout_time: null,
      },
    });
    if (!updated) {
      return { error: "Logout failed. No active session found." };
    }
    return updated;
  }
  // login realted ends
}
module.exports = new Repository();
