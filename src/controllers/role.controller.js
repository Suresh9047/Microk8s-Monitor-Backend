const service = require('../services/role.service');

class Controller {
     async create(req, res) {
        try {
            const data = await service.create(req.body);
            res.status(201).json(data);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async getAll(req, res) {
        try {
            const data = await service.getAll();
            res.json(data);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async getById(req, res) {
        try {
            const data = await service.getById(req.params.id);
            if (!data) {
                return res.status(404).json({ message: 'Data not found' });
            }
            res.json(data);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
      async update(req, res) {
        try {
            const data = await service.update(req.params.id, req.body);
            if (!data) {
                return res.status(404).json({ message: 'Data not found or no changes made' });
            }
            res.json(data);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

     async delete(req, res) {
        try {
            const success = await service.delete(req.params.id);
            if (!success) {
                return res.status(404).json({ message: 'Data not found' });
            }
            res.json({ message: 'Deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = new Controller();