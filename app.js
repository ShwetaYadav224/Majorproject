if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}
const express = require('express');
const mongoose = require('mongoose');
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require("./utils/ExpressError.js");
const listingRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter= require("./routes/user.js");
const passport = require('passport');
const LocalStrategy = require("passport-local").Strategy;
const User = require('./models/user.js');
const app = express();


// EJS and Static File Setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, '/public')));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// Session and Flash Setup
const sessionOptions = {
    secret: process.env.SESSION_SECRET || "mysupersecretcode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days from now
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};
app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");  
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});


// MongoDB Connection
async function main() {
    try {
         await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`);
        console.log("Database connected successfully");
    } catch (err) {
        console.error("Database connection failed", err);
        process.exit(1);
    }
}

// Routes
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);
app.get("/home", (req, res) => {
    res.render("Home/home.ejs");
});

// Error Handling
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found"));
});

app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).render("error.ejs", { message, statusCode });
});

// Start Server
const port = process.env.PORT || 8911;
main().then(() => {
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}).catch(err => {
    console.error("Failed to start server:", err);
});
