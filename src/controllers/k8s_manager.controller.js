const k8sService = require("../services/k8s_manager.service");
const podsService = require("../services/pods.service");
const { success, error } = require("../responses/response");

class K8sManagerController {
  getNamespaces = async (req, res, next) => {
    try {
      const data = await k8sService.getNamespaces();
      if (data.error) {
        return res.status(500).json({ success: false, message: data.error });
      }
      success(res, { message: "Namespaces retrieved successfully", data });
    } catch (err) {
      next(err);
    }
  };

  // List pods with filters
  listPods = async (req, res, next) => {
    try {
      // Extract all query parameters including label filters
      const filters = {};
      Object.keys(req.query).forEach((key) => {
        filters[key] = req.query[key];
      });

      const data = await podsService.listPods(filters);

      if (data.error) {
        return res.status(500).json({ success: false, message: data.error });
      }

      // Return array directly as per frontend spec
      return res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  };

  // Get pod details
  getPodDetails = async (req, res, next) => {
    try {
      const { namespace, name } = req.params;

      if (!namespace || !name) {
        return res.status(400).json({
          message: "Namespace and name are required",
        });
      }

      const data = await podsService.getPodDetails(namespace, name);

      if (data.error) {
        return res.status(500).json({ message: data.error });
      }

      return res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  };

  // Get pod logs
  getPodLogs = async (req, res, next) => {
    try {
      const { namespace, name } = req.params;
      const { container, tailLines, timestamps, sinceSeconds } = req.query;

      if (!namespace || !name) {
        return res.status(400).json({
          message: "Namespace and name are required",
        });
      }

      const options = {
        container,
        tailLines: tailLines ? parseInt(tailLines) : 100,
        timestamps: timestamps === "true",
        sinceSeconds: sinceSeconds ? parseInt(sinceSeconds) : undefined,
      };

      const logs = await podsService.getPodLogs(namespace, name, options);

      // Return plain text
      return res.status(200).type("text/plain").send(logs);
    } catch (err) {
      return res.status(500).json({
        message: err.message,
        detail: "Failed to fetch pod logs",
      });
    }
  };

  // Delete pod
  deletePod = async (req, res, next) => {
    try {
      const { namespace, name } = req.params;

      if (!namespace || !name) {
        return res.status(400).json({
          message: "Namespace and name are required",
        });
      }

      const result = await podsService.deletePod(namespace, name);

      if (!result.success) {
        return res.status(500).json({
          success: false,
          message: result.message,
        });
      }

      return res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };
}

module.exports = new K8sManagerController();
