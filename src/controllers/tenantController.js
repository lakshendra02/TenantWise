const Tenant = require("../models/tenantModel");
const User = require("../models/userModel");

exports.createTenant = async (req, res) => {
  const { name, plan, adminEmail } = req.body;

  try {
    const newTenant = await Tenant.create(name, plan || "FREE");

    const adminUser = await User.create(
      newTenant.id,
      "Admin",
      adminEmail,
      "ADMIN"
    );

    res.status(201).json({
      message: "Tenant created",
      tenant: newTenant,
      adminUser: adminUser,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createUser = async (req, res) => {
  const { name, email, role } = req.body;
  try {
    const newUser = await User.create(req.tenant.id, name, email, role);
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
