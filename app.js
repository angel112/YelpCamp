var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'), 
    mongoose = require('mongoose');
    Campground = require("./models/campground"),
    Comment = require('./models/comment');
    seedDB = require('./seeds');

seedDB();

mongoose.connect("mongodb://localhost/yelp_camp", { useNewUrlParser: true });
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");

app.get("/", function(req, res){
    res.render("home");
});

app.get("/campgrounds", function(req,res){
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        }
        else{
            res.render("campgrounds", {campgrounds:allCampgrounds});
        }
    })
});

app.get("/campgrounds/new", function(req, res){
    res.render("newCamp");
});

app.post("/campgrounds", function(req, res){
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


app.get("/campgrounds/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCamp){
        if(err){
            console.log(err);
        }else{
            res.render("show", {camp:foundCamp});
        }
    });
});

app.get("/campgrounds/:id/comment", function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCamp){
        if(err){
            console.log(err)
        }else{
            res.render("newComment", {camp:foundCamp});
        }
    });
});

app.post("/campgrounds/:id", function(req, res){
    Campground.findById(req.params.id, function(err, foundCamp){
        if(err){
            console.log(err);
        }else{
            Comment.create(req.body.comment, function(err, foundComment){
                if(err){
                    console.log(err);
                }
                else{
                    foundCamp.comments.push(foundComment);
                    foundCamp.save();
                    res.redirect("/campgrounds/" + foundCamp._id);
                }
            })
        }
    })
});


app.listen(3000, function(req, res){
    console.log("Yelp Camp Server has Started");
});