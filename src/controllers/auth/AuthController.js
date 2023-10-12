const bcrypt = require("bcryptjs");
const pool = require("../../configs/Postgress");

const jwt = require("jsonwebtoken");
const ResponseHandler = require("../../utils/ResponseHandler");

exports.createAccount = async (req, res) => {
  const { name, email, username, phone, password } = req.body;

  // Hash the user's password before storing it
  const hashedPassword = await bcrypt.hash(password, 10);

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Check if the user with the same email or username already exists
    const checkUserQuery =
      "SELECT uid FROM users WHERE email = $1 OR username = $2";
    const { rows } = await client.query(checkUserQuery, [email, username]);

    if (rows.length > 0) {
      await client.query("ROLLBACK");
      return ResponseHandler.error(
        res,
        "User with the same email or username already exists",
        400
      );
    }

    // Insert the new user into the database
    const insertUserQuery =
      "INSERT INTO users (name, email, username, phone, password) VALUES ($1, $2, $3, $4, $5)";
    await client.query(insertUserQuery, [
      name,
      email,
      username,
      phone,
      hashedPassword,
    ]);

    await client.query("COMMIT");

    return ResponseHandler.success(res, "User registered successfully", {
      name,
      email,
      username,
      phone,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error registering user:", error);
    return ResponseHandler.error(res, "Internal server error", 500);
  } finally {
    client.release();
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const client = await pool.connect();
    // Retrieve the user's username, password, and other user details
    const userQuery = "SELECT * FROM users WHERE email = $1";
    const { rows } = await client.query(userQuery, [email]);

    if (rows.length === 0) {
      return ResponseHandler.error(res, "Invalid username or password", 400);
    }

    const {
      username: storedUsername,
      password: storedPassword,
      ...userData
    } = rows[0];

    // Compare the provided password with the stored hashed password
    const isPasswordCorrect = await bcrypt.compare(password, storedPassword);

    if (!isPasswordCorrect) {
      return ResponseHandler.error(res, "Invalid  password", 400);
    }

    // Remove sensitive information like the hashed password before sending the response
    delete userData.password;

    // Generate a JWT token

    const token = jwt.sign(
      { uid: userData.uid, username: userData.username },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    return ResponseHandler.success(res, "Login successful", {
      ...userData,
      token,
    });
  } catch (error) {
    console.error("Error during login:", error);
    return ResponseHandler.error(res, "Internal server error", 500);
  } finally {
    // client.release();
  }
};
