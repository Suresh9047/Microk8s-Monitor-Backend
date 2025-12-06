const repository = require("../repositories/ingresses.repository");
const Constant = require("../utils/constants");

class Service {
    async getAll() {
        return await repository.getAll();
    }
    async getById(id) {
        return await repository.getById(id);
    }
    async create(user, data) {
        if (!Constant.isAdmin(user)) return { error: "Unauthorized operation", status: 403 };
        data.created_by = user.id;
        return await repository.create(data);
    }
    async update(user, id, data) {
        if (!Constant.isAdmin(user)) return { error: "Unauthorized operation", status: 403 };
        data.modified_by = user.id;
        return await repository.update(id, data);
    }
    async delete(user, id) {
        if (!Constant.isAdmin(user)) return { error: "Unauthorized operation", status: 403 };
        return await repository.delete(id);
    }
}
module.exports = new Service();
