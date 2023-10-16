const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");

passport.use(
  new GoogleStrategy(
    {
      clientID: "861131847692-ju9fndegmf11ho2c1t6aakvj7ne7qs46.apps.googleusercontent.com",
      clientSecret: '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',
      callbackURL: "/auth/google/callback",
      scope: ["profile", "email"],
    },
    function (accessToken, refreshToken, profile, callback) {
      callback(null, profile);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
