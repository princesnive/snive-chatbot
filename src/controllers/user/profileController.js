const pool = require("../../configs/Postgress");
const ResponseHandler = require("../../utils/ResponseHandler");

exports.profile = async (req, res) => {
  const id = req.user;
  try {
    const query = {
      text: "SELECT username, email,phone FROM users WHERE uid = $1",
      values: [id],
    };

    const result = await pool.query(query);

    if (result.rows.length === 0) {
      return ResponseHandler.error(res, "User not found", 404);
    }

    return ResponseHandler.success(res, result.rows[0], "User profile");
  } catch (err) {
    console.log(err);
    return ResponseHandler.error(res, "Internal server error", 500);
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const id = req.user;
    const { name, username, email, phone } = req.body;

    if (!name || !username || !email || !phone) {
      return ResponseHandler.error(res, "All fields are required", 400);
    }

    // Check if the user exists
    const user = await pool.query("SELECT * FROM users WHERE uid = $1", [id]);

    if (user.rows.length === 0) {
      return ResponseHandler.error(res, "User not found", 404);
    }

    // Update user profile
    const query = {
      text: "UPDATE users SET name = $1, username = $2, email = $3, phone = $4 WHERE uid = $5",
      values: [name, username, email, phone, id],
    };

    await pool.query(query);

    return ResponseHandler.success(res, null, "Profile updated successfully");
  } catch (err) {
    console.error(err);
    return ResponseHandler.error(res, "Internal server error", 500);
  }
};
