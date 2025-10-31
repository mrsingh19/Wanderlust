const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const usercontroller = require("../controllers/users.js")
router.route("/signup")
.get((req,res)=>{
    res.render("../views/users/signup.ejs");
})
.post(wrapAsync(usercontroller.signup))


router.get("/logout",usercontroller.logout);

router.route("/signin")
.get((req,res)=>{
    res.render("../views/users/signin.ejs");
})
.post(
    saveRedirectUrl,
    passport.authenticate("local",{
        failureRedirect :"/signin",
        failureFlash :true
    }),usercontroller.signin
       );
module.exports = router;
  
