const express = require("express");
const app = express();
const mongoose = require("mongoose");
const PORT = 3001;
MONGO_URL = "mongodb://127.0.0.1:27017/WanderLust";
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");

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
  await mongoose.connect(MONGO_URL);
}

app.get("/", (req, res) => {
  res.send("Hey its working");
});

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

app.use("/listings", listings);

//reviews

app.use("/listings/:id/reviews", reviews);

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
