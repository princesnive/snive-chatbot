const router = require("express").Router();

const {
  createPlan,
  updatePlan,
  deletePlan,
  getPlan
} = require("../../../../controllers/admin/plan/PlanController");

router.route("/create-plan").post(createPlan);
router.route("/update-plan/:planId").put(updatePlan);
router.route("/get-plan/").get(getPlan);
router.route("/delete-plan/:planId").delete(deletePlan);

router.get("/", (req, res) => {
  res.status(200).json({ message: "Plan Connected!" });
});

module.exports = router;
