(async () => {
	////
	// Google map
	const mapElement = document.getElementById('map');
	const map = new google.maps.Map(mapElement, {
	  center: {lat: 37.7717378, lng: -122.4436925},
	  zoom: 12
	});

	////
	// Search Autocomplete
	const to_input = document.getElementById('to-direction');
	const from_input = document.getElementById('from-direction');
	const autocomplete_to = new google.maps.places.Autocomplete(to_input);
	const autocomplete_from = new google.maps.places.Autocomplete(from_input);

	let to_place = null;
	let from_place = null;

    autocomplete_to.addListener('place_changed', function() {
		var place = autocomplete_to.getPlace();
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

		to_place = place;
    });
    autocomplete_from.addListener('place_changed', function() {
		var place = autocomplete_from.getPlace();
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

		from_place = place;
    });

	$('#test-button').click(function () {
		if (from_place && to_place) {
			document.getElementById("map").classList.remove("blured");
			document.getElementById("overlay").classList.add("element_hidden");
			console.log("Should show path", from_place, to_place)
		}
	});
})();
