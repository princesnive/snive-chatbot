const pool = require("../../configs/Postgress");
const ResponseHandler = require("../../utils/ResponseHandler");

// get all plans

exports.getPlans = async (req, res) => {
  let client;
  try {
    // Acquire a client from the pool
    client = await pool.connect();
    // Execute your database query
    const result = await client.query("SELECT * FROM Plans");

    return ResponseHandler.success(res, "Plans fetched successfully", result.rows);
  } catch (error) {
    console.error("Error fetching plans:", error);
    return ResponseHandler.error(res, error.message);
  } finally {
    // Release the client back to the pool
    if (client) client.release();
  }
};
