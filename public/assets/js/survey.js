var today = moment().format("YYYY-MM-DD")
console.log(today)
var future = moment().add(0.5, "years").format("YYYY-MM-DD")
console.log(future)

$("#calendar").html( "<input type='date' class='form-control' id='date' name='date' min=" + today + " max=" + future + ">")


var placeSearch, autocomplete;
var componentForm = {
  street_number: 'short_name',
  route: 'long_name',
  locality: 'long_name',
  administrative_area_level_1: 'short_name',
  country: 'long_name',
  postal_code: 'short_name'
};
 
var directionsService;
var directionsDisplay;
var directionDisplay2; 

function initAutocomplete() {
  // Create the autocomplete object, restricting the search to geographical
  // location types.
  options = {
      types: ['(cities)'],
      componentRestrictions: { country: "us" }
    }

  autocomplete = new google.maps.places.Autocomplete(
      /** @type {!HTMLInputElement} */(document.getElementById('location')), options);
}

// Bias the autocomplete object to the user's geographical location,
// as supplied by the browser's 'navigator.geolocation' object.
function geolocate() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var geolocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      var circle = new google.maps.Circle({
        center: geolocation,
        radius: position.coords.accuracy
      });
      autocomplete.setBounds(circle.getBounds());
    });
  }
}

function coordConvert () {
  var location = $("#location").val().trim()
  var queryURL = "https://maps.googleapis.com/maps/api/geocode/json?address=" + location + "&key=AIzaSyA3zxPOYEjaZFkWhGi4WRjUVWXXXF7GRUA"


  $.ajax({
          url: queryURL,
          method: "GET"       
        })
        .done(function(response) {
          lat = response.results[0].geometry.location.lat
          lng = response.results[0].geometry.location.lng

          var cuisineParser = function (foodOptions) {
            var str = foodOptions.join(';')
            return str
          }

          var cusineParsed = cuisineParser($("#q4").val()); 

          var user = {
            email: $("#email").val().trim(),
            user_gender: $("#gender").val().trim(), 
            birthday: $("#birthday").val().trim(), 
            date: $("#date").val().trim(),
            lat: parseFloat(lat.toFixed(3)), 
            lng: parseFloat(lng.toFixed(3)),
            time: $("#q1").val(),
            age: $("#q2").val(),
            gender: $("#q3").val(),
            cuisine: cusineParsed,
            price: $("#q5").val() 
          }; 

          console.log(user)

          $.post("/api/users", user, function(data) {
           
        });
  });
}


 $("#submit").on("click", function(event) {
    event.preventDefault(); 
    var validate = true
    // !$("#id") because the value is null not "" 
    for(i = 1; i < 6 ; i++) {
      if(!$("#q"+ i).val()) {
        validate = false
      } 
    }
    if ($("#email").val() === "" || $("#gender").val() === "" || $("#age").val() === "" || $("#date").val() === "" || $("#location").val() === "" || validate === false) {
      alert("Please Fill Out All Fields"); 
    }
    else 
    {
      event.preventDefault();
      coordConvert()
    }

  })
