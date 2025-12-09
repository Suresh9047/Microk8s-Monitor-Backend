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

    getPodLogs = async (req, res, next) => {
        try {
            const { namespace, podName } = req.params;
            if (!namespace || !podName) {
                return res.status(400).json({ success: false, message: "Namespace and Pod Name are required" });
            }

            const logs = await service.getPodLogs(namespace, podName);

            if (logs.error) {
                return res.status(500).json({ success: false, message: logs.error });
            }

            success(res, { message: "Logs retrieved successfully", data: logs });
        } catch (err) {
            next(err);
        }
    };

    createNamespace = async (req, res, next) => {
        try {
            if (!req.body || Object.keys(req.body).length === 0) {
                return res.status(400).json({ success: false, message: "Request body cannot be empty" });
            }
            const data = await service.createNamespace(req.body);
            if (data.error) {
                return res.status(500).json({ success: false, message: data.error });
            }
            success(res, { message: "Namespace created successfully", data });
        } catch (err) {
            next(err);
        }
    };

    deleteNamespace = async (req, res, next) => {
        try {
            const { name } = req.params;
            const data = await service.deleteNamespace(name);
            if (data.error) {
                return res.status(500).json({ success: false, message: data.error });
            }
            success(res, { message: "Namespace deleted successfully", data });
        } catch (err) {
            next(err);
        }
    };

    // Deployments
    getDeployments = async (req, res, next) => {
        try {
            const namespace = req.query.namespace;
            const data = await service.getDeployments(namespace);
            if (data.error) {
                return res.status(500).json({ success: false, message: data.error });
            }
            success(res, { message: "Deployments retrieved successfully", data });
        } catch (err) {
            next(err);
        }
    };

    getDeployment = async (req, res, next) => {
        try {
            const { namespace, name } = req.params;
            const data = await service.getDeployment(namespace, name);
            if (data.error) {
                return res.status(500).json({ success: false, message: data.error });
            }
            success(res, { message: "Deployment retrieved successfully", data });
        } catch (err) {
            next(err);
        }
    };

    createDeployment = async (req, res, next) => {
        try {
            if (!req.body || Object.keys(req.body).length === 0) {
                return res.status(400).json({ success: false, message: "Request body cannot be empty" });
            }
            const { namespace } = req.query; // or req.body metadata
            // Assuming manifest is in body, namespace in query for simplicity or body
            // Usually POST /deployments?namespace=xyz or body.metadata.namespace
            const ns = namespace || req.body.metadata?.namespace || 'default';

            const data = await service.createDeployment(ns, req.body);
            if (data.error) {
                return res.status(500).json({ success: false, message: data.error });
            }
            success(res, { message: "Deployment created successfully", data });
        } catch (err) {
            next(err);
        }
    };

    deleteDeployment = async (req, res, next) => {
        try {
            const { namespace, name } = req.params;
            const data = await service.deleteDeployment(namespace, name);
            if (data.error) {
                return res.status(500).json({ success: false, message: data.error });
            }
            success(res, { message: "Deployment deleted successfully", data });
        } catch (err) {
            next(err);
        }
    };

    // Services
    getServices = async (req, res, next) => {
        try {
            const namespace = req.query.namespace;
            const data = await service.getServices(namespace);
            if (data.error) {
                return res.status(500).json({ success: false, message: data.error });
            }
            success(res, { message: "Services retrieved successfully", data });
        } catch (err) {
            next(err);
        }
    };

    getService = async (req, res, next) => {
        try {
            const { namespace, name } = req.params;
            const data = await service.getService(namespace, name);
            if (data.error) {
                return res.status(500).json({ success: false, message: data.error });
            }
            success(res, { message: "Service retrieved successfully", data });
        } catch (err) {
            next(err);
        }
    };

    createService = async (req, res, next) => {
        try {
            if (!req.body || Object.keys(req.body).length === 0) {
                return res.status(400).json({ success: false, message: "Request body cannot be empty" });
            }
            const ns = req.query.namespace || req.body.metadata?.namespace || 'default';
            const data = await service.createService(ns, req.body);
            if (data.error) {
                return res.status(500).json({ success: false, message: data.error });
            }
            success(res, { message: "Service created successfully", data });
        } catch (err) {
            next(err);
        }
    };

    deleteService = async (req, res, next) => {
        try {
            const { namespace, name } = req.params;
            const data = await service.deleteService(namespace, name);
            if (data.error) {
                return res.status(500).json({ success: false, message: data.error });
            }
            success(res, { message: "Service deleted successfully", data });
        } catch (err) {
            next(err);
        }
    };

    // Ingresses
    getIngresses = async (req, res, next) => {
        try {
            const namespace = req.query.namespace;
            const data = await service.getIngresses(namespace);
            if (data.error) {
                return res.status(500).json({ success: false, message: data.error });
            }
            success(res, { message: "Ingresses retrieved successfully", data });
        } catch (err) {
            next(err);
        }
    };

    getIngress = async (req, res, next) => {
        try {
            const { namespace, name } = req.params;
            const data = await service.getIngress(namespace, name);
            if (data.error) {
                return res.status(500).json({ success: false, message: data.error });
            }
            success(res, { message: "Ingress retrieved successfully", data });
        } catch (err) {
            next(err);
        }
    };

    createIngress = async (req, res, next) => {
        try {
            if (!req.body || Object.keys(req.body).length === 0) {
                return res.status(400).json({ success: false, message: "Request body cannot be empty" });
            }
            const ns = req.query.namespace || req.body.metadata?.namespace || 'default';
            const data = await service.createIngress(ns, req.body);
            if (data.error) {
                return res.status(500).json({ success: false, message: data.error });
            }
            success(res, { message: "Ingress created successfully", data });
        } catch (err) {
            next(err);
        }
    };

    deleteIngress = async (req, res, next) => {
        try {
            const { namespace, name } = req.params;
            const data = await service.deleteIngress(namespace, name);
            if (data.error) {
                return res.status(500).json({ success: false, message: data.error });
            }
            success(res, { message: "Ingress deleted successfully", data });
        } catch (err) {
            next(err);
        }
    };

    // Secrets
    getSecrets = async (req, res, next) => {
        try {
            const namespace = req.query.namespace;
            const data = await service.getSecrets(namespace);
            if (data.error) {
                return res.status(500).json({ success: false, message: data.error });
            }
            success(res, { message: "Secrets retrieved successfully", data });
        } catch (err) {
            next(err);
        }
    };

    getSecret = async (req, res, next) => {
        try {
            const { namespace, name } = req.params;
            const data = await service.getSecret(namespace, name);
            if (data.error) {
                return res.status(500).json({ success: false, message: data.error });
            }
            success(res, { message: "Secret retrieved successfully", data });
        } catch (err) {
            next(err);
        }
    };

    createSecret = async (req, res, next) => {
        try {
            if (!req.body || Object.keys(req.body).length === 0) {
                return res.status(400).json({ success: false, message: "Request body cannot be empty" });
            }
            const ns = req.query.namespace || req.body.metadata?.namespace || 'default';
            const data = await service.createSecret(ns, req.body);
            if (data.error) {
                return res.status(500).json({ success: false, message: data.error });
            }
            success(res, { message: "Secret created successfully", data });
        } catch (err) {
            next(err);
        }
    };

    deleteSecret = async (req, res, next) => {
        try {
            const { namespace, name } = req.params;
            const data = await service.deleteSecret(namespace, name);
            if (data.error) {
                return res.status(500).json({ success: false, message: data.error });
            }
            success(res, { message: "Secret deleted successfully", data });
        } catch (err) {
            next(err);
        }
    };

    // Update Methods for Edit

    updateDeployment = async (req, res, next) => {
        try {
            if (!req.body || Object.keys(req.body).length === 0) {
                return res.status(400).json({ success: false, message: "Request body cannot be empty" });
            }
            const { namespace, name } = req.params;
            const data = await service.updateDeployment(namespace, name, req.body);
            if (data.error) {
                return res.status(500).json({ success: false, message: data.error });
            }
            success(res, { message: "Deployment updated successfully", data });
        } catch (err) {
            next(err);
        }
    };

    updateService = async (req, res, next) => {
        try {
            if (!req.body || Object.keys(req.body).length === 0) {
                return res.status(400).json({ success: false, message: "Request body cannot be empty" });
            }
            const { namespace, name } = req.params;
            const data = await service.updateService(namespace, name, req.body);
            if (data.error) {
                return res.status(500).json({ success: false, message: data.error });
            }
            success(res, { message: "Service updated successfully", data });
        } catch (err) {
            next(err);
        }
    };

    updateIngress = async (req, res, next) => {
        try {
            if (!req.body || Object.keys(req.body).length === 0) {
                return res.status(400).json({ success: false, message: "Request body cannot be empty" });
            }
            const { namespace, name } = req.params;
            const data = await service.updateIngress(namespace, name, req.body);
            if (data.error) {
                return res.status(500).json({ success: false, message: data.error });
            }
            success(res, { message: "Ingress updated successfully", data });
        } catch (err) {
            next(err);
        }
    };

    updateSecret = async (req, res, next) => {
        try {
            if (!req.body || Object.keys(req.body).length === 0) {
                return res.status(400).json({ success: false, message: "Request body cannot be empty" });
            }
            const { namespace, name } = req.params;
            const data = await service.updateSecret(namespace, name, req.body);
            if (data.error) {
                return res.status(500).json({ success: false, message: data.error });
            }
            success(res, { message: "Secret updated successfully", data });
        } catch (err) {
            next(err);
        }
    };
}

module.exports = new K8sManagerController();
