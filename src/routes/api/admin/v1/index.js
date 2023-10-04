const router = require("express").Router();

const plan_route = require("./Plan.Route");

router.use("/plan", plan_route);

router.get("/", (req, res) => {
  res.status(200).json({ message: "Connected!" });
});

module.exports = router;
