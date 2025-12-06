const service = require("../services/auth.service");
const { whiteList } = require("../utils/constants");
const Util = require("../utils/utils");

const authenticateToken = (req, res, next) => {
  // Skip whitelist URLs
  if (whiteList.some((path) => req.originalUrl.startsWith(path))) {
    return next();
  }
  
  const authHeader = req.headers["authorization"];

  const token = authHeader && authHeader.split(" ")[1]; // Extract the token from "Bearer <token>"

  if (token == null) {
    return res.status(401).json({ message: "Authentication token required" });
  }

  Util.verifyJwtToken(token, async (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }
    req.user = user;
    next(); // Proceed to the next middleware or route handler
  });
};

//It should be called after the above 'authenticate' middleware in the app.
const attachRolesAndPermissions = async (req, res, next) => {
  try {
    // Skip whitelist URLs
    if (whiteList.some((path) => req.originalUrl.startsWith(path))) {
      return next();
    }
    // Assuming user ID is extracted from token or session
    const id = req.user.id;
    const data = await service.getUserRolesAndPermissionsSequelize(id);
    if (data.error) {
      return next();
    }
    const { roles, permissions } = data;
    // Attach roles and permissions to req.user
    req.user.roles = roles;
    req.user.permissions = permissions;
    next(); // Proceed to the next middleware (e.g., authorizeRoles)
  } catch (error) {
    console.error("Error fetching user roles/permissions:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  authenticateToken,
  attachRolesAndPermissions,
};
