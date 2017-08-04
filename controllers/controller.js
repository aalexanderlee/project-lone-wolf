var express = require('express');
var path = require('path');
var db = require("../models");
var Yelp = require('yelp-api-v3');


var clientId = "hJTs4aH6YHynYF8rdi6ZjQ"; 
var clientSecret = "XN8tUhZimsNEfJf7DcqHdC7tlKcyVynLTFfvRHPTWKNTdcorBAT4Qkf0tfOrNz9P";
var access_token = "i44_b1FWonULXl_sfnQrUS14Ond-Oag84uu2IkXzps7bYQcWKs26_d__PqMRAZeSf5U09f6Rd1hZmnPjIJO0Ztg_q5txfJnrgpqYchqI5ohOji8lY_FnzvIo9_2AWXYx";


// function yelpAPI (arr, response) {
//   if (arr.length > 1) {
//       var yelp_term = "";
//       for (i = 0 ; i < arr.length ; i++) {
//         if (i >= 0 && i < arr.length - 1) {
//           yelp_term += arr[i] + "+"
//           console.log("this is yelp_connecting: " + yelp_term)
//         } else {
//           yelp_term += arr[i]
//         }
//       }
//     } else {
//       yelp_term = arr[0]
//     }
//     console.log("this is yelp_done: " + yelp_term)

//     var yelp = new Yelp({
//       app_id: clientId,
//       app_secret: clientSecret
//     });
//     // https://github.com/Yelp/yelp-api-v3/blob/master/docs/api-references/businesses-search.md
//     yelp.search({term: yelp_term, latitude: response.lat, longitude: response.lng, price: response.price, limit: 5})
//     .then(function (data) {
//         console.log(data);
//         console.log(typeof(data));
//         var dataObj = JSON.parse(data);
//         for (i = 0 ; i < 5 ; i++) {
//           console.log(dataObj.businesses[i].name)
//           console.log(dataObj.businesses[i].image_url)
//           console.log(dataObj.businesses[i].rating)
//           console.log(dataObj.businesses[i].location.display_address)
//           console.log(dataObj.businesses[i].display_phone)
//         }
//     })
//     .catch(function (err) {
//         console.error(err);
//     });
// }

function yelpAPI (arr, response) {
  for (i = 0 ; i < arr.length ; i++) {
    var yelp = new Yelp({
      app_id: clientId,
      app_secret: clientSecret
    });
    // https://github.com/Yelp/yelp-api-v3/blob/master/docs/api-references/businesses-search.md
    var limitNum = 3 
    yelp.search({term: arr[i], latitude: response.lat, longitude: response.lng, price: response.price, limit: limitNum})
    .then(function (data) {
      console.log(data);
      console.log(typeof(data));
      var dataObj = JSON.parse(data);
        for (j = 0 ; j < limitNum ; j++) {
          console.log(dataObj.businesses[j].name)
          console.log(dataObj.businesses[j].image_url)
          console.log(dataObj.businesses[j].rating)
          console.log(dataObj.businesses[j].location.display_address)
          console.log(dataObj.businesses[j].display_phone)
        }
      })
    .catch(function (err) {
      console.error(err);
    });
  }
}

module.exports = function(app) {
  app.get("/survey", function(req, res) {
    res.sendFile(path.join(__dirname, "/../views/test.html"));
  });

  app.get("/api/answers", function(req,res){
    db.Answers.findAll({}).then(function(dbAnswers) {
      res.json(dbAnswers);
    });
  }); 

  app.post("/api/answers", function(req, res) {
    console.log("inside post route")
    console.log(req.body)
    db.Answers.create({
      email: req.body.email, 
      user_gender: req.body.user_gender, 
      birthday: req.body.birthday, 
      date: req.body.date, 
      lat: req.body.lat, 
      lng: req.body.lng,
      time: req.body.time,
      age: req.body.age,
      gender: req.body.gender,
      cuisine: req.body.cuisine,
      price: req.body.price
    }).then(function(dbAnswers) {
        res.json(dbAnswers);
        var commonArr = []; 
        var userSplit = dbAnswers.cuisine.split(";")
        console.log("=====userSplit=====")
        console.log(userSplit)
        yelpAPI(userSplit, dbAnswers); 

        if (dbAnswers.gender === "no preference") {
          console.log("====findAll======")
          db.Answers.findAll({
            where: {
              email: {
                $not: dbAnswers.email 
              }, 
              birthday: dbAnswers.age, 
              date: dbAnswers.date,
              lat: dbAnswers.lat, 
              lng: dbAnswers.lng,  
              time: dbAnswers.time, 
              price: dbAnswers.price  
            }   
          }).then(function(results) {
              console.log("=========results==========")

              if (results.length > 0) {
                for (i = 0 ; i < results.length ; i++) {
                  console.log(results[i].dataValues)
                  var otherSplit = results[i].dataValues.cuisine.split(";")
                  for (j = 0 ; j < otherSplit.length ; j++) {
                    if (userSplit.indexOf(otherSplit[j]) >= 0) {
                      commonArr.push(results[i].dataValues)
                    }
                  }
                }
                console.log("======commonArr========")
                console.log(commonArr)

              var randomNumber = Math.floor(Math.random()*commonArr.length); 
              var selected = commonArr[randomNumber]; 
              console.log("this is the randomNumber: " + randomNumber)
              console.log("==============selected==============")
              console.log(selected); 
              db.Plans.create({
                user_id: results[0].dataValues.id, 
                match_id: selected.id, 
                date: selected.date, 
                lat: selected.lat, 
                lng: selected.lng, 
                time: selected.time, 
                cuisine: selected.cuisine, 
                price: selected.price 
              }).then(function(results) {
                console.log("=========plans=======")
                console.log(results.dataValues)
              })

              } else {
                console.log("no available meal buddies")
              }

          })
        } else {
          console.log("====findAll======")
          db.Answers.findAll({
            where: {
              email: {
                $not: dbAnswers.email 
              }, 
              birthday: dbAnswers.age, 
              date: dbAnswers.date,
              lat: dbAnswers.lat, 
              lng: dbAnswers.lng,  
              time: dbAnswers.time,
              price: dbAnswers.price, 
              user_gender: dbAnswers.gender  
            }   
          }).then(function(results) {
            console.log("=========results===========")
            if (results.length > 0) {
             for (i = 0 ; i < results.length ; i++) {
                console.log(results[i].dataValues)
                var otherSplit = results[i].dataValues.cuisine.split(";")
                for (j = 0 ; j < otherSplit.length ; j++) {
                  if (userSplit.indexOf(otherSplit[j]) >= 0) {
                    commonArr.push(results[i].dataValues)
                  }
                }
              }
              console.log("======commonArr========")
              console.log(commonArr)
              var randomNumber = Math.floor(Math.random()*commonArr.length); 
              console.log("this is the random number: " + randomNumber)
              var selected = commonArr[randomNumber]; 
              console.log("================selected=================")
              console.log(selected);    
              db.Plans.create({
                user_id: results[0].dataValues.id, 
                match_id: selected.id, 
                date: selected.date, 
                lat: selected.lat, 
                lng: selected.lng, 
                time: selected.time, 
                cuisine: selected.cuisine, 
                price: selected.price 
              }).then(function(results) {
                console.log("=========plans=======")
                console.log(results.dataValues)
              })
            } else {
              console.log("no available meal buddies")
            }
          })
        }
    })
  })
  

}

