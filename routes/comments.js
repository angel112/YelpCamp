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

function isAuthorized(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                res.redirect("back");
            }else{
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                }
                else{
                    res.send("YOU DO NOT HAVE PERMISSION TO DO THIS!!");
                }
            }
        })
    }else{
        res.redirect("/login");
    }
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

router.get("/comment/:comment_id/edit", isAuthorized, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.render("back");
        }else{
            res.render("editComment", {camp_id: req.params.id, comment: foundComment});
        }
    });
});

router.put("/comment/:comment_id", isAuthorized, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.render("back");
        }else{
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

router.delete("/comment/:comment_id", isAuthorized, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            console.log(err);
            res.render("back");
        }else{
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
})

module.exports = router;