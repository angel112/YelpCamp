var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'), 
    mongoose = require('mongoose');
    passport = require('passport'),
    localStrategy = require('passport-local'),
    Campground = require("./models/campground"),
    Comment = require('./models/comment'),
    User = require('./models/user'),
    seedDB = require('./seeds'),
    campgroundRoute = require('./routes/campgrounds'),
    commentRoute = require('./routes/comments'),
    indexRoute = require('./routes/index');

//seedDB();
 
//Database setup
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
app.use(function(req, res, next)
{
    res.locals.currentUser = req.user;
    next();
});

//Routes
app.use("/", indexRoute);
app.use("/campgrounds", campgroundRoute);
app.use("/campgrounds/:id", commentRoute);

//Server
app.listen(3000, function(req, res){
    console.log("Yelp Camp Server has Started");
});