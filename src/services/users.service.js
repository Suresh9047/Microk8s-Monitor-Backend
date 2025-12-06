const repository = require("../repositories/users.repository");
const Constant = require("../utils/constants");
const utils = require("../utils/utils");
const singularName = "user";
const pluralName = "users";

class Service {
  checkData = async (data) => {
    // do some validation if needed
    const result = utils.validateRequiredFields(
      data,
      Constant.USER_REQUIRED_FIELDS
    );
    if (result) {
      return { error: result };
    }
    if (!data.id) {
      const existing = await repository.getByName(data.name);
      if (existing) {
        return { error: Constant.DUPLICATE_MSG };
      }
    }
    // // maybe we can use for dob if there...
    // const parts = data.dob.trim().split(" ");
    // let timePart = Constant.ZERO_TIME;
    // if (parts && parts.length == 2) {
    //   timePart = parts[1];
    // }
    // data.dob = utils.mergeDateTimeToUTC(
    //   parts[0],
    //   parts[1]
    //   // Constant.ZERO_TIME,
    //   // Constant.DEFAULT_DATE_FORMAT
    // );
    return data;
  };
  // // user create is in the auth.routes(as open url(register)), so this may be used for user's profile create
  // // user create is in the auth.routes(as open url(register)), so this may be used for user's profile create
  create = async (user, data) => {
    if (!Constant.isAdmin(user)) {
      return { error: "Unauthorized operation.", status: 403 };
    }
    // Validation
    const result = utils.validateRequiredFields(
      data,
      Constant.USER_REQUIRED_FIELDS
    );
    if (result) {
      return { error: result };
    }

    // Dynamic require to avoid circular dependency
    const authService = require("./auth.service");

    // Use auth service to register (create user + hash password + assign role)
    // Default to 'User' if role not provided
    const created = await authService.register(data, data.role || "User");

    if (created.error) {
      return created; // Forward error (e.g. "User already exists")
    }

    data.created_by = user.id;
    // Note: authService.register already creates the user record.
    // If there is additional profile data handling, it should go here.

    return created;
  };

  getAll = async (user, fromDate, toDate) => {
    const { start, end } = utils.checkDates(fromDate, toDate);
    return await repository.getAll(user, start, end);
  };

  getById = async (id) => {
    const data = await repository.getById(id);
    if (!data) {
      return { error: `Data not found` };
    }
    return data;
  };

  // this may be used for user's profile update
  update = async (user, id, data) => {
    if (!Constant.isAdmin(user)) {
      return { error: "Unauthorized operation.", status: 403 };
    }
    data = await this.checkData(data);
    if (data.error) return data;
    data.updated_by = user.id;
    return await repository.update(id, data);
  };

  delete = async (user, id) => {
    if (!Constant.isAdmin(user)) {
      return { error: "Unauthorized operation.", status: 403 };
    }
    return await repository.delete(id);
  };

  // login realted starts
  async createLoginHistory(data) {
    const created = await repository.createLoginHistory(data);
    if (!created) {
      return { error: `Session creation failed` };
    }
    return created;
  }

  async getAllActiveLogins() {
    return await repository.getAllActiveLogins();
  }

  async getUserLoginHistory(id) {
    return await repository.getUserLoginHistory(id);
  }

  async logout(user) {
    if (!user || !user.id) {
      return { error: "Unauthorized operation.", status: 403 };
    }
    const data = { logout_time: utils.getToDayUtc() };
    console.log("logout: data: ", data);
    return await repository.logout(user.id, data);
  }
  // login realted ends
}

module.exports = new Service();
