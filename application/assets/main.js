(async () => {
	////
	// Google map
	const mapElement = document.getElementById('map');
	const map = new google.maps.Map(mapElement, {
	  disableDefaultUI: true,
	  center: {lat: 37.7717378, lng: -122.4436925}, // hardcoded to sf
	  zoom: 12,
	});

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


	$('#find-path-button').click(function () {
		if (from_input.place && to_input.place) {
			document.getElementById("map").classList.remove("blured");
			document.getElementById("overlay").classList.remove("welcome");
			document.getElementById("overlay").classList.add("travel");

			const from_location = from_input.place.geometry.location;
			const to_location = to_input.place.geometry.location;

			console.log(`from_location lat:${from_location.lat()} lng:${from_location.lng()}`)
			console.log(`to_location lat:${to_location.lat()} lng:${to_location.lng()}`)
		}
	});

	// coordinates
	var flightPlanCoordinates = [
          {lat: 37.772, lng: -122.214},
          {lat: 21.291, lng: -157.821},
          {lat: -18.142, lng: 178.431},
          {lat: -27.467, lng: 153.027}
        ];

    // var flightPath = new google.maps.Polyline({
    //       path: flightPlanCoordinates,
    //       geodesic: true,
    //       strokeColor: '#FF0000',
    //       strokeOpacity: 1.0,
    //       strokeWeight: 2
    //     });

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
})();
