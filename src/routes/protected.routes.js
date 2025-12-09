// routes/protected.routes.js
const express = require("express");
const router = express.Router();

const samplesRoutes = require("./samples.routes");
const roleRoutes = require("./roles.routes");
const permissionRoutes = require("./permissions.routes");
const userRoleRoutes = require("./userroles.routes");
const rolepermissionRoutes = require("./rolepermissions.routes");
const userRoutes = require("./users.routes");
// const namespaceRoutes = require("./namespaces.routes");
// const deploymentRoutes = require("./deployments.routes");
// const k8sServiceRoutes = require("./k8sservices.routes");
// const ingressRoutes = require("./ingresses.routes");
// const secretRoutes = require("./secrets.routes");
const nexusRoutes = require("./nexus.routes");
const k8sManagerRoutes = require("./k8s_manager.routes");

// and all other routes to be protected should be brought here.. Eg. below.
// const plantRoutes = require('./plant.routes');
// router.use(express.json());
router.use("/samples", samplesRoutes);
router.use("/roles", roleRoutes);
router.use("/permissions", permissionRoutes);
router.use("/user-roles", userRoleRoutes);
router.use("/role-permissions", rolepermissionRoutes);
router.use("/users", userRoutes);
// router.use("/namespaces", namespaceRoutes);
// router.use("/deployments", deploymentRoutes);
// router.use("/k8sservices", k8sServiceRoutes);
// router.use("/ingresses", ingressRoutes);
// router.use("/secrets", secretRoutes);
router.use("/nexus", nexusRoutes);
router.use("/k8s", k8sManagerRoutes);

module.exports = router;
