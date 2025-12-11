const Material = require("../models/materialModel");
const Transaction = require("../models/transactionModel");

exports.createMaterial = async (req, res) => {
  const { name, unit } = req.body;

  try {
    if (req.tenant.plan === "FREE") {
      const count = await Material.countByTenant(req.tenant.id);
      if (count >= 5) {
        return res.status(403).json({
          error: "FREE plan limit reached (Max 5 materials). Upgrade to PRO.",
        });
      }
    }

    const material = await Material.create(req.tenant.id, name, unit);
    res.status(201).json(material);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMaterials = async (req, res) => {
  try {
    const filters = {
      name: req.query.name,
      unit: req.query.unit,
    };
    const materials = await Material.findAll(req.tenant.id, filters);
    res.json(materials);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMaterialDetails = async (req, res) => {
  const { id } = req.params;
  try {
    const material = await Material.findById(id, req.tenant.id);
    if (!material) return res.status(404).json({ error: "Material not found" });

    const history = await Transaction.findByMaterial(id, req.tenant.id);

    res.json({ ...material, transactions: history });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addTransaction = async (req, res) => {
  const { id } = req.params;
  const { type, quantity } = req.body;

  if (!["IN", "OUT"].includes(type)) {
    return res.status(400).json({ error: "Invalid transaction type" });
  }

  try {
    const material = await Material.findById(id, req.tenant.id);
    if (!material) return res.status(404).json({ error: "Material not found" });

    if (type === "OUT" && material.current_stock < quantity) {
      return res.status(400).json({ error: "Insufficient stock" });
    }

    const change = type === "IN" ? quantity : -quantity;

    await Material.updateStock(id, change);
    const transaction = await Transaction.create(
      req.tenant.id,
      id,
      type,
      quantity
    );

    res.status(201).json(transaction);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.softDeleteMaterial = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Material.softDelete(id, req.tenant.id);
    if (!deleted) return res.status(404).json({ error: "Material not found" });
    res.json({ message: "Material soft deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
