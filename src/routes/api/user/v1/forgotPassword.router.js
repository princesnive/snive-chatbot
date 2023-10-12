const router = require("express").Router();

const {
  forgotPassword,
  resetPassword,
} = require("../../../../controllers/auth/ForgotPasswordController");

router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password/:token").post(resetPassword);

module.exports = router;
