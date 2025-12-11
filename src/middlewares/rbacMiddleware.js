const User = require("../models/userModel");

const rbacMiddleware = (requiredRole) => {
  return async (req, res, next) => {
    const userId = req.headers["x-user-id"];

    if (!userId) {
      return res
        .status(401)
        .json({ error: "Authentication required (x-user-id header missing)" });
    }

    try {
      const user = await User.findById(userId);

      if (!user || user.tenant_id != req.tenant.id) {
        return res
          .status(403)
          .json({ error: "User does not belong to this tenant" });
      }

      if (requiredRole === "ADMIN" && user.role !== "ADMIN") {
        return res.status(403).json({ error: "Access Denied: Admins only" });
      }

      req.user = user;
      next();
    } catch (err) {
      res.status(500).json({ error: "RBAC Check failed" });
    }
  };
};

module.exports = rbacMiddleware;
