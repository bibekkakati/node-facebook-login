const express = require("express");
const passport = require("passport");
const Strategy = require("passport-facebook").Strategy;

passport.use(
  new Strategy(
    {
      clientID: "1270414239805877",
      clientSecret: "118b8838694f0675622c5b9475914f0d",
      callbackURL: "https://node-facebook-login.herokuapp.com/"
    },
    function(accessToken, refreshToken, profile, cb) {
      return cb(null, profile);
    }
  )
);

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(object, cb) {
  cb(null, object);
});

var port = process.env.PORT || 3000;

//create express app

var app = express();

//set view dir

app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

app.use(require("morgan")("combined"));
app.use(require("cookie-parser")());
app.use(require("body-parser").urlencoded({ extended: false }));
app.use(
  require("express-session")({
    secret: "node app",
    resave: true,
    saveUninitialized: true
  })
);

//@route  - GET  /
//@desc   - a route to home page
//@access - PUBLIC
app.get("/", (req, res) => {
  res.render("home", { user: req.user });
});

//@route  - GET  /login
//@desc   - a route to login page
//@access - PUBLIC
app.get("/login", (req, res) => {
  res.render("login");
});

//@route  - GET  /login/facebook
//@desc   - a route to facebook auth
//@access - PUBLIC
app.get("/login/facebook", passport.authenticate("facebook"));

//@route  - GET  /login/facebook/callback
//@desc   - a route to facebook auth
//@access - PUBLIC
app.get(
  "login/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect("/profile");
  }
);

//@route  - GET  /profile
//@desc   - a route to profile page
//@access - PRIVATE
app.get(
  "/profile",
  require("connect-ensure-login").ensureLoggedIn("/"),
  (req, res) => {
    res.render("profile", { user: req.user });
  }
);

app.listen(port, () => console.log("Server running at port " + port));
