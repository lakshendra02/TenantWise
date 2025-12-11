const express = require("express");
const router = express.Router();
const controller = require("../controllers/materialController");
const tenantMiddleware = require("../middlewares/tenantMiddleware");
const rbacMiddleware = require("../middlewares/rbacMiddleware");

router.use(tenantMiddleware);

router.post("/", rbacMiddleware("ADMIN"), controller.createMaterial);
router.delete("/:id", rbacMiddleware("ADMIN"), controller.softDeleteMaterial);

router.get("/", rbacMiddleware("USER"), controller.getMaterials);
router.get("/:id", rbacMiddleware("USER"), controller.getMaterialDetails);
router.post(
  "/:id/transactions",
  rbacMiddleware("USER"),
  controller.addTransaction
);

module.exports = router;
