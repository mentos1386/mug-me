(async () => {
	// Hardcoded intial location to SF
	const position = {lat: 37.7717378, lng: -122.4436925};

	////
	// Getting user location
	// new Promise((resolve, reject) => {
	// 	navigator.geolocation.getCurrentPosition(resolve, reject)
	// }).then(pos => {
	// 	console.log("Found user location", pos);
	// 	position = {
	// 		lat: pos.coords.latitude,
	// 		lng: pos.coords.longitude,
	// 	}
	// })

	////
	// Google map
	const mapElement = document.getElementById('map');

	const map = new google.maps.Map(mapElement, {
	  center: position,
	  zoom: 12
	});
})();
