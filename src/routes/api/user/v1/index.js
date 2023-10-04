const router = require("express").Router();
const auth = require("../../../../middlewares/auth");
const auth_routes = require("./Auth.route");
const profile_router = require("./profile.router");

router.use("/auth", auth_routes);
router.use("/user", auth,profile_router);

router.get("/", (req, res) => {
  res.status(200).json({ message: "Connected!" });
});

module.exports = router;
