const ResponseHandler = require("../../utils/ResponseHandler");
const pool = require("../../configs/Postgress");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");

// Create a reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "a64655d3c1a768",
    pass: "d9447d78ab0fc8",
  },
});
function generateRandomToken(length = 32) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let token = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    token += characters.charAt(randomIndex);
  }
  return token;
}
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return ResponseHandler.error(res, "Email is required", 400);
    }

    // Check if the user exists
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (user.rows.length === 0) {
      return ResponseHandler.error(res, "User does not exist", 404);
    }

    // Generate a password reset token and expiration time
    const tokenValue = generateRandomToken();
    const expirationTimestamp = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day expiration

    // Insert the reset token into the database
    await pool.query(
      "INSERT INTO reset_tokens (user_id, token_value, expiration_timestamp) VALUES ($1, $2, $3)",
      [user.rows[0].uid, tokenValue, expirationTimestamp]
    );

    const resetPasswordLink = `${process.env.CLIENT_URL}/reset-password/${tokenValue}`;

    // Send an email with the reset password link
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Password Reset | Snive",
      html: `
        <h1>Please click the link to reset your password</h1>
        <a href="${resetPasswordLink}">${resetPasswordLink}</a>
      `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        return ResponseHandler.error(res, "Failed to send email", 500);
      } else {
        console.log("Email sent: " + info.response);
        return ResponseHandler.success(res, "Email sent successfully", 200);
      }
    });
  } catch (error) {
    console.error(error);
    return ResponseHandler.error(res, "Internal Server Error", 500);
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      return ResponseHandler.error(res, "Password is required", 400);
    }

    // Check if the token is valid
    const tokenRow = await pool.query(
      "SELECT * FROM reset_tokens WHERE token_value = $1",
      [token]
    );

    if (tokenRow.rows.length === 0) {
      return ResponseHandler.error(res, "Invalid or expired token", 401);
    }

    const tokenData = tokenRow.rows[0];
    const currentTime = new Date();

    if (tokenData.used || currentTime > tokenData.expiration_timestamp) {
      // Token has already been used or expired
      return ResponseHandler.error(res, "Invalid or expired token", 401);
    }

    // Check if the user with the provided user_id exists in the database
    const userExists = await pool.query("SELECT * FROM users WHERE uid = $1", [
      tokenData.user_id,
    ]);

    if (userExists.rows.length === 0) {
      return ResponseHandler.error(res, "User does not exist", 404);
    }

    // Hash the new password using bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update the user's password in the database
    await pool.query("UPDATE users SET password = $1 WHERE uid = $2", [
      hashedPassword,
      tokenData.user_id,
    ]);

    // Mark the token as used in the database
    await pool.query(
      "UPDATE reset_tokens SET used = TRUE WHERE token_id = $1",
      [tokenData.token_id]
    );

    return ResponseHandler.success(res, "Password reset successful", 200);
  } catch (error) {
    console.error(error);
    return ResponseHandler.error(res, "Internal Server Error", 500);
  }
};
