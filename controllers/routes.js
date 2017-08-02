var express = require("express");
var router = express.Router();

var db = require("../models");

var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;

passport.use(new LocalStrategy(
	function(username, password, done) {
		db.user.findOne({ email: email }, function(err, user) {
		if (err) { return done(err); }
		if (!user) {
			return done(null, false, { message: 'Incorrect email.' });
		}
		if (!user.validPassword(password)) {
			return done(null, false, { message: 'Incorrect password.' });
		}
		return done(null, user);
		});
	}
));


router.get("/", function(req, res) {
	res.render("landing");
});

router.get("/home", function(req, res) {
	res.render("home");
});

router.get("/signup", function(req, res) {
	res.render("signup");
});

router.post("/signup", function(req, res) {
	res.render("home");
});

router.get("/login", function(req, res) {
	res.render("login");
});

router.post("/login", function(req, res) {
	res.render("home");
});
	// passport.authenticate("local", {
		// successRedirect: "home/" + req.user.email,
		// failureRedirect: "/login",
		// failureFlash: "Invalid email or password."
	// });

router.get("/survey", function(req, res) {
	res.render("survey");
});

module.exports = router;