const express = require("express");
const router = express.Router();
const passport = require('passport');
const { newRedirectedUrl } = require("../middlewares");
const controllersUsers = require("../constrollers/users");

// Render Signup
router.get("/signup", controllersUsers.renderSignup);

// Signup Route
router.post("/signup", controllersUsers.signup);

// Render Login
router.get("/login", controllersUsers.renderLogin);


// Login Route
router.post("/login", 
  newRedirectedUrl,
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login"
  }),
  controllersUsers.login
);

// Logout Route
router.get("/logout", controllersUsers.logout)
module.exports = router;