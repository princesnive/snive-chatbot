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

    // Generate a password reset token
    const token = jwt.sign({ uid: user.rows[0].uid }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    const resetPasswordLink = `${process.env.CLIENT_URL}/reset-password/${token}`;

    // Send an email with the reset password link
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Password Reset | Snive",
      html: `
        <h1>Please click the link to reset your password</h1>
        <a>${resetPasswordLink}</a>
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
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
      // Check if the user with the provided ID exists in the database
      const userExists = await pool.query("SELECT * FROM users WHERE uid = $1", [
        decoded.uid,
      ]);
  
      if (userExists.rows.length === 0) {
        return ResponseHandler.error(res, "User does not exist", 404);
      }
  
      // Hash the password using bcrypt
      const salt = await bcrypt.genSalt(10);
      const bcryptPassword = await bcrypt.hash(password, salt);
  
      // Update the user's password
      pool.query(
        "UPDATE users SET password = $1 WHERE uid = $2",
        [bcryptPassword, decoded.uid],
        (error, results) => {
          if (error) {
            console.error("Error updating password:", error);
            return ResponseHandler.error(res, "Failed to reset password", 500);
          } else {
            console.log("Password updated successfully");
            return ResponseHandler.success(res, "Password reset successful", 200);
          }
        }
      );
    } catch (error) {
      console.error(error);
      return ResponseHandler.error(res, "Internal Server Error", 500);
    }
  };
  
