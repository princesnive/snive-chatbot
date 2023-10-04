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
      return ResponseHandler(res, 404, true, "User not found");
    }

    return ResponseHandler(res, 200, false, "User profile", result.rows[0]);
  } catch (err) {
    console.log(err);
    return ResponseHandler(res, 500, true, "Internal server error");
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const id = req.user;
    const { name, username, email, phone } = req.body;

    if (!name || !username || !email || !phone) {
      return ResponseHandler(res, 400, true, "Please fill all fields");
    }

    // Check if the user exists
    const user = await pool.query("SELECT * FROM users WHERE uid = $1", [id]);

    if (user.rows.length === 0) {
      return ResponseHandler(res, 404, true, "User not found");
    }

    // Update user profile
    const query = {
      text: "UPDATE users SET name = $1, username = $2, email = $3, phone = $4 WHERE uid = $5",
      values: [name, username, email, phone, id],
    };

    await pool.query(query);

    return ResponseHandler(res, 200, false, "User profile updated");
  } catch (err) {
    console.error(err);
    return ResponseHandler(res, 500, true, "Internal server error");
  }
};
