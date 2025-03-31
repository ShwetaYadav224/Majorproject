const Review = require('../models/review.js');
const Listing = require('../models/listing.js');

module.exports.renderNewReviewRoute=async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    const newReview = new Review(req.body.review);
    newReview.author=req.user._id;
    listing.reviews.push(newReview);
  console.log(newReview.author);
    await newReview.save();
    await listing.save();
    req.flash("success","Review is added");
    res.redirect(`/listings/${listing._id}`);
  };

module.exports.renderDeleteReviewRoute=async (req, res) => {
    const { id, reviewId } = req.params;
  
    // Delete the review document
    await Review.findByIdAndDelete(reviewId);
  
    // Remove the review reference from the listing
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    req.flash("success","Review is deleted");
    // Redirect back to the listing
    res.redirect(`/listings/${id}`);
  }