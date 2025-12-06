const db = require("../models");
const Model = db.K8sService;

class Repository {
    async getAll() {
        return await Model.findAll({ raw: true });
    }
    async getById(id) {
        return await Model.findByPk(id, { raw: true });
    }
    async create(data) {
        return await Model.create(data, { raw: true });
    }
    async update(id, data) {
        const [updated] = await Model.update(data, { where: { id } });
        if (!updated) return { error: "Not found" };
        return await Model.findByPk(id, { raw: true });
    }
    async delete(id) {
        return await Model.destroy({ where: { id } });
    }
}
module.exports = new Repository();
