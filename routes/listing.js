const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError= require("../utils/ExpressError.js");
const {listingSchema}= require("../schema");
const Listing = require("../models/listing.js");




const validateListing = (req,res,next) =>{
    let {error} = listingSchema.validate(req.body);
        
        if(error){
            throw new ExpressError(400,error);
        }else{
            next();
        }
};

//index listing
router.get("/",wrapAsync(async (req,res)=>{
   const allListings = await  Listing.find({});
   res.render("listings/index.ejs",{allListings});

}));
//create listing

router.get("/new",(req,res)=>{
    res.render("listings/new.ejs");

});
//post listing
router.post("/",
    validateListing,
    wrapAsync(async(req,res,next)=>{
        
    const newListing = new  Listing(req.body.listing);
    await newListing.save();
       // to create a. new document in the mongoose memory 
    res.redirect("/listings");


})
);
//update

router.put("/:id",validateListing,
    wrapAsync(async (req,res)=>{
let{id}=req.params;
await Listing.findByIdAndUpdate(id,{...req.body.listing});
res.redirect(`/listings/${id}`);


}));

//show route 
router.get("/:id",wrapAsync(async(req,res)=>{
let {id} = req .params;
 const listing = await Listing.findById(id).populate("reviews");
res.render("listings/show.ejs",{listing});

}))
;
//edit route 
router.get("/:id/edit",wrapAsync(async(req,res)=>{
let {id} = req.params;
// console.log("working");
let details = await Listing.findById(id);
res.render("listings/edit.ejs",{details})

}))
;

//delete listing
router.delete("/:id",wrapAsync(async (req,res)=>{
    let{id}=req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));

module.exports = router;
