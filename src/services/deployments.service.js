const repository = require("../repositories/deployments.repository");
const Constant = require("../utils/constants");

class Service {
    async getAll() {
        return await repository.getAll();
    }
    async getById(id) {
        return await repository.getById(id);
    }
    async create(user, data) {
        // Both Admin and Client can create ?? No, usually just Admin for infrastructure.
        // Based on user request: Admins: Edit, Scale, Delete. Users: View.
        // So logic: Create/Update/Delete = Admin only.
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
