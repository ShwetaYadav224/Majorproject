const Listing = require('../models/listing.js');
module.exports.index=async (req, res) => {
   
        const allListings = await Listing.find({});
        res.render("listings/index.ejs", { allListings });
    
};
module.exports.renderNewForm=(req, res) => {
    res.render('listings/new.ejs');
};
module.exports.renderCreateListing = async (req, res) => {
        const url= req.file.url;
        const filename= req.file.filename;
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
};

module.exports.renderShowListing=async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id)
  .populate({
    path: "reviews",
    populate: {
      path: "author", // Field inside the `Review` schema
      model: "User",  // The referenced model name
    },
  })
  .populate("owner");

console.log(listing);
    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect('/listings');
    }
    console.log(listing)
    res.render('listings/show.ejs', { listing });
}
module.exports.renderEditListing=async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect('/listings');
    }

    res.render('listings/edit.ejs', { listing });
};
module.exports.renderUpdateListing=async (req, res) => {
    const { id } = req.params;

    if (!req.body.listing) {
        req.flash("error", "Invalid data provided.");
        return res.redirect(`/listings/${id}/edit`);
    }

    const updatedListing = await Listing.findByIdAndUpdate(id, req.body.listing, { new: true, runValidators: true });

    if (!updatedListing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }

    req.flash("success", "Listing has been updated successfully!");
    res.redirect(`/listings/${id}`);
};
module.exports.renderDeleteListing=async (req, res) => {
    const { id } = req.params;
    const deletedItem = await Listing.findByIdAndDelete(id);

    if (!deletedItem) {
        req.flash("error", "Listing not found");
        return res.redirect('/listings');
    }

    req.flash("success", "Listing has been deleted");
    res.redirect(`/listings/`);
}