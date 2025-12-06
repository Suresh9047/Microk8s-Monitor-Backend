const express = require("express");
const router = express.Router();
const controller = require("../controllers/pods.controller");

/**
 * @swagger
 * /pods:
 *   get:
 *     summary: List all pods with optional filters
 *     tags: [Pods]
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
 *         description: Filter by pod phase (Running, Pending, etc.)
 *       - in: query
 *         name: labels
 *         schema:
 *           type: string
 *         description: Filter by labels (e.g. app=nginx,version=v1)
 *       - in: query
 *         name: nodeName
 *         schema:
 *           type: string
 *         description: Filter by node name
 *     responses:
 *       200:
 *         description: List of pods retrieved successfully
 *       500:
 *         description: Server error
 */
router.get("/", controller.listPods);

/**
 * @swagger
 * /pods/{namespace}/{name}/logs:
 *   get:
 *     summary: Get logs from a specific container in a pod
 *     tags: [Pods]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: namespace
 *         required: true
 *         schema:
 *           type: string
 *         description: Pod namespace
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: Pod name
 *       - in: query
 *         name: container
 *         schema:
 *           type: string
 *         description: Container name (optional)
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
 *         description: Get logs since N seconds ago
 *     responses:
 *       200:
 *         description: Pod logs retrieved successfully
 *       400:
 *         description: Missing namespace or name
 *       500:
 *         description: Server error
 */
router.get("/:namespace/:name/logs", controller.getPodLogs);

/**
 * @swagger
 * /pods/{namespace}/{name}:
 *   get:
 *     summary: Get detailed information about a specific pod
 *     tags: [Pods]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: namespace
 *         required: true
 *         schema:
 *           type: string
 *         description: Pod namespace
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: Pod name
 *     responses:
 *       200:
 *         description: Pod details retrieved successfully
 *       400:
 *         description: Missing namespace or name
 *       500:
 *         description: Server error
 */
router.get("/:namespace/:name", controller.getPodDetails);

module.exports = router;
