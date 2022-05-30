var map;
var markers = [];

mapboxgl.accessToken =
  "pk.eyJ1IjoiYnVyZG9teCIsImEiOiJjbDMzM3E0cDcwaHBiM2pxajVvMzZqM2MzIn0.P3GFUypLMGGZ3uHe--9F0g";

// load map
	var map = new mapboxgl.Map({
		container: 'map',
		  style: 'mapbox://styles/mapbox/streets-v11',
		  center: [-71.104081, 42.365554],
		  zoom: 13,
		});

		addMarkers();


// Add bus markers to map
async function addMarkers(){
	// get bus data
	var locations = await getBusLocations();
	// loop through data, add bus markers
	locations.forEach(function(bus){
		var marker = getMarker(bus.id);		
		if (marker){
			moveMarker(marker,bus);
		}
		else{
			addMarker(bus);			
		}
	});

	// timer
	console.log(new Date());
	setTimeout(addMarkers,10000);
}

// Request bus data from MBTA
async function getBusLocations(){
	var url = 'https://api-v3.mbta.com/vehicles?filter[route]=1&include=trip';	
	var response = await fetch(url);
	var json     = await response.json();
	return json.data;
}

function addMarker(bus){
	var icon = getIcon(bus);
	var marker = new mapboxgl.Marker()
	.setLngLat([bus.attributes.longitude, bus.attributes.latitude],{id: bus.id, icon: icon, map: map})
	markers.push(marker);
}

function getIcon(bus){
	// select icon based on bus direction
	if (bus.attributes.direction_id === 0) {
		const el = document.createElement('div');
		el.className = 'marker';
		 new mapboxgl.Marker(el).setLngLat([bus.attributes.longitude, bus.attributes.latitude]).addTo(map);
	} else {
	const el2 = document.createElement('div');
		el2.className = 'marker2';
		 new mapboxgl.Marker(el2).setLngLat([bus.attributes.longitude, bus.attributes.latitude]).addTo(map);	}	
}

function moveMarker(marker,bus) {
	// change icon if bus has changed direction
	var icon = getIcon(bus);
	marker.setIcon(icon);

	// move icon to new lat/lon
    marker.setLngLat([bus.attributes.longitude, bus.attributes.latitude]);

}

function getMarker(id){
	var marker = markers.find(function(item){
		return item.id === id;
	});
	return marker;
	
}

