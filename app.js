if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose  = require("mongoose");
const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema} = require("./schema.js");
const {reviewSchema} = require("./schema.js");
const { ValidationError } = require('joi');
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

//routing
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js")
const userRouter = require("./routes/user.js")


app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));       // for req.params 
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname, "/public")));       //   /public/css


// const mongourl = 'mongodb://127.0.0.1:27017/wanderlust';
const dbUrl = process.env.ATLASDB_URL;


const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto:{
        secret: process.env.SECRET,
    },
    touchAfter: 24*3600,        // user will have to login again after 24hrs of no use
                                // ttl is set to default(14 days) 
});

store.on("error",()=>{
    console.log("ERROR IN MONGO SESSION STORE", err);
})

const sessionoptions = {
    store: store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7*24*60*60*1000,  // no. of milliseconds in 7 days
        maxAge: 7*24*60*60*1000,
        httpOnly: true,     // to prevent cross-srcipting attacks

    }
};


app.use(session(sessionoptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})



main()
.then(()=>{
    console.log("connected to server");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);
}

app.listen(8080, ()=>{
    console.log("server listening to port 8080");
});


// ------------------------------------------------------------------- //


// app.get("/",(req,res)=>{
//     res.send("homepage");
// })


//listings
app.use("/listings",listingRouter);  // we are using routing here. we swapped out all the /listings routes with this 1 line
//reviews
app.use("/listings/:id/reviews",reviewRouter);

app.use("/",userRouter);




//error handling
app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not found"));
})

app.use((err,req,res,next)=>{               // it also catches the errors i do in code and displays them on website
    let {statusCode = 500, message = "something went wrong"} = err;
    console.log(err,"ERRORRRRRR");
    res.status(statusCode).render("error.ejs",{err});
})

//-------------------------------------------------------

// I want to get the status code right. Its always sending the default status code that i set

// I want to do something about invalid Id sent in URL