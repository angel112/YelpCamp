var express = require('express'),
    router = express.Router({mergeParams: true}),
    Campground = require('../models/campground'),
    Comment = require('../models/comment'),
    User = require('../models/user');

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
} 

router.get("/comment/new", isLoggedIn, function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCamp){
        if(err){
            console.log(err)
        }else{
            res.render("newComment", {camp:foundCamp});
        }
    });
});
    
router.post("/", isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, foundCamp){
        if(err){
            console.log(err);
        }else{
            Comment.create(req.body.comment, function(err, foundComment){
                if(err){
                    console.log(err);
                }
                else{
                    foundComment.author.id = req.user._id;
                    foundComment.author.username = req.user.username;
                    foundComment.save();
                    foundCamp.comments.push(foundComment);
                    foundCamp.save();
                    res.redirect("/campgrounds/" + foundCamp._id);
                }
            })
        }
    })
});

module.exports = router;