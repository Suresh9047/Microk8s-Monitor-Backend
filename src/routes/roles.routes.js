// routes/roles.routes.js
const express = require("express");
const controller = require("../controllers/role.controller");
const router = express.Router();

router.post("/", controller.create); // POST /roles
router.get("/", controller.getAll); // GET /roles
router.get("/:id", controller.getById); // GET /roles/:id
router.put("/:id", controller.update); // PUT /roles/:id
router.delete("/:id", controller.delete); // DELETE /roles/:id
module.exports = router;
