const express = require("express");
const app = express();
const mongoose = require("mongoose");
const PORT = 3001;
MONGO_URL = "mongodb://127.0.0.1:27017/WanderLust";
const path = require("path");
const methodOverride= require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError= require("./utils/ExpressError.js");
const {listingSchema}= require("./schema");//joi validation 
const {reviewSchema}= require("./schema.js")
const Review = require("./models/review.js");
const Listing = require("./models/listing.js");







app.set ("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
//connecting data base 
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));


main()
.then(()=>{
    console.log("Connected to DB");
}).catch ((err)=>{
    console.log(err);
})
async function main(){
    await mongoose.connect(MONGO_URL);

};




app.get("/",(req,res)=>{
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

const validateListing = (req,res,next) =>{
    let {error} = listingSchema.validate(req.body);
        
        if(error){
            throw new ExpressError(400,error);
        }else{
            next();
        }
}

const validateReview = (req,res,next)=>{
    let {error}= reviewSchema.validate(req.body);
    if(error){
        throw new ExpressError(400,error);
    }else{
        next();

    }
}


//index route 
app.get("/listings",wrapAsync(async (req,res)=>{
   const allListings = await  Listing.find({});
   res.render("listings/index.ejs",{allListings});

}));

//create route 
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");

});
app.post("/listings",
    validateListing,
    wrapAsync(async(req,res,next)=>{
        
    const newListing = new  Listing(req.body.listing);
    await newListing.save();
       // to create a. new document in the mongoose memory 
    res.redirect("/listings");


})
);


//reviews

app.post("/listings/:id/reviews",validateReview,wrapAsync(async(req,res,next)=>{

     let id = req.params.id;
    let listing =await  Listing.findById(id);
   


    const newReview = new Review(req.body.review);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    res.redirect(`/listings/${id}`);


}));






//show route 
app.get("/listings/:id",wrapAsync(async(req,res)=>{
let {id} = req .params;
 const listing = await Listing.findById(id).populate("reviews");
res.render("listings/show.ejs",{listing});

}))
;
//edit route 
app.get("/listings/:id/edit",wrapAsync(async(req,res)=>{
let {id} = req.params;
// console.log("working");
let details = await Listing.findById(id);
res.render("listings/edit.ejs",{details})

}))
;



//update route 
app.put("/listings/:id",validateListing,
    wrapAsync(async (req,res)=>{
let{id}=req.params;
await Listing.findByIdAndUpdate(id,{...req.body.listing});
res.redirect(`/listings/${id}`);


}));




//delete route 
app.delete("/listings/:id",wrapAsync(async (req,res)=>{
    let{id}=req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));

//review delete route


app.delete("/listings/:id/reviews/:reviewId",wrapAsync(async(req,res)=>{
    let{id,reviewId} =req.params;
    await Listing.findByIdAndUpdate(id,{$pull: {reviews:reviewId}})
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
}))

app.use((req,res,next)=>{
    next(new ExpressError(404,"Page Not Found"));
});
app.use((err,req,res,next)=>{
    let {statusCode=500,message= "SomethingWentWrong"} = err;
    res.status(statusCode).render("error.ejs",{err});
    
    
})

app.listen(PORT,()=>{
    console.log(`server is listening on port ${PORT}`);
});