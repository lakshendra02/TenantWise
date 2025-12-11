const express = require("express");
const router = express.Router();
const controller = require("../controllers/tenantController");
const tenantMiddleware = require("../middlewares/tenantMiddleware");

router.post("/", controller.createTenant);

router.post("/users", tenantMiddleware, controller.createUser);

module.exports = router;
