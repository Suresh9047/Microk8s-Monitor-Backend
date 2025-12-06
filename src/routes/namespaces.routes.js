const express = require("express");
const controller = require("../controllers/namespaces.controller");
const router = express.Router();

/**
 * @swagger
 * /namespaces:
 *   get:
 *     summary: Get all namespaces
 *     tags: [Namespaces]
 *     responses:
 *       200:
 *         description: List of namespaces
 *   post:
 *     summary: Create a namespace (Admin only)
 *     tags: [Namespaces]
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
