const service = require("../services/pods.service");
const { success, error } = require("../responses/response");

class PodsController {
  /**
   * List pods with optional filters
   * Query params: namespace, phase, labels, nodeName
   */
  listPods = async (req, res, next) => {
    try {
      const { namespace, phase, labels, nodeName } = req.query;
      const filters = { namespace, phase, labels, nodeName };

      const data = await service.listPods(filters);

      if (data.error) {
        return res.status(500).json({ success: false, message: data.error });
      }

      success(res, {
        message: "Pods retrieved successfully",
        data,
        count: data.length,
      });
    } catch (err) {
      next(err);
    }
  };

  /**
   * Get detailed information about a specific pod
   * Params: namespace, name
   */
  getPodDetails = async (req, res, next) => {
    try {
      const { namespace, name } = req.params;

      if (!namespace || !name) {
        return res.status(400).json({
          success: false,
          message: "Namespace and name are required",
        });
      }

      const data = await service.getPodDetails(namespace, name);

      if (data.error) {
        return res.status(500).json({ success: false, message: data.error });
      }

      success(res, {
        message: "Pod details retrieved successfully",
        data,
      });
    } catch (err) {
      next(err);
    }
  };

  /**
   * Get logs from a specific container in a pod
   * Params: namespace, name
   * Query params: container, tailLines, timestamps, sinceSeconds
   */
  getPodLogs = async (req, res, next) => {
    try {
      const { namespace, name } = req.params;
      const { container, tailLines, timestamps, sinceSeconds } = req.query;

      if (!namespace || !name) {
        return res.status(400).json({
          success: false,
          message: "Namespace and name are required",
        });
      }

      const options = {
        container,
        tailLines: tailLines ? parseInt(tailLines) : undefined,
        timestamps: timestamps === "true",
        sinceSeconds: sinceSeconds ? parseInt(sinceSeconds) : undefined,
      };

      const data = await service.getPodLogs(namespace, name, options);

      if (data.error) {
        return res.status(500).json({ success: false, message: data.error });
      }

      // Return plain text logs
      res.setHeader("Content-Type", "text/plain");
      return res.send(data);
    } catch (err) {
      next(err);
    }
  };
}

module.exports = new PodsController();
