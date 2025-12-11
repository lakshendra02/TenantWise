const fs = require("fs");
const path = require("path");
const pool = require("../config/db");

const setupDb = async () => {
  try {
    const sqlPath = path.join(__dirname, "../../database/schema.sql");
    const sql = fs.readFileSync(sqlPath, "utf8");

    console.log("Running database migration...");
    await pool.query(sql);

    console.log("Database setup completed successfully!");
    console.log("Tables created: Tenants, Users, Materials, Transactions");
    process.exit(0);
  } catch (err) {
    console.error("Error setting up database:", err.message);
    process.exit(1);
  }
};

setupDb();
