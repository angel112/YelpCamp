var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

var campgrounds = [
    {name: "Yosemite National Park", image: "https://pixabay.com/get/57e1d3404e53a514f6da8c7dda793f7f1636dfe2564c704c732b72d59744c151_340.jpg"},
    {name: "Shenandoah National Park", image: "https://pixabay.com/get/57e8d1454b56ae14f6da8c7dda793f7f1636dfe2564c704c732b72d4964ec75c_340.jpg"}
]

app.get("/", function(req, res){
    res.render("home");
});

app.get("/campgrounds", function(req,res){
    res.render("campgrounds", {campgrounds: campgrounds});
});

app.get("/campgrounds/new", function(req, res){
    res.render("newCamp");
});

app.post("/campgrounds", function(req, res){
    var name = req.body.name;
    var img = req.body.image;
    var newCamp = {name: name, image: img};
    campgrounds.push(newCamp);
    res.redirect("/campgrounds");
});


app.listen(3000, function(req, res){
    console.log("Yelp Camp Server has Started");
});