const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const {validateReview, isReviewAuthor,isLoggedIn}=require('../middleware.js');
const reviewController = require("../controllers/reviews.js");

// POST route to add a new review
router.post("/", validateReview,isLoggedIn, wrapAsync(reviewController.renderNewReviewRoute));

// DELETE route to remove a review
router.delete('/:reviewId', isReviewAuthor,wrapAsync(reviewController.renderDeleteReviewRoute));

module.exports = router;
