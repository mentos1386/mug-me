var directionsDisplay = [];
var directionsService = new google.maps.DirectionsService();
var map;
var results = [];

var colors = ["#0266C8", "#F90101", "#F2B50F", "#0266C8", "#00933B", "#F90101"];
var lastColor=0;

function initialize() {
    
  directionsDisplay.push(new google.maps.DirectionsRenderer());
  var chicago = new google.maps.LatLng(41.850033, -87.6500523);
  var mapOptions = {
    zoom:7,
    center: chicago
  };
  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
  directionsDisplay[directionsDisplay.length-1].setMap(map);
  calcRoute("San Francisco");
  calcRoute("New York");
}

function calcRoute(address) {
  var start = "1600 Amphitheatre Parkway Mountain View, CA 94043";
  var end = address;
  var request = {
      origin:start,
      destination:end,
      travelMode: google.maps.TravelMode.DRIVING
  };
  directionsService.route(request, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      directionsDisplay.push(new google.maps.DirectionsRenderer());
      var routeNumber = directionsDisplay.length-1;
      directionsDisplay[routeNumber].setMap(map);
      directionsDisplay[routeNumber].setDirections(response);
        
      var steps = response.routes[0].legs[0].steps;
      console.log(steps);
        for (var i =0; i < steps.length; i++){
            document.getElementById("result"+routeNumber).innerHTML += 
                "<li id=result"+routeNumber+"step"+i+">"+steps[i].instructions+"</li>"
        
        }  
        
        
      results.push(steps);
        
      showSharePath();
    } else {
        console.log("fail")
    }
  });
}

function showSharePath(){
    if (results.length==2){
        for (var i=0; i < results[0].length; i++){
            for (var j=0; j < results[1].length; j++){
                console.log(results[0][i].start_location.A);
                if ((results[0][i].start_location.A==results[1][j].start_location.A)&&(results[0][i].start_location.F==results[1][j].start_location.F)){
                    var li1 = document.getElementById('result'+1+"step"+i);
                    var li2 = document.getElementById('result'+2+"step"+j);
                    var color = colors[(lastColor++)%colors.length];
                    li1.style.background = color;
                    li2.style.background = color;
                    
                }
            
            }
        
        }
    }
}

google.maps.event.addDomListener(window, 'load', initialize);