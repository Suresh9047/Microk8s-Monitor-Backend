const { whiteList } = require("../utils/constants");

const authorizeRoles = (allowedRoles) => (req, res, next) => {
  // allowedRoles.some(role => req.user.roles.includes(role))
  if (whiteList.some((path) => req.originalUrl.startsWith(path))) {
    return next();
  }
  if (
    !req.user ||
    !req.user.roles ||
    !allowedRoles.some((allowedRole) =>
      req.user.roles.some(
        (userRole) => allowedRole.toLowerCase() === userRole.toLowerCase()
      )
    )
  ) {
    return res.status(403).json({ message: "Forbidden: Insufficient role" });
  }
  next();
};

const authorizePermissions = (requiredPermissions) => {
  return (req, res, next) => {
    // Skip whitelist URLs
    if (whiteList.some((path) => req.originalUrl.startsWith(path))) {
      return next();
    }
    if (!req.user || !req.user.permissions) {
      res.status(403).json({ message: "Forbidden: Insufficient permissions" });
    }
    // Assume user and their permissions are attached to req after authentication
    const userPermissions = req.user.permissions; // Get permissions associated with the user's roles
    const userPermissionsLower = userPermissions.map((p) => p.toLowerCase());
    const requiredPermissionsLower = requiredPermissions.map((p) =>
      p.toLowerCase()
    );
    const hasPermission = requiredPermissionsLower.every((permission) =>
      userPermissionsLower.includes(permission)
    );

    // const hasPermission = requiredPermissions.every(permission =>
    //     userPermissions.includes(permission)
    // );

    if (hasPermission) {
      next(); // User has the required permissions
    } else {
      res.status(403).json({ message: "Forbidden: Insufficient permissions" });
    }
  };
};

module.exports = {
  authorizeRoles,
  authorizePermissions,
};
