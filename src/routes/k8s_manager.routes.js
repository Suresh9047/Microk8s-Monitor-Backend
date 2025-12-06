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
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of namespaces
 */
router.get(
  "/namespaces",
  authorizeRoles(["admin", "client"]),
  controller.getNamespaces
);

/**
 * @swagger
 * /k8s/pods:
 *   get:
 *     summary: List all K8s Pods with filters
 *     tags: [Kubernetes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: namespace
 *         schema:
 *           type: string
 *         description: Filter by namespace
 *       - in: query
 *         name: phase
 *         schema:
 *           type: string
 *         description: Filter by phase (Running, Pending, Failed, etc.)
 *       - in: query
 *         name: nodeName
 *         schema:
 *           type: string
 *         description: Filter by node name
 *       - in: query
 *         name: label.app
 *         schema:
 *           type: string
 *         description: Filter by label (can use label.{key}={value})
 *     responses:
 *       200:
 *         description: List of pods with metrics
 */
router.get("/pods", authorizeRoles(["admin", "client"]), controller.listPods);

/**
 * @swagger
 * /k8s/pods/{namespace}/{name}/logs:
 *   get:
 *     summary: Get pod container logs
 *     tags: [Kubernetes]
 *     security:
 *       - bearerAuth: []
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
 *       - in: query
 *         name: container
 *         schema:
 *           type: string
 *         description: Container name
 *       - in: query
 *         name: tailLines
 *         schema:
 *           type: integer
 *         description: Number of lines to tail
 *       - in: query
 *         name: timestamps
 *         schema:
 *           type: boolean
 *         description: Include timestamps
 *       - in: query
 *         name: sinceSeconds
 *         schema:
 *           type: integer
 *         description: Get logs from last N seconds
 *     responses:
 *       200:
 *         description: Pod logs (plain text)
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 */
router.get(
  "/pods/:namespace/:name/logs",
  authorizeRoles(["admin", "client"]),
  controller.getPodLogs
);

/**
 * @swagger
 * /k8s/pods/{namespace}/{name}:
 *   get:
 *     summary: Get detailed pod information
 *     tags: [Kubernetes]
 *     security:
 *       - bearerAuth: []
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
 *         description: Pod details with events
 *       404:
 *         description: Pod not found
 */
router.get(
  "/pods/:namespace/:name",
  authorizeRoles(["admin", "client"]),
  controller.getPodDetails
);

/**
 * @swagger
 * /k8s/pods/{namespace}/{name}:
 *   delete:
 *     summary: Delete a pod
 *     tags: [Kubernetes]
 *     security:
 *       - bearerAuth: []
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
 *         description: Pod deleted successfully
 *       404:
 *         description: Pod not found
 */
router.delete(
  "/pods/:namespace/:name",
  authorizeRoles(["admin", "client"]),
  controller.deletePod
);

module.exports = router;
