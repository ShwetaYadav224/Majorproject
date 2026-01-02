const Joi = require("joi");

// Schema for reviews
module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number()
      .min(1) // Minimum rating of 1
      .max(5) // Maximum rating of 5
      .required(), // Field is required
    comment: Joi.string()
      .min(3) // Minimum 3 characters for meaningful content
      .required(), // Field is required
  }).required(), // The `review` object itself is required
});

// Schema for listings
module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string()
      .required(), // Field is required
    description: Joi.string().required(), // Field is required
    location: Joi.string().required(), // Field is required
    country: Joi.string().required(), // Field is required
    price: Joi.number().required(), // Field is required
    // Note: image is handled by multer via req.file, not req.body
    image: Joi.any().optional(),
  }).required(), // The `listing` object itself is required
}); 
