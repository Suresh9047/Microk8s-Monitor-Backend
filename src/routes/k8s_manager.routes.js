const express = require("express");
const controller = require("../controllers/k8s_manager.controller");
const { authorizeRoles } = require("../middleware/authorize.middleware");

const router = express.Router();

/**
 * @swagger
 * /k8s/namespaces:
 *   get:
 *     summary: Get all K8s Namespaces
 *     tags: [Kubernetes]
 *     responses:
 *       200:
 *         description: List of namespaces
 */
router.get("/namespaces", authorizeRoles(["admin", "client"]), controller.getNamespaces);

/**
 * @swagger
 * /k8s/pods:
 *   get:
 *     summary: Get K8s Pods
 *     tags: [Kubernetes]
 *     parameters:
 *       - in: query
 *         name: namespace
 *         schema:
 *           type: string
 *         description: Optional namespace to filter pods
 *     responses:
 *       200:
 *         description: List of pods
 */
router.get("/pods", authorizeRoles(["admin", "client"]), controller.getPods);

/**
 * @swagger
 * /k8s/pods/{namespace}/{podName}/logs:
 *   get:
 *     summary: Get Logs for a specific Pod
 *     tags: [Kubernetes]
 *     parameters:
 *       - in: path
 *         name: namespace
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: podName
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Logs content
 */
router.get("/pods/:namespace/:podName/logs", authorizeRoles(["admin", "client"]), controller.getPodLogs);

/**
 * @swagger
 * /k8s/namespaces:
 *   post:
 *     summary: Create Namespace (Admin only)
 *     tags: [Kubernetes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Created
 *       400:
 *         description: Bad Request
 * 
 * /k8s/namespaces/{name}:
 *   delete:
 *     summary: Delete Namespace (Admin only)
 *     tags: [Kubernetes]
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Deleted
 */
router.post("/namespaces", authorizeRoles(["admin"]), controller.createNamespace);
router.delete("/namespaces/:name", authorizeRoles(["admin"]), controller.deleteNamespace);

/**
 * @swagger
 * /k8s/deployments:
 *   get:
 *     summary: Get Deployments
 *     tags: [Kubernetes]
 *     parameters:
 *       - in: query
 *         name: namespace
 *         schema:
 *           type: string
 *         description: Optional namespace to filter
 *   post:
 *     summary: Create Deployment (Admin only)
 *     tags: [Kubernetes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Created
 * 
 * /k8s/deployments/{namespace}/{name}:
 *   get:
 *     summary: Get Deployment Details (YAML/JSON)
 *     tags: [Kubernetes]
 *     parameters:
 *       - in: path
 *         name: namespace
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Deployment Details
 *   put:
 *     summary: Update Deployment (Admin only)
 *     tags: [Kubernetes]
 *     parameters:
 *       - in: path
 *         name: namespace
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Updated
 *   delete:
 *     summary: Delete Deployment (Admin only)
 *     tags: [Kubernetes]
 *     parameters:
 *       - in: path
 *         name: namespace
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Deleted
 */
router.get("/deployments", authorizeRoles(["admin", "client"]), controller.getDeployments);
router.post("/deployments", authorizeRoles(["admin"]), controller.createDeployment);
router.get("/deployments/:namespace/:name", authorizeRoles(["admin", "client"]), controller.getDeployment);
router.put("/deployments/:namespace/:name", authorizeRoles(["admin"]), controller.updateDeployment);
router.delete("/deployments/:namespace/:name", authorizeRoles(["admin"]), controller.deleteDeployment);

