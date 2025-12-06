const express = require("express");
const controller = require("../controllers/users.controller");
const router = express.Router();

router.get("/active", controller.getAllActiveLogins);
router.post("/logout", controller.logout);
router.get("/:id/login_history", controller.getUserLoginHistory);

// user create is in the auth.routes(as open url(register))
//this may be used for create user's profile record
router.post("/", controller.create);
router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.put("/:id", controller.update);
router.delete("/:id", controller.delete);

module.exports = router;
