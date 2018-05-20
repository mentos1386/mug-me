(async () => {
    const API_KEY = "AIzaSyCIL4iv4nUrjD8ZhnzayE3G_4aOK0xNas8";
    const TRAVEL_MODE = google.maps.TravelMode.WALKING;

	////
	// Google map
	const mapElement = document.getElementById('map');
    const map = new google.maps.Map(mapElement, {
      disableDefaultUI: true,
      center: {lat: 37.7717378, lng: -122.4436925}, // hardcoded to sf
      zoom: 12,
    });

    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer;

    // Display elements on the webpage
    directionsDisplay.setMap(map);

    // Functions
    function expandViewportToFitPlace(map, place) {
        if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
        } else {
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
                origin: {'placeId': origin_place_id},
                destination: {'placeId': destination_place_id},
                waypoints: waypoints,
                optimizeWaypoints: true,
                travelMode: travel_mode
            }
        } else {
            request = {
                origin: {'placeId': origin_place_id},
                destination: {'placeId': destination_place_id},
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

                if (this.shouldFindPath) {
                    findPath()
                }
		    });
		}

        startFindingPath() {
            this.shouldFindPath = true;
        }
	}

    const to_input = new FormAutoComplete('to-direction')
    const from_input = new FormAutoComplete('from-direction')

    /////
    // Find path from origin to destination
    const findPath = () => {
        // if from or to isn't provided, return
        if (!to_input.place || !from_input.place) return;

        const params = {
            origin: from_input.place.place_id,
            destination: to_input.place.place_id,
        }

        $.getJSON(`/_search1`, params, (data) => {
            jsonObj = data;
            var waypoints =[];

            service = new google.maps.places.PlacesService(map);

            jsonObj['geocoded_waypoints'].forEach((waypoint) => {

                service.getDetails({ placeId: waypoint.place_id }, (place, status) => {

                    if (status == google.maps.places.PlacesServiceStatus.OK) {
                        waypoints.push({
                            location: {
                                lat: place.geometry.location.lat(),
                                lng: place.geometry.location.lng()
                            },
                            stopover: false
                        });

                        route(
                            params.origin,
                            params.destination,
                            TRAVEL_MODE,
                            directionsService,
                            directionsDisplay,
                            waypoints);
                    }
                });
            })
        })
    }


	$('#search-button').click(() => {
		if (from_input.place && to_input.place) {
			document.getElementById("map").classList.remove("blured");
			document.getElementById("overlay").classList.add("travel");
			document.getElementById("overlay").classList.remove("welcome");

            from_input.startFindingPath();
            to_input.startFindingPath();

            findPath();
		}
	});

   	let prevLatLang = "";
    flightPlanCoordinates.forEach((value, key) => {
    	const curLatLang  = new google.maps.LatLng(value.lat, value.lng);
	    
	    if(prevLatLang == "")
	        prevLatLang = curLatLang;

        const strokeColor = makeGradientColor(
        	{r:0, g:255, b:204},
        	{r:255, g:0, b:0},
        	((key/flightPlanCoordinates.length)*100));

        console.log(prevLatLang, curLatLang, strokeColor.cssColor);

        const flightPath = new google.maps.Polyline({
	        path: [prevLatLang, curLatLang],
	        geodesic: true,
	        strokeColor: strokeColor.cssColor,
	        strokeOpacity: 1.0,
	        strokeWeight: 2
        });

        prevLatLang = curLatLang;
        flightPath.setMap(map);
    })

    // draw circle at location
    function drawCircle(lat, lng){
        let cityCircle = new google.maps.Circle({
                strokeColor: '#FF0000',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: '#FF0000',
                fillOpacity: 0.35,
                map: map,
                center: {lat, lng},
                radius: 1000
        });
    }
})();
