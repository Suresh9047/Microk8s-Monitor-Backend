const express = require("express");
const controller = require("../controllers/nexus.controller");
const router = express.Router();

/**
 * @swagger
 * /nexus/images:
 *   get:
 *     summary: Get all docker images and their tags from Nexus Registry
 *     tags: [Nexus]
 *     responses:
 *       200:
 *         description: List of images with tags
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Docker images retrieved successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       image:
 *                         type: string
 *                         example: "my-app-backend"
 *                       tags:
 *                         type: array
 *                         items:
 *                           type: string
 *                         example: ["v1.0.0", "latest"]
 *       502:
 *         description: Failed to fetch from Nexus
 */
router.get("/images", controller.getAllImages);

/**
 * @swagger
 * /nexus/repositories:
 *   get:
 *     summary: Get all docker repositories from Nexus Registry
 *     tags: [Nexus]
 *     responses:
 *       200:
 *         description: List of repositories
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Docker repositories retrieved successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: string
 *                     example: "my-app-backend"
 *       502:
 *         description: Failed to fetch from Nexus
 */
router.get("/repositories", controller.getRepositories);

const { authorizeRoles } = require("../middleware/authorize.middleware");

/**
 * @swagger
 * /nexus/images/{name}/tags/{tag}:
 *   delete:
 *     summary: Delete a specific docker image tag (Admin Only)
 *     tags: [Nexus]
 *     parameters:
 *       - in: path
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *         description: Name of the repository/image
 *       - in: path
 *         name: tag
 *         schema:
 *           type: string
 *         required: true
 *         description: Tag to delete
 *     responses:
 *       200:
 *         description: Image tag deleted successfully
 *       403:
 *         description: Insufficient permissions (Admin required)
 *       502:
 *         description: Failed to delete from Nexus
 */
router.delete("/images/:name/tags/:tag", authorizeRoles(["admin"]), controller.deleteImage);

module.exports = router;
