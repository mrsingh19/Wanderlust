const express = require("express");
const router = express.Router({mergeParams:true});
const Review = require("../models/review.js");

const wrapAsync = require("../utils/wrapAsync.js");

const { validateReview, isLoggedIn,  isReviewAuthor } = require("../middleware.js");

const reviewController = require("../controllers/reviews")


     

//reviews

router.post("/",validateReview,isLoggedIn,wrapAsync(reviewController.createReview));

//delete reviews

router.delete("/:reviewId",
    isLoggedIn,
    isReviewAuthor,
    wrapAsync(reviewController.destroyReview));
module.exports = router;