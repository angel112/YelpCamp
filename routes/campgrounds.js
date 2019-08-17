var express = require("express"),
  router = express.Router(),
  Campground = require("../models/campground");

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

function isAuthorized(req, res, next) {
  if (req.isAuthenticated()) {
    Campground.findById(req.params.id, function(err, foundCamp) {
      if (err) {
        res.redirect("back");
      } else {
        if (foundCamp.author.id.equals(req.user._id)) {
          next();
        } else {
          res.send("YOU DO NOT HAVE PERMISSION TO DO THIS!!");
        }
      }
    });
  } else {
    res.redirect("back");
  }
}

router.get("/", function(req, res) {
  Campground.find({}, function(err, allCampgrounds) {
    if (err) {
      console.log(err);
    } else {
      res.render("campgrounds", { campgrounds: allCampgrounds });
    }
  });
});

router.get("/new", isLoggedIn, function(req, res) {
  res.render("newCamp");
});

router.post("/", isLoggedIn, function(req, res) {
  var author = {
    id: req.user._id,
    username: req.user.username
  };
  req.body.camp.author = author;
  Campground.create(req.body.camp, function(err, allCampground) {
    if (err) {
      console.log(err);
    } else {
      console.log("NEWLY CREATED CAMPGROUNDS: ");
      console.log(allCampground);
    }
  });
  res.redirect("/campgrounds");
});

router.get("/:id", function(req, res) {
  Campground.findById(req.params.id)
    .populate("comments")
    .exec(function(err, foundCamp) {
      if (err) {
        console.log(err);
      } else {
        res.render("show", { camp: foundCamp });
      }
    });
});

router.get("/:id/edit", isAuthorized, function(req, res) {
  Campground.findById(req.params.id, function(err, foundCamp) {
    if (err) {
      console.log(err);
      res.redirect("/campgrounds");
    } else {
      res.render("editCamp", { camp: foundCamp });
    }
  });
});

router.put("/:id", isAuthorized, function(req, res) {
  Campground.findByIdAndUpdate(req.params.id, req.body.camp, function(
    err,
    updatedCamp
  ) {
    if (err) {
      console.log(err);
      res.redirect("/campgrounds");
    } else {
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

router.delete("/:id", isAuthorized, function(req, res) {
  Campground.findByIdAndRemove(req.params.id, function(err) {
    if (err) {
      console.log(err);
      res.redirect("/campgrounds");
    } else {
      console.log("Campground Deleted");
      res.redirect("/campgrounds");
    }
  });
});

module.exports = router;
