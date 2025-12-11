const db = require("../config/db");

exports.create = async (tenantId, name, unit) => {
  const res = await db.query(
    "INSERT INTO materials (tenant_id, name, unit) VALUES ($1, $2, $3) RETURNING *",
    [tenantId, name, unit]
  );
  return res.rows[0];
};

exports.countByTenant = async (tenantId) => {
  const res = await db.query(
    "SELECT COUNT(*) FROM materials WHERE tenant_id = $1 AND deleted_at IS NULL",
    [tenantId]
  );
  return parseInt(res.rows[0].count);
};

exports.findAll = async (tenantId, filters = {}) => {
  let query =
    "SELECT * FROM materials WHERE tenant_id = $1 AND deleted_at IS NULL";
  const params = [tenantId];
  if (filters.name) {
    params.push(`%${filters.name}%`);
    query += ` AND name ILIKE $${params.length}`;
  }
  if (filters.unit) {
    params.push(filters.unit);
    query += ` AND unit = $${params.length}`;
  }

  const res = await db.query(query, params);
  return res.rows;
};

exports.findById = async (id, tenantId) => {
  const res = await db.query(
    "SELECT * FROM materials WHERE id = $1 AND tenant_id = $2 AND deleted_at IS NULL",
    [id, tenantId]
  );
  return res.rows[0];
};

exports.updateStock = async (id, quantity) => {
  await db.query(
    "UPDATE materials SET current_stock = current_stock + $1 WHERE id = $2",
    [quantity, id]
  );
};
exports.softDelete = async (id, tenantId) => {
  const res = await db.query(
    "UPDATE materials SET deleted_at = NOW() WHERE id = $1 AND tenant_id = $2 RETURNING *",
    [id, tenantId]
  );
  return res.rows[0];
};
