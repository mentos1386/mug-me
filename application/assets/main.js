(async () => {

    var locations = {
        origin: "",
        destination: ""
    };
	////
	// Google map
	const mapElement = document.getElementById('map');
	function initialize() {
        // initializing some variables here
        // *****
        var jsonObj;
        var routes = [];
        var legs = [];
        var origin_place_id = null;
        var destination_place_id = null;
        var travel_mode = google.maps.TravelMode.WALKING;

        const map = new google.maps.Map(mapElement, {
          disableDefaultUI: true,
          center: {lat: 37.7717378, lng: -122.4436925}, // hardcoded to sf
          zoom: 12,
        });

        // Configurations for Marker on the map
        var marker = new google.maps.Marker({
            position: latlng,
            url: '/',
            // So this is the effing animation for the marker
            animation: google.maps.Animation.DROP
        });

        var directionsService = new google.maps.DirectionsService;
        var directionsDisplay = new google.maps.DirectionsRenderer;



        var origin_input = document.getElementById('origin-input');
        var destination_input = document.getElementById('destination-input');

        var buttonSearch = document.getElementById('Search');

        // Display elements on the webpage
        marker.setMap(map);
        directionsDisplay.setMap(map);



        // If the search button is clicked
        buttonSearch.addEventListener('click', function() {
            marker.setMap(null);

            var origin = locations['origin'];
            var destination = locations['destination'];
            var API_KEY = "AIzaSyCIL4iv4nUrjD8ZhnzayE3G_4aOK0xNas8";
            var url = "https://maps.googleapis.com/maps/api/directions/json?origin=place_id:" + origin
                        + "&destination=place_id:" + destination + "&key=" + API_KEY;
            var url2 = "https://maps.googleapis.com/maps/api/directions/json";
            var params = {
                    origin: origin,
                    destination: destination,
                }


            $.getJSON($SCRIPT_ROOT + '_search1', params, function (data) {
                jsonObj = data;
                var waypoints =[];

                service = new google.maps.places.PlacesService(map);


                    for (var i = 0; i < jsonObj['geocoded_waypoints'].length; i++) {
                        console.log(jsonObj['geocoded_waypoints'][i]['place_id']);
                        service.getDetails({
                            placeId: jsonObj['geocoded_waypoints'][i]['place_id']
                        }, function(place, status) {
                            console.log(status);
                            if (status == google.maps.places.PlacesServiceStatus.OK) {
                                waypoints.push({
                                    location: {
                                        lat: place.geometry.location.lat(),
                                        lng: place.geometry.location.lng()
                                    },
                                    stopover: false
                                });

                                route(origin, destination, travel_mode,
                                      directionsService, directionsDisplay, waypoints);
                            }
                        });

                        if (i == jsonObj['geocoded_waypoints'].length - 1) {
                            console.log("Done");
                        }
                    }
            })
        });


         // Event handler for Google Map
        google.maps.event.addListener(marker, 'click', function() {
            map.setZoom(10);
            map.setCenter(marker.getPosition());
        });

        // Functions
        function expandViewportToFitPlace(map, place) {
            if (place.geometry.viewport) {
                // console.log("success");
                map.fitBounds(place.geometry.viewport);
            } else {
                // console.log("failed");
                map.setCenter(place.geometry.viewport);
                map.setZoom(17);
            }
        }

        function route(origin_place_id, destination_place_id, travel_mode,
                 directionsService, directionsDisplay, waypoints) {
            if (!origin_place_id || !destination_place_id || waypoints.length < jsonObj['geocoded_waypoints'].length) {
                return;
            }

            if (waypoints) {
                request = {
                    origin: {'place_Id': origin_place_id},
                    destination: {'place_Id': destination_place_id},
                    waypoints: waypoints,
                    optimizeWaypoints: true,
                    travelMode: travel_mode
                }
            } else {
                request = {
                    origin: {'place_Id': origin_place_id},
                    destination: {'place_Id': destination_place_id},
                    travelMode: travel_mode
                }
            }

            directionsService.route(request, function(response, status) {
                    console.log(waypoints);
                    if (status === google.maps.DirectionsStatus.OK) {
                        directionsDisplay.setDirections(response);
                    } else {
                        window.alert('Directions request failed due to ' + status);
                    }
            });
        }


	////
	// Search Autocomplete
	class FormAutoComplete {
		constructor(elementId) {
			this.element = document.getElementById(elementId);
			this.autocomplete = new google.maps.places.Autocomplete(this.element);

		    this.autocomplete.addListener('place_changed', () => {
				const place = this.autocomplete.getPlace();

				if (!place.geometry) {
					console.log("set wrong input on form!!");
					return;
				}

				// If the place has a geometry, then present it on a map.
				if (place.geometry.viewport) {
					map.fitBounds(place.geometry.viewport);
				} else {
					map.setCenter(place.geometry.location);
					map.setZoom(17);  // Why 17? Because it looks good.
				}

				this.place = place;
		    });
		}
	}

	const to_input = new FormAutoComplete('to-direction')
	const from_input = new FormAutoComplete('from-direction')

	// travel
	const to_input_travel = new FormAutoComplete('to-direction-travel')
	const from_input_travel = new FormAutoComplete('from`-direction-travel')


	$('#test-button').click(function () {
		if (from_input.place && to_input.place) {
			document.getElementById("map").classList.remove("blured");
			document.getElementById("welcome").classList.add("element_hidden");
			document.getElementById("travel").classList.remove("element_hidden");


			const from_location = from_input.place.geometry.location;
			const to_location = to_input.place.geometry.location;

			console.log(`from_location lat:${from_location.lat()} lng:${from_location.lng()}`)
			console.log(`to_location lat:${to_location.lat()} lng:${to_location.lng()}`)
		}
	});
})();