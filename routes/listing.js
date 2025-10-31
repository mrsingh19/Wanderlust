const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const{storage} = require("../cloudConfig.js");
const multer= require("multer");

const upload = multer({storage})
router
  .route("/")
  //index listing
  .get(wrapAsync(listingController.index))
  // post listing
  .post(
    isLoggedIn,
    validateListing,
    upload.single('listing[image]'),
    wrapAsync(listingController.createListing)
  );
 
//create listing new Route
router.get("/new", isLoggedIn, listingController.renderNewForm);

router
  .route("/:id")
  //update
.put(upload.single('listing[image]'),validateListing
  , wrapAsync(listingController.updateListing))
//show route
  .get(wrapAsync(listingController.showListing))
  //delete listing
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));
//edit route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);

module.exports = router;
