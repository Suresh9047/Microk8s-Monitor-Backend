const service = require("../services/nexus.service");
const { success, error } = require("../responses/response");
const AppError = require("../responses/apperror");

class NexusController {
    getAllImages = async (req, res, next) => {
        try {
            const data = await service.getAllImagesWithTags(req.user);
            if (data.error) {
                // If error from service, we can return it. 
                // Nexus might be down or unreachable.
                return res.status(502).json({ success: false, message: data.error });
            }
            success(res, { message: "Docker images retrieved successfully", data });
        } catch (err) {
            next(err);
        }
    };

    getRepositories = async (req, res, next) => {
        try {
            const data = await service.getCatalog();
            if (data.error) {
                return res.status(502).json({ success: false, message: data.error });
            }
            success(res, { message: "Docker repositories retrieved successfully", data });
        } catch (err) {
            next(err);
        }
    };

    deleteImage = async (req, res, next) => {
        try {
            // Expecting params: name (image name), tag
            const { name, tag } = req.params;
            if (!name || !tag) {
                return res.status(400).json({ success: false, message: "Image name and tag are required" });
            }

            const result = await service.deleteImageTag(name, tag);
            if (result.error) {
                return res.status(502).json({ success: false, message: result.error });
            }

            success(res, { message: `Image ${name}:${tag} deleted successfully` });
        } catch (err) {
            next(err);
        }
    };
}

module.exports = new NexusController();
