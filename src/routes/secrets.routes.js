const express = require("express");
const controller = require("../controllers/secrets.controller");
const router = express.Router();

/**
 * @swagger
 * /secrets:
 *   get:
 *     summary: Get all secrets
 *     tags: [Secrets]
 *     responses:
 *       200:
 *         description: List of secrets
 *   post:
 *     summary: Create a secret (Admin only)
 *     tags: [Secrets]
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
