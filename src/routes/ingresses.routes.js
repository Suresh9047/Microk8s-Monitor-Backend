const express = require("express");
const controller = require("../controllers/ingresses.controller");
const router = express.Router();

/**
 * @swagger
 * /ingresses:
 *   get:
 *     summary: Get all ingresses
 *     tags: [Ingresses]
 *     responses:
 *       200:
 *         description: List of ingresses
 *   post:
 *     summary: Create an ingress (Admin only)
 *     tags: [Ingresses]
 *     responses:
 *       200:
 *         description: Created
 *       403:
 *         description: Unauthorized
 */
router.get("/", controller.getAll);
router.post("/", controller.create);
router.delete("/:id", controller.delete);

module.exports = router;
