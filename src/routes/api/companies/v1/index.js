const router = require("express").Router();

const company = require("./companies.route");

router.use("/companies", company);

router.get("/", (req, res) => {
  res.status(200).json({ message: "Connected!" });
});

module.exports = router;
