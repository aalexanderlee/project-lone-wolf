var express = require('express');
var path = require('path');
var db = require("../models");


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

              db.Answers.findAll({
                where: {
                  email: dbAnswers.email
                }
              }).then(function(results) {
                  // console.log(results)
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
              db.Answers.findAll({
                where: {
                  email: dbAnswers.email
                }
              }).then(function(results) {
                  // console.log(results)
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
              })
            } else {
              console.log("no available meal buddies")
            }
          })
        }
    })
  })
  

}

