const express = require("express");
const bodyParser = require("body-parser");

const tenantRoutes = require("./routes/tenantRoutes");
const materialRoutes = require("./routes/materialRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");

const app = express();

app.use(express.json());
app.use("/tenants", tenantRoutes);
app.use("/materials", materialRoutes);
app.use("/analytics", analyticsRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
