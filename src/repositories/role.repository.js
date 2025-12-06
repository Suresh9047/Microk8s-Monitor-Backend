const db = require('../models'); // Adjust path based on your project structure
const Model = db.Role; // Access the model

const singlurName = 'role'
const pluralName = 'roles'
class Repository {    
    // Add more CRUD operations as needed
    async create(data) {
        try {
            const dbData = await Model.create(data);
            return dbData;
        } catch (error) {
            throw new Error(`Error creating ${singlurName}: ${error.message}`);
        }
    }

    async getAll() {
        try {
            const listOfDbData = await Model.findAll();
            return listOfDbData;
        } catch (error) {
            throw new Error(`Error fetching ${pluralName}: ${error.message}`);
        }
    }

    async getById(id) {
        try {
            const dbData = await Model.findByPk(id);
            return dbData;
        } catch (error) {
            throw new Error(`Error fetching ${singlurName} by ID: ${error.message}`);
        }
    }

    async update(id, data) {
        try {
            const [updatedRows] = await Model.update(data, {
                where: { id: id }
            });
            if (updatedRows === 0) {
                return null; // data not found or no changes made
            }
            const updatedDbData = await Model.findByPk(id);
            return updatedDbData;
        } catch (error) {
            throw new Error(`Error updating ${singlurName}: ${error.message}`);
        }
    }

    async delete(id) {
        try {
            const deletedRows = await Model.destroy({
                where: { id: id }
            });
            return deletedRows > 0; // true if deleted, false otherwise
        } catch (error) {
            throw new Error(`Error deleting ${singlurName}: ${error.message}`);
        }
    }
}
module.exports = new Repository();
