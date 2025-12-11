const db = require("../config/db");

exports.create = async (tenantId, materialId, type, quantity) => {
  const res = await db.query(
    "INSERT INTO transactions (tenant_id, material_id, type, quantity) VALUES ($1, $2, $3, $4) RETURNING *",
    [tenantId, materialId, type, quantity]
  );
  return res.rows[0];
};

exports.findByMaterial = async (materialId, tenantId) => {
  const res = await db.query(
    "SELECT * FROM transactions WHERE material_id = $1 AND tenant_id = $2 ORDER BY created_at DESC",
    [materialId, tenantId]
  );
  return res.rows;
};
exports.getSummary = async (tenantId) => {
  const res = await db.query(
    `
        SELECT 
            SUM(CASE WHEN type = 'IN' THEN quantity ELSE 0 END) as total_in,
            SUM(CASE WHEN type = 'OUT' THEN quantity ELSE 0 END) as total_out
        FROM transactions 
        WHERE tenant_id = $1`,
    [tenantId]
  );
  return res.rows[0];
};
