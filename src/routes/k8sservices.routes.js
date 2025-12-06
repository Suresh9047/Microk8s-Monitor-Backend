const express = require("express");
const controller = require("../controllers/k8sservices.controller");
const router = express.Router();

/**
 * @swagger
 * /k8sservices:
 *   get:
 *     summary: Get all services
 *     tags: [K8sServices]
 *     responses:
 *       200:
 *         description: List of services
 *   post:
 *     summary: Create a service (Admin only)
 *     tags: [K8sServices]
 *     responses:
 *       200:
 *         description: Created
 *       403:
 *         description: Unauthorized
 */
router.get("/", controller.getAll);
router.post("/", controller.create);
router.put("/:id", controller.update);
router.delete("/:id", controller.delete);

module.exports = router;
