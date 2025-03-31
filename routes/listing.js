const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn } = require('../middleware.js');
const listingController = require("../controllers/listings.js");
const multer = require('multer');
const { storage } = require('../cloudConfig.js');
const upload = multer({ storage });
// Index and Create Routes
router.route("/")
   .get(wrapAsync(listingController.index)) // Show all listings
   .post(isLoggedIn, upload.single("listing[image]"), wrapAsync(listingController.renderCreateListing));

// New Listing Route    
router.get('/new', isLoggedIn, listingController.renderNewForm);

// Show, Update, and Delete Routes
router.route('/:id')
    .get(isLoggedIn, wrapAsync(listingController.renderShowListing)) // Show Listing Route
    .put(isLoggedIn, wrapAsync(listingController.renderUpdateListing)) // Update Listing Route
    .delete(isLoggedIn, wrapAsync(listingController.renderDeleteListing)); // Delete Listing Route

// Edit Listing Route
router.get('/:id/edit', isLoggedIn, wrapAsync(listingController.renderEditListing));

module.exports = router;
