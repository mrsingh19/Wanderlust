if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
    
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const PORT = 3001;
// MONGO_URL = "mongodb://127.0.0.1:27017/WanderLust";
const dburl = process.env.ATLASDB_URL;

const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const session  = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport  = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const userRouter = require("./routes/user.js")






app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
//connecting data base
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));
main()
.then(() => {
    console.log("Connected to DB");
})
.catch((err) => {
    console.log(err);
});
async function main() {
    await mongoose.connect(dburl);
}

const store = MongoStore.create({
    mongoUrl:dburl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,
    
});
store.on("error",() =>{
    console.log("error in mongo session store",err);
});
const sessionOptions = {
    store,
    secret:process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires : Date.now() + 7 * 24 *60*60 *1000,
        maxAge: 7* 24*60*60*1000,
        httpOnly: true,
    }
     
};


app.get("/", (req, res) => {
    console.dir(req.cookies);
    res.redirect("/listings");
    
});


app.use(session(sessionOptions));
app.use(flash());

//passport is used after session middle ware
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

//demo users

// app.get("/demouser",async (req,res)=>{
// let fakeUser = new User({
//     email:"student@gmail.com",
//     username:"first-student"
// });
//  let registeredUser =await User.register(fakeUser,"helloworld");
// res.send(registeredUser);


// })




// app.get("/testListing",async(req,res)=>{
//     let sampleListing = new Listing({
//         title: "My New Villa",
//         description: "By the beach",
//         price:2000,
//         location:"calangute ,Goa",
//         country:"India",
// });
// await sampleListing.save();
// console.log("sample was saved");
// res.send("successfull ");
// });

app.use("/listings", listingRouter);

//reviews

app.use("/listings/:id/reviews", reviewRouter);

app.use("/",userRouter);

//index route
// app.get("/listings",wrapAsync(async (req,res)=>{
//    const allListings = await  Listing.find({});
//    res.render("listings/index.ejs",{allListings});

// }));

//create route
// app.get("/listings/new",(req,res)=>{
//     res.render("listings/new.ejs");

// });
// app.post("/listings",
//     validateListing,
//     wrapAsync(async(req,res,next)=>{

//     const newListing = new  Listing(req.body.listing);
//     await newListing.save();
//        // to create a. new document in the mongoose memory
//     res.redirect("/listings");

// })
// );

//update route

//delete route
// app.delete("/listings/:id",wrapAsync(async (req,res)=>{
//     let{id}=req.params;
//     await Listing.findByIdAndDelete(id);
//     res.redirect("/listings");
// }));

//review delete route

app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "SomethingWentWrong" } = err;
  res.status(statusCode).render("error.ejs", { err });
});

app.listen(PORT, () => {
  console.log(`server is listening on port ${PORT}`);
});
