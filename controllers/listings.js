const Listing = require('../models/listing.js');

// Show all listings
module.exports.index = async (req, res) => {
    try {
        const allListings = await Listing.find({});
        res.render("listings/index.ejs", { allListings });
    } catch (e) {
        console.log(e);
        req.flash("error", "Cannot fetch listings");
        res.redirect('/');
    }
};

// Render new listing form
module.exports.renderNewForm = (req, res) => {
    res.render('listings/new.ejs');
};

// Create new listing
module.exports.renderCreateListing = async (req, res) => {
    try {
        if (!req.file) {
            req.flash("error", "Please upload an image");
            return res.redirect('/listings/new');
        }

        const { path: url, filename } = req.file; // multer-storage-cloudinary stores file info in req.file.path
        const newListing = new Listing({
            title: req.body.listing.title,
            description: req.body.listing.description,
            image: { url, filename },
            price: req.body.listing.price,
            country: req.body.listing.country,
            location: req.body.listing.location,
            owner: req.user._id,
        });

        await newListing.save();
        req.flash("success", "New listing created");
        res.redirect('/listings');
    } catch (e) {
        console.log(e);
        req.flash("error", "Failed to create listing");
        res.redirect('/listings/new');
    }
};

// Show a specific listing
module.exports.renderShowListing = async (req, res) => {
    const { id } = req.params;
    try {
        const listing = await Listing.findById(id)
            .populate({
                path: "reviews",
                populate: { path: "author", model: "User" },
            })
            .populate("owner");

        if (!listing) {
            req.flash("error", "Listing not found");
            return res.redirect('/listings');
        }

        res.render('listings/show.ejs', { listing });
    } catch (e) {
        console.log(e);
        req.flash("error", "Something went wrong");
        res.redirect('/listings');
    }
};

// Render edit form
module.exports.renderEditListing = async (req, res) => {
    const { id } = req.params;
    try {
        const listing = await Listing.findById(id);
        if (!listing) {
            req.flash("error", "Listing not found");
            return res.redirect('/listings');
        }
        res.render('listings/edit.ejs', { listing });
    } catch (e) {
        console.log(e);
        req.flash("error", "Something went wrong");
        res.redirect('/listings');
    }
};

// Update listing
module.exports.renderUpdateListing = async (req, res) => {
    const { id } = req.params;
    try {
        if (!req.body.listing) {
            req.flash("error", "Invalid data provided.");
            return res.redirect(`/listings/${id}/edit`);
        }

        const updatedListing = await Listing.findByIdAndUpdate(id, req.body.listing, { new: true, runValidators: true });
        if (!updatedListing) {
            req.flash("error", "Listing not found");
            return res.redirect('/listings');
        }

        req.flash("success", "Listing updated successfully!");
        res.redirect(`/listings/${id}`);
    } catch (e) {
        console.log(e);
        req.flash("error", "Failed to update listing");
        res.redirect(`/listings/${id}/edit`);
    }
};

// Delete listing
module.exports.renderDeleteListing = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedItem = await Listing.findByIdAndDelete(id);
        if (!deletedItem) {
            req.flash("error", "Listing not found");
            return res.redirect('/listings');
        }
        req.flash("success", "Listing deleted successfully!");
        res.redirect('/listings');
    } catch (e) {
        console.log(e);
        req.flash("error", "Failed to delete listing");
        res.redirect('/listings');
    }
};
