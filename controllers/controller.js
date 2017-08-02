var express = require('express');
var path = require('path');
var db = require("../models");

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
    })
  })
}

