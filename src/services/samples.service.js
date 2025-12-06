const repository = require("../repositories/samples.repository");
const Constant = require("../utils/constants");
const utils = require("../utils/utils");
const singularName = "sample";
const pluralName = "samples";

class Service {
  checkData = async (data) => {
    // do some validation like login if needed
    const result = utils.validateRequiredFields(
      data,
      Constant.SAMPLE_REQUIRED_FIELDS
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
    const parts = data.pur_date.trim().split(" ");
    let timePart = Constant.ZERO_TIME;
    if (parts && parts.length == 2) {
      timePart = parts[1];
    }
    console.log("pdate bfr:", data);
    data.pur_date = utils.mergeDateTimeToUTC(
      parts[0],
      parts[1]
      // Constant.ZERO_TIME,
      // Constant.DEFAULT_DATE_FORMAT
    );
    console.log("pdate aftr:", data);
    return data;
  };
  create = async (user, data) => {
    data = await this.checkData(data);
    if (data.error) return data;
    data.created_by = user.id;
    console.log(user, data);
    const created = await repository.create(data);
    if (!created) {
      return { error: `Data creation failed` };
    }
    return created;
  };

  getAll = async (fromDate, toDate) => {
    const { start, end } = utils.checkDates(fromDate, toDate);
    return await repository.getAll(start, end);
  };

  getById = async (id) => {
    const data = await repository.getById(id);
    if (!data) {
      return { error: `Data not found` };
    }
    return data;
  };

  update = async (user, id, data) => {
    data = await this.checkData(data);
    if (data.error) return data;
    if (!Constant.isAdmin(user)) {
      return { error: "Unauthorized operation." };
    }
    data.updated_by = user.id;
    return await repository.update(id, data);
  };

  delete = async (user, id) => {
    if (!Constant.isAdmin(user)) {
      return { error: "Unauthorized operation.", status: 403 };
    }
    return await repository.delete(id);
  };
}

module.exports = new Service();
