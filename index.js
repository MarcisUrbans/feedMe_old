const express = require("express");
require("./models/user");
require("./services/passport");
const keys = require("./config/keys.js");
const cookieSession = require("cookie-session");
const passport = require("passport");
const mongoose = require("mongoose");

// mongoose.set("useNewUrlParser", true);
// mongoose.set("useUnifiedTopology", true);
mongoose.connect(keys.mongoURI);

const app = express();
app.use(express.json());
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey],
  })
);
app.use(passport.initialize());
app.use(passport.session());

require("./routes/authRoutes")(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT);
