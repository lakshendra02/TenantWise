const Material = require("../models/materialModel");
const Transaction = require("../models/transactionModel");

exports.getSummary = async (req, res) => {
  try {
    const materialCount = await Material.countByTenant(req.tenant.id);
    const transactionSummary = await Transaction.getSummary(req.tenant.id);

    res.json({
      tenant: req.tenant.name,
      plan: req.tenant.plan,
      total_materials: materialCount,
      total_in_quantity: parseInt(transactionSummary.total_in || 0),
      total_out_quantity: parseInt(transactionSummary.total_out || 0),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
