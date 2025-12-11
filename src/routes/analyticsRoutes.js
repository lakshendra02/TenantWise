const express = require("express");
const router = express.Router();
const controller = require("../controllers/analyticsController");
const tenantMiddleware = require("../middlewares/tenantMiddleware");
const rbacMiddleware = require("../middlewares/rbacMiddleware");

router.use(tenantMiddleware);

router.get("/summary", rbacMiddleware("ADMIN"), controller.getSummary);

module.exports = router;
