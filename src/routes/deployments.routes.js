const express = require("express");
const controller = require("../controllers/deployments.controller");
const router = express.Router();

/**
 * @swagger
 * /deployments:
 *   get:
 *     summary: Get all deployments
 *     tags: [Deployments]
 *     responses:
 *       200:
 *         description: List of deployments
 *   post:
 *     summary: Create a deployment (Admin only)
 *     tags: [Deployments]
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
