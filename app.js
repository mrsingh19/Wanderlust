const express = require("express");
const app = express();
const mongoose = require("mongoose");
const PORT = 3001;
MONGO_URL = "mongodb://127.0.0.1:27017/WanderLust";
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride= require("method-override");
const ejsMate = require("ejs-mate");





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

//index route 
app.get("/listings",async (req,res)=>{
   const allListings = await  Listing.find({});
   res.render("listings/index.ejs",{allListings});

})
//create route 
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");

});
app.post("/listings",async(req,res)=>{
const newListing = new  Listing(req.body.listing);

 
await newListing.save();
// to create a. new document in the mongoose memory 
res.redirect("/listings");

});


//show route 
app.get("/listings/:id",async(req,res)=>{
let {id} = req .params;
 const listing = await Listing.findById(id);
res.render("listings/show.ejs",{listing});

});
//edit route 
app.get("/listings/:id/edit",async(req,res)=>{
let {id} = req.params;
// console.log("working");
let details = await Listing.findById(id);
res.render("listings/edit.ejs",{details})

});



//update route 
app.put("/listings/:id",async (req,res)=>{
let{id}=req.params;
await Listing.findByIdAndUpdate(id,{...req.body.listing});
res.redirect(`/listings/${id}`);


})



//delete route 
app.delete("/listings/:id",async (req,res)=>{
    let{id}=req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
})




app.listen(PORT,()=>{
    console.log(`server is listening on port ${PORT}`);
});