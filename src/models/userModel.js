const db = require("../config/db");

exports.findById = async (id) => {
  const res = await db.query("SELECT * FROM users WHERE id = $1", [id]);
  return res.rows[0];
};

exports.create = async (tenantId, name, email, role) => {
  const res = await db.query(
    "INSERT INTO users (tenant_id, name, email, role) VALUES ($1, $2, $3, $4) RETURNING *",
    [tenantId, name, email, role]
  );
  return res.rows[0];
};
