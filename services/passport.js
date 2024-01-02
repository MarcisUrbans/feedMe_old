const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const keys = require("../config/keys.js");
const mongoose = require("mongoose");
const User = mongoose.model("users");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => done(null, user));
});

passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: "/auth/google/callback",
      proxy: true,
    },
    (accessToken, refreshToken, profile, done) => {
      console.log("profile ::: ", profile.id);

      User.findOne({
        googleId: profile.id,
      }).then((uniqueUser) => {
        if (uniqueUser) {
          // have record with specific id
          done(null, uniqueUser);
        } else {
          // no user, create new one

          new User({
            googleId: profile.id,
          })
            .save()
            // done is needed for passport, meaning, we're done with request
            .then((user) => done());
        }
      });
    }
  )
);
