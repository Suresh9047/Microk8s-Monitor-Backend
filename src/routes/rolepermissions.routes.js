// routes/rolepermissions.routes.js
const express = require("express");
const controller = require("../controllers/rolepermission.controller");
const router = express.Router();

router.post("/", controller.create); // POST /rolepermissions
router.get("/", controller.getAll); // GET /rolepermissions
router.get("/:id", controller.getById); // GET /rolepermissions/:id
router.put("/:id", controller.update); // PUT /rolepermissions/:id
router.delete("/:id", controller.delete); // DELETE /rolepermissions/:id

module.exports = router;
