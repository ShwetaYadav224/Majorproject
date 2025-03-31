const User = require('../models/user.js');
module.exports.renderSignup =async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, (err) => {
            if (err) return next(err);
            req.flash('success', 'Welcome to Wonderlust!');
            res.redirect('/listings');
        });
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/signup');
    }
}
module.exports.renderSignupForm=(req, res) => {
    res.render('./users/signup.ejs');
}
module.exports.renderLoginForm=(req, res) => {
    res.render('users/login.ejs');
}
module.exports.renderLogin=(req, res) => {
    req.flash('success', 'Welcome to Wonderlust!');
    let redirectUrl=res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}
module.exports.renderLogout=(req,res,next)=>{
    req.logout((err)=>{
     if(err){
  return next(err);
     }
     req.flash("success","You are succesfully log out");
    }); 
    res.redirect("/login") ;  
 }