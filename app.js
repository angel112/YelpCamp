var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'), 
    mongoose = require('mongoose');
    passport = require('passport'),
    localStrategy = require('passport-local'),

    Campground = require("./models/campground"),
    Comment = require('./models/comment'),
    User = require('./models/user'),
    seedDB = require('./seeds');

seedDB();

mongoose.connect("mongodb://localhost/yelp_camp", { useNewUrlParser: true });
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.use(require('express-session')({
    secret: "I love Football!",
    resave: false,
    saveUninitialized: false
}));

//PASSPORT CONFIGURATION
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

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

//AUTH ROUTES

//registration
app.get("/register", function(req,res){
    res.render("register");
})

app.post("/register", function(req,res){
    var newUser = new user({username: req.body.username});
    User.register(newUser, req,body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/campgrounds");
        });
    });
});

//Login Routes

app.get("/login", function(req, res){
    res.render("login");
});

app.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req, res){

});




app.listen(3000, function(req, res){
    console.log("Yelp Camp Server has Started");
});