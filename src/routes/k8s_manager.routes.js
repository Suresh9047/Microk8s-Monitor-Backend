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

module.exports = router;
