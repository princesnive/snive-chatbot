const router = require("express").Router();

const passport = require("passport");

const {
  createAccount,
  login,
} = require("../../../../controllers/auth/AuthController");

router.route("/create-Account").post(createAccount);

router.route("/google/callback").get(
  passport.authenticate("google", {
    successRedirect: process.env.CLIENT_URL,
    failureRedirect: "/login/failed",
  })
);

router.route("/login/success").get((req, res) => {
  if (req.user) {
    res.json({
      success: true,
      message: "user has successfully authenticated",
      user: req.user,
      cookies: req.cookies,
    });
  }
});
router.route("/google").get(
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.route("/login/failed").get((req, res) => {
  res.send("You failed to login!");
});

router.route("/");
router.route("/login").post(login);

module.exports = router;
