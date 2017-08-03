var express = require('express');
var path = require('path');
var db = require("../models");

// //var yelpKeys = require("../keys.js");
var clientId = "hJTs4aH6YHynYF8rdi6ZjQ"; //yelpKeys.client_id;
var clientSecret = "XN8tUhZimsNEfJf7DcqHdC7tlKcyVynLTFfvRHPTWKNTdcorBAT4Qkf0tfOrNz9P";//yelpKeys.client_secret;
var access_token = "i44_b1FWonULXl_sfnQrUS14Ond-Oag84uu2IkXzps7bYQcWKs26_d__PqMRAZeSf5U09f6Rd1hZmnPjIJO0Ztg_q5txfJnrgpqYchqI5ohOji8lY_FnzvIo9_2AWXYx";//yelpKeys.Authorization;

module.exports = function(app) {
  app.get("/survey", function(req, res) {
    res.sendFile(path.join(__dirname, "/../views/test.html"));
  });

  app.get("/api/users", function(req,res){
    db.Answers.findAll({}).then(function(dbAnswers) {
      res.json(dbAnswers);
    });
  });

  app.post("/api/users", function(req, res) {
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
      if (userSplit.length > 1) {
        for (i = 0 ; i < userSplit.length ; i++) {
          if (i >= 0 && i < userSplit.length -1) {
            var yelp_term = "";
            yelp_term += userSplit[i]
            yelp_term += "+"
          } else {
            yelp_term += userSplit[i]
          }
        }
      } else {
        yelp_term = userSplit[0]
      }
      console.log("this is yelp: " + yelp_term)

      var Yelp = require('yelp-api-v3');
      var yelp = new Yelp({
        app_id: clientId,
        app_secret: clientSecret
      });
      console.log(yelp_term);
      console.log(dbAnswers.lat);
      console.log(dbAnswers.lng);
      // https://github.com/Yelp/yelp-api-v3/blob/master/docs/api-references/businesses-search.md
      yelp.search({term: yelp_term, latitude: dbAnswers.lat, longitude: dbAnswers.lng, price: '1', limit: 1})
      .then(function (data) {
          console.log(data);
          // console.log(data[0].rating);
          // console.log(data[0].price);
          // //console.log(data.location.display_address);
          // console.log(data[0].display_phone);
      })
      .catch(function (err) {
          console.error(err);
      });


      console.log("=====userSplit=====")
      console.log(userSplit)
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
            } else {
              console.log("no available meal buddies")
            }
          })
        }
    })
  })


}
