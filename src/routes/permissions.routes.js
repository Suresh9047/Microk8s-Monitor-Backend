// routes/permissions.routes.js
const express = require("express");
const controller = require("../controllers/permission.controller");
const router = express.Router();

router.post("/", controller.create); // POST /permissions
router.get("/", controller.getAll); // GET /permissions
router.get("/:id", controller.getById); // GET /permissions/:id
router.put("/:id", controller.update); // PUT /permissions/:id
router.delete("/:id", controller.delete); // DELETE /permissions/:i

module.exports = router;
