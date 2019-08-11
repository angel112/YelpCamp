var mongoose = require('mongoose'),
    Campground = require('./models/campground'),
    Comment = require('./models/comment');


var data = [
    {
        name: "Willows Creek",
        image: "https://images.unsplash.com/photo-1497900304864-273dfb3aae33?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80",
        description: "Offers campgrounds in thirteen state parks or forests with over 1400 campsites. Camping areas can be found in a variety setting including shadowy woodlands, sandy shoreline beaches and secluded islands."
    },
    {
        name: "Cloud's Rest",
        image: "http://visitmckenzieriver.com/oregon/wp-content/uploads/2015/06/paradise_campground.jpg",
        description: "Year-round cabins, cottages and campgrounds in Delaware State Parks are perfect for getting away no matter the season. Or try a rustic tent site or equestrian site. Don't forget to book a ghost tour at Fort Delaware!"
    },
    {
        name: "Canyon Floor",
        image: "https://img.sunset02.com/sites/default/files/image/2016/09/main/camping-arches.jpg",
        description: "Manages state parks with camping, hiking, swimming, walking and bike riding and more. There are opportunities for picnics, outdoor performances, areas available for company or family gatherings, historic sites, skating rinks, playgrounds, athletic fields, interpretive programs and much more."
    }
]
 
function seedDB(){
    Comment.remove({}, function(err, comment){
        if(!err){
            console.log("Deleted all comments")
        }
    });
    Campground.remove({}, function(err){
        if(!err){
            console.log("Removed all database");
            data.forEach(function(seed){
                Campground.create(seed, function(err,campground){
                    if(!err){
                        console.log("Created a Campground");
                        Comment.create(
                            {
                                content: "Wow, this is actually pretty great!!",
                                author: "Dean Henderson"
                            }, function(err, comment){
                                if(err){
                                    console.log(err);
                                }
                                else{
                                    campground.comments.push(comment);
                                    campground.save();
                                    console.log("Created New Comment");
                                }
                                
                            }
                        );
                    }
                });
                
            })
        }
    });
}

module.exports = seedDB;



