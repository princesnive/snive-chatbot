const pool = require("../../../configs/Postgress");
const ResponseHandler = require("../../../utils/ResponseHandler");
exports.createPlan = async (req, res) => {
  try {
    const { name, description, price, features, currency } = req.body;

    const result = await pool.query(
      "INSERT INTO Plans (name, description, price, features, currency) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [name, description, price, features, currency]
    );

    return res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// get all plans
exports.getPlan = async (req, res) => {
  // get all plans
  try {
    const result = await pool.query("SELECT * FROM Plans");
    return res.json(result.rows);
  } catch (error) {
    console.error(error);
    return;
  }
};

exports.updatePlan = async (req, res) => {
  try {
    const planId = req.params.planId; // Assuming you pass the plan ID as a route parameter
    const { name, description, price, features, currency } = req.body; // Assuming you send updated data in the request body

    const result = await pool.query(
      "UPDATE Plans SET name = $1, description = $2, price = $3, features = $4, currency = $5, updated_at = CURRENT_TIMESTAMP WHERE plan_id = $6 RETURNING *",
      [name, description, price, features, currency, planId]
    );

    if (result.rows.length === 0) {
      return ResponseHandler.error(res, "Plan not found", 404);
    }

    return ResponseHandler.success(
      res,
      result.rows[0],
      "Plan updated successfully"
    );
  } catch (error) {
    console.error(error);
    return ResponseHandler(res, 500, true, "Internal server error");
  }
};

exports.deletePlan = async (req, res) => {
  try {
    const planId = req.params.planId; // Assuming you pass the plan ID as a route parameter

    const result = await pool.query(
      "DELETE FROM Plans WHERE plan_id = $1 RETURNING *",
      [planId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Plan not found" });
    }

    return ResponseHandler.success(
      res,
      result.rows[0],
      "Plan deleted successfully"
    );
  } catch (error) {
    console.error(error);
    return ResponseHandler(res, 500, true, "Internal server error");
  }
};
