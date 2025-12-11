const db = require("../config/db");

exports.create = async (name, plan) => {
  const res = await db.query(
    "INSERT INTO tenants (name, plan) VALUES ($1, $2) RETURNING *",
    [name, plan]
  );
  return res.rows[0];
};

exports.findById = async (id) => {
  const res = await db.query("SELECT * FROM tenants WHERE id = $1", [id]);
  return res.rows[0];
};
