const repository = require('../repositories/permission.repository');

class Service {
    async create(data) {
        return await repository.create(data);
    }

    async getAll() {
        return await repository.getAll();
    }

    async getById(id) {
        return await repository.getById(id);
    }

    async update(id, data) {
        return await repository.update(id, data);
    }

    async delete(id) {
        return await repository.delete(id);
    }
}

module.exports = new Service();