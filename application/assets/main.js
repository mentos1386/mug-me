const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoibWVudG9zMTM4NiIsImEiOiJjamhkcmg0ajMwbTdhMzZrZmllYXM0cmhiIn0.sWecb2oJ4lT9KnkbVot8iQ';

(async () => {
	// Hardcoded intial location to SF
	const position = {lat: 37.7717378, lng: -122.4436925};


	////
	// Google map
	L.mapbox.accessToken = MAPBOX_ACCESS_TOKEN;
	const map = L.mapbox.map('map', 'mapbox.streets')
    	.setView([position.lat, position.lng], 13);

	// Create array of lat,lon points.
	var line_points = [
	    [37.7717378, -122.4436925],
	    [37.7717374, -121.4436929],
	];

	// Define polyline options
	// http://leafletjs.com/reference.html#polyline
	var polyline_options = {
	    color: '#000'
	};

	// Defining a polygon here instead of a polyline will connect the
	// endpoints and fill the path.
	// http://leafletjs.com/reference.html#polygon
	var polyline = L.polyline(line_points, polyline_options).addTo(map);

	$('#test-button').click(function () {
		document.getElementById("map").classList.remove("blured");
	});
})();
