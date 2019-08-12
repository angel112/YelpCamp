var express = require('express'),
    router = express.Router(),
    Campground = require('../models/campground');


function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
} 

router.get("/", function(req,res){
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        }
        else{
            res.render("campgrounds", {campgrounds:allCampgrounds});
        }
    })
});

router.get("/new", isLoggedIn, function(req, res){
    res.render("newCamp");
});

router.post("/", isLoggedIn, function(req, res){
    Campground.create(req.body.camp, function(err, allCampground){
        if(err){
            console.log(err);
        }
        else{
            console.log("NEWLY CREATED CAMPGROUNDS: ");
            console.log(allCampground);
        }
    });
    res.redirect("/campgrounds");
});


router.get("/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCamp){
        if(err){
            console.log(err);
        }else{
            res.render("show", {camp:foundCamp});
        }
    });
});

module.exports = router;