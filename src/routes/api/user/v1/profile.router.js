const router = require("express").Router();
const {
  profile,
  updateProfile,
} = require("../../../../controllers/user/profileController");

router.route("/me").get(profile);
router.route("/update-profile").put(updateProfile);

router.route("/").get((req, res) => {
  res.status(200).json({ message: "Connected!" });
});

module.exports = router;
