const router = require("express").Router();

const {
  createAccount,
  login,
} = require("../../../../controllers/auth/AuthController");

router.route("/create-Account").post(createAccount);

router.route("/login").post(login);

module.exports = router;
