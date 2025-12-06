const utils = require("../utils/utils");
const Constant = require("../utils/constants");
const db = require("../models"); // Adjust path based on your project structure
const Model = db.Sample; // Access the model
const Ordermodel = db.Order;
const singularName = "sample";
const pluralName = "samples";

class Repository {
  // Add more CRUD operations as needed
  async create(data) {
    return await Model.create(data, { raw: true });
  }

  async getAll(startDate, endDate) {
    const dateFilter = await utils.getDateFilter({
      startDate: startDate,
      endDate: endDate,
      fieldMap: { date: "pur_date" },
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
}
module.exports = new Repository();
