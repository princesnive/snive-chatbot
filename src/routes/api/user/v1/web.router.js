const router = require("express").Router();

const { getPlans } = require("../../../../controllers/user/webController");

router.get("/plans", getPlans);

module.exports = router;
