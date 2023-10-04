const router = require("express").Router();

const v1_routes = require("./user/v1/index");
const v1_routes_admin = require("./admin/v1/index");
const v1_routes_companies = require("./companies/v1/index");

router.use("/v1", v1_routes);
router.use("/admin/v1", v1_routes_admin);
router.use("/admin/v2", v1_routes_companies);


router.get("/", (req, res) => {
  res.status(200).json({ message: "Connected123!" });
});
module.exports = router;
