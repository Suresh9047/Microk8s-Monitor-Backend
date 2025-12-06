// routes/userroles.routes.js
const express = require("express");
const controller = require("../controllers/userrole.controller");
const router = express.Router();

router.post("/", controller.create); // POST /userroles
router.get("/", controller.getAll); // GET /userroles
router.get("/:id", controller.getById); // GET /userroles/:id
router.put("/:id", controller.update); // PUT /userroles/:id
router.delete("/:id", controller.delete); // DELETE /userroles/:id

module.exports = router;
