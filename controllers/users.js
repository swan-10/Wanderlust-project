const User = require("../models/user.js");

module.exports.renderSignupForm = (req,res)=>{
    res.render("users/signup.ejs");
};

module.exports.signup = async (req,res)=>{
    try{
        let {username,email,password} = req.body;
        const newUser = new User({email,username});
        const registerdUser  = await User.register(newUser,password);
        console.log(registerdUser);
        req.login(registerdUser, (error)=>{
            if(error){
                return next(error);
            }
            req.flash("success","Sign Up successful! Welcome to Wanderlust");
            res.redirect("/listings");
        })
    }
    catch(e){
        req.flash("error", e.message);
        res.redirect("/signup");
    }
    
};

module.exports.renderLoginForm = (req,res)=>{
    res.render("users/login.ejs");
};

module.exports.login = async (req,res)=>{
    req.flash("success","Welcome back to Wanderlust!");
    let redirectUrl = res.locals.redirectUrl || "/listings";     // if redirectUrl is empty, we go to /listings
    console.log(redirectUrl);
    res.redirect(redirectUrl);
};

module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","You are logged out now");
        res.redirect("/listings");
    })
};