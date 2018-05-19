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


	$('#test-button').click(function () {
		if (from_input.place && to_input.place) {
			document.getElementById("map").classList.remove("blured");
			document.getElementById("welcome").classList.add("element_hidden");

			const from_location = from_input.place.geometry.location;
			const to_location = to_input.place.geometry.location;

			console.log(`From lat:${from_location.lat()} lng:${from_location.lng()}`)
			console.log(`From lat:${to_location.lat()} lng:${to_location.lng()}`)
		}
	});
})();
