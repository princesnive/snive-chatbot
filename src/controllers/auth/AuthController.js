const bcrypt = require("bcryptjs");
const pool = require("../../configs/Postgress");

const jwt = require("jsonwebtoken");

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
      return res.status(400).json({ error: "User already exists" });
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

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    client.release();
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const client = await pool.connect();

    // Retrieve the user's username, password, and other user details
    const userQuery = "SELECT * FROM users WHERE username = $1";
    const { rows } = await client.query(userQuery, [username]);

    if (rows.length === 0) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    const {
      username: storedUsername,
      password: storedPassword,
      ...userData
    } = rows[0];

    // Compare the provided password with the stored hashed password
    const isPasswordCorrect = await bcrypt.compare(password, storedPassword);

    if (!isPasswordCorrect) {
      return res.status(400).json({ error: "Invalid username or password" });
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

    return res.status(200).json({
      message: "Logged in successfully",
      success: true,
      data: {
        token,
        user: userData,
      },
    });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ error: "Internal server error" });
  } finally {
    // client.release();
  }
};
