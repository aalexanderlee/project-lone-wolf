var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override')
var db = require("./models");

var app = express();

//Serve static content for the app from the "public" directory in the application directory.
app.use(express.static(process.cwd() + '/public'));

app.use(bodyParser.urlencoded({
	extended: false
}))

require("./controllers/controller")(app);

var port = process.env.PORT || 3000;

db.sequelize.sync({ force: true }).then(function() {
  app.listen(port, function() {
    console.log("App listening on PORT " + port);
  });
});
