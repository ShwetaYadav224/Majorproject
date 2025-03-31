const express = require('express');
const router = express.Router({ mergeParams: true });
const passport = require('passport');
const wrapAsync = require('../utils/wrapAsync.js');
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");

// Signup Routes
router.route('/signup')
    .get(userController.renderSignupForm) // Signup Form Route
    .post(wrapAsync(userController.renderSignup)); // Signup Logic

// Login Routes
router.route('/login')
    .get(userController.renderLoginForm) // Login Form Route
    .post(
        saveRedirectUrl,
        passport.authenticate('local', {
            failureRedirect: '/login',
            failureFlash: true,
        }),
        userController.renderLogin // Login Logic
    );

// Logout Route
router.get('/logout', userController.renderLogout);

module.exports = router;