/**
 * @swagger
 * /k8s/services:
 *   get:
 *     summary: Get Services
 *     tags: [Kubernetes]
 *     parameters:
 *       - in: query
 *         name: namespace
 *         schema:
 *           type: string
 *         description: Optional namespace to filter
 *   post:
 *     summary: Create Service (Admin only)
 *     tags: [Kubernetes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Created
 * 
 * /k8s/services/{namespace}/{name}:
 *   get:
 *     summary: Get Service Details (YAML/JSON)
 *     tags: [Kubernetes]
 *     parameters:
 *       - in: path
 *         name: namespace
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Service Details
 *   put:
 *     summary: Update Service (Admin only)
 *     tags: [Kubernetes]
 *     parameters:
 *       - in: path
 *         name: namespace
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Updated
 *   delete:
 *     summary: Delete Service (Admin only)
 *     tags: [Kubernetes]
 *     parameters:
 *       - in: path
 *         name: namespace
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Deleted
 */
router.get("/services", authorizeRoles(["admin", "client"]), controller.getServices);
router.post("/services", authorizeRoles(["admin"]), controller.createService);
router.get("/services/:namespace/:name", authorizeRoles(["admin", "client"]), controller.getService);
router.put("/services/:namespace/:name", authorizeRoles(["admin"]), controller.updateService);
router.delete("/services/:namespace/:name", authorizeRoles(["admin"]), controller.deleteService);

/**
 * @swagger
 * /k8s/ingresses:
 *   get:
 *     summary: Get Ingresses
 *     tags: [Kubernetes]
 *     parameters:
 *       - in: query
 *         name: namespace
 *         schema:
 *           type: string
 *         description: Optional namespace to filter
 *   post:
 *     summary: Create Ingress (Admin only)
 *     tags: [Kubernetes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Created
 * 
 * /k8s/ingresses/{namespace}/{name}:
 *   get:
 *     summary: Get Ingress Details (YAML/JSON)
 *     tags: [Kubernetes]
 *     parameters:
 *       - in: path
 *         name: namespace
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ingress Details
 *   put:
 *     summary: Update Ingress (Admin only)
 *     tags: [Kubernetes]
 *     parameters:
 *       - in: path
 *         name: namespace
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Updated
 *   delete:
 *     summary: Delete Ingress (Admin only)
 *     tags: [Kubernetes]
 *     parameters:
 *       - in: path
 *         name: namespace
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Deleted
 */
router.get("/ingresses", authorizeRoles(["admin", "client"]), controller.getIngresses);
router.post("/ingresses", authorizeRoles(["admin"]), controller.createIngress);
router.get("/ingresses/:namespace/:name", authorizeRoles(["admin", "client"]), controller.getIngress);
router.put("/ingresses/:namespace/:name", authorizeRoles(["admin"]), controller.updateIngress);
router.delete("/ingresses/:namespace/:name", authorizeRoles(["admin"]), controller.deleteIngress);

/**
 * @swagger
 * /k8s/secrets:
 *   get:
 *     summary: Get Secrets
 *     tags: [Kubernetes]
 *     parameters:
 *       - in: query
 *         name: namespace
 *         schema:
 *           type: string
 *         description: Optional namespace to filter
 *   post:
 *     summary: Create Secret (Admin only)
 *     tags: [Kubernetes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Created
 * 
 * /k8s/secrets/{namespace}/{name}:
 *   get:
 *     summary: Get Secret Details (YAML/JSON)
 *     tags: [Kubernetes]
 *     parameters:
 *       - in: path
 *         name: namespace
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Secret Details
 *   put:
 *     summary: Update Secret (Admin only)
 *     tags: [Kubernetes]
 *     parameters:
 *       - in: path
 *         name: namespace
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Updated
 *   delete:
 *     summary: Delete Secret (Admin only)
 *     tags: [Kubernetes]
 *     parameters:
 *       - in: path
 *         name: namespace
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Deleted
 */
router.get("/secrets", authorizeRoles(["admin", "client"]), controller.getSecrets);
router.post("/secrets", authorizeRoles(["admin"]), controller.createSecret);
router.get("/secrets/:namespace/:name", authorizeRoles(["admin", "client"]), controller.getSecret);
router.put("/secrets/:namespace/:name", authorizeRoles(["admin"]), controller.updateSecret);
router.delete("/secrets/:namespace/:name", authorizeRoles(["admin"]), controller.deleteSecret);


module.exports = router;
