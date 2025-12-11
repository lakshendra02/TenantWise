const Tenant = require("../models/tenantModel");

const tenantMiddleware = async (req, res, next) => {
  const tenantId = req.headers["x-tenant-id"];

  if (!tenantId) {
    return res.status(400).json({ error: "x-tenant-id header is required" });
  }

  try {
    const tenant = await Tenant.findById(tenantId);
    if (!tenant) {
      return res.status(404).json({ error: "Tenant not found" });
    }

    req.tenant = tenant;
    next();
  } catch (err) {
    res.status(500).json({ error: "Server error validating tenant" });
  }
};

module.exports = tenantMiddleware;
