const Listing = require('./models/listing.js');
const Review = require('./models/review.js')
const { reviewSchema, listingSchema } = require('./schema.js');

const ExpressError = require("./utils/ExpressError.js")
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "you must be logged in");
    return res.redirect("/login");
  }
  next();
};
module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl
  }
  next();
};
module.exports.isOwner = async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing.owner._id.equals(res.locals.currUser._id)) {
    req.flash("error", "You are not owner");
    return res.redirect(`/listings/${id}`);
  }
  next();
};
module.exports.isNotOwner = async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (res.locals.currUser && listing.owner._id.equals(res.locals.currUser._id)) {
    req.flash("error", "You cannot review your own listing");
    return res.redirect(`/listings/${id}`);
  }
  next();
};
module.exports.validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
}
// Middleware to validate review input
module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);

  if (error) {
    console.log(error);
    // Pass the error to the next middleware with an error object
    return next(new Error(error.details.map((el) => el.message).join(", ")));
  }

  next();
};
module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);

  if (!review.author.equals(res.locals.currUser._id)) {
    req.flash("error", "You are not owner");
    return res.redirect(`/listings/${id}`);
  }
  next();
};