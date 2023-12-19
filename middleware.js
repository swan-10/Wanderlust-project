const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema, reviewSchema} = require("./schema.js");
const wrapAsync = require("./utils/wrapAsync.js");

module.exports.validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,error);
    }
    else{
        next();     // goes to create review route
    }
}

module.exports.validateListing = (req,res,next)=>{
    console.log(req.body);
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,error);
    }
    else{
        next();     // goes to create/update route
    }
};

module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){                 // check if user is logged in
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","You must be logged in to create listing");
        res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = wrapAsync(async (req,res,next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    // console.log("YAAAAAAAAH : ",res.locals.currUser._id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error","You dont have permission to edit");
        return res.redirect(`/listings/${id}`);
    }

    next();
})

module.exports.isReviewAuthor = wrapAsync(async (req,res,next)=>{
    let {id, reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","You are not the author of this review");
        return res.redirect(`/listings/${id}`);
    }

    next();
})