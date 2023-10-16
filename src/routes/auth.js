const router = require("express").Router();
const { v4: uuidv4 } = require("uuid");
const { Pool } = require("pg");
const passport = require("passport");

// Create a new pool instance
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "humanAi",
  password: "1512",
  port: 5432,
});

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login/failed" }),
  (req, res) => {
    const userEmail = req.user.emails[0].value;
    const userName = req.user.displayName;
    const googleId = req.user.id;
    const sessionId = uuidv4(); // Generate a new UUID for the session ID

    pool.query(
      "INSERT INTO users (name, email, username, google_id) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING",
      [userName, userEmail, userEmail, googleId],
      (error, results) => {
        if (error) {
          throw error;
        }
        console.log("User data has been saved successfully!");
        // Send the session ID in the response
        res.json({ sessionId: sessionId });
      }
    );
  }
);

router.get("/login/success", (req, res) => {
  if (req.user) {
    res.json({
      success: true,
      message: "User has successfully authenticated",
      user: req.user,
      cookies: req.cookies,
    });
  }
});

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get("/login/failed", (req, res) => {
  res.send("You failed to login!");
});

module.exports = router;
