window.onload = function(e){ 
	// show starting modal
	$('.modal').modal('show');
    
	const mapElement = document.getElementById('map');

	const map = new google.maps.Map(mapElement, {
	  center: {lat: -34.397, lng: 150.644},
	  zoom: 8
	});
}

$('#test-button').click(function () {
	document.getElementById("map").classList.remove("blured");
});
