const service = require("../services/k8s_manager.service");
const { success, error } = require("../responses/response");

class K8sManagerController {

    getNamespaces = async (req, res, next) => {
        try {
            const data = await service.getNamespaces();
            if (data.error) {
                return res.status(500).json({ success: false, message: data.error });
            }
            success(res, { message: "Namespaces retrieved successfully", data });
        } catch (err) {
            next(err);
        }
    };

    getPods = async (req, res, next) => {
        try {
            // Optional query param ?namespace=xyz
            // If not provided, fetch from all namespaces or default? 
            // The service method `getPods` takes a namespace. `getAllPods` takes none.

            const namespace = req.query.namespace;
            let data;

            if (namespace) {
                data = await service.getPods(namespace);
            } else {
                data = await service.getAllPods();
            }

            if (data.error) {
                return res.status(500).json({ success: false, message: data.error });
            }
            success(res, { message: "Pods retrieved successfully", data });
        } catch (err) {
            next(err);
        }
    };
}

module.exports = new K8sManagerController();
