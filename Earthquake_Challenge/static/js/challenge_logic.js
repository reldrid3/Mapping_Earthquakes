// Add console.log to check to see if our code is working.
console.log("working");

//
// Map Setup
//

// We create the tile layer that will be the background of our map.
let streets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', {
	attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
	maxZoom: 18,
	accessToken: API_KEY
});
// We create the dark view tile layer that will be an option for our map.
let dark = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/dark-v10/tiles/{z}/{x}/{y}?access_token={accessToken}', {
  attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
  maxZoom: 18,
  accessToken: API_KEY
});
// We create the second tile layer that will be the background of our map.
let satelliteStreets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', {
	attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
	maxZoom: 18,
	accessToken: API_KEY
});

// Create a base layer that holds all three maps.
let baseMaps = {
  "Streets": streets,
  "Satellite": satelliteStreets,
  "Nighttime": dark
};

// 1. Add a 2nd layer group for the tectonic plate data.
//let allEarthquakes = new L.LayerGroup();
//let majorEarthquakes = new L.LayerGroup();
let tectPlates = new L.LayerGroup();


// 2. Add a reference to the tectonic plates group to the overlays object.
let overlays = {
  // *** THESE LAYERS WERE REMOVED DUE TO SLIDER IMPLEMENTATION ***
  //"Earthquakes": allEarthquakes,
  //"Major Earthquakes": majorEarthquakes,
  "Tectonic Plates": tectPlates
};

// Create the map object with center, zoom level and default layer.
let map = L.map('mapid', {
	center: [40.7, -94.5],
	zoom: 3,
	layers: [streets]
});

// Then we add a control to the map that will allow the user to change which
// layers are visible.
L.control.layers(baseMaps, overlays, {
  collapsed: false
}).addTo(map);

// Function to create the legend, for readability
function createLegend()
{
  // Here we create a legend control object.
  let legend = L.control({
    position: "bottomright"
  });

  // Then add all the details for the legend
  legend.onAdd = function() {
    let div = L.DomUtil.create("div", "info legend");

    const magnitudes = [0, 1, 2, 3, 4, 5];
    const colors = [
      "#98ee00",
      "#d4ee00",
      "#eecc00",
      "#ee9c00",
      "#ea822c",
      "#ea2c2c"
  ];

  // Looping through our intervals to generate a label with a colored square for each interval.
  for (var i = 0; i < magnitudes.length; i++) {
    console.log(colors[i]);
    div.innerHTML +=
      "<i style='background: " + colors[i] + "'></i> " +
      magnitudes[i] + (magnitudes[i + 1] ? "&ndash;" + magnitudes[i + 1] + "<br>" : "+");
    }
    return div;
  };

  // Finally, we our legend to the map.
  legend.addTo(map);
}

createLegend();

//
// Styles and Styling Functions
//

// This function returns the style data for each of the earthquakes we plot on
// the map. We pass the magnitude of the earthquake into two separate functions
// to calculate the color and radius.
function eqStyle(feature) {
  return {
    opacity: 1,
    fillOpacity: 1,
    fillColor: eqColor(feature.properties.mag),
    color: "#000000",
    radius: eqRadius(feature.properties.mag),
    stroke: true,
    weight: 0.5
  };
}
// This function determines the color of the marker based on the magnitude of the earthquake.
function eqColor(magnitude) {
  if (magnitude > 5) {
    return "#ea2c2c";
  }
  if (magnitude > 4) {
    return "#ea822c";
  }
  if (magnitude > 3) {
    return "#ee9c00";
  }
  if (magnitude > 2) {
    return "#eecc00";
  }
  if (magnitude > 1) {
    return "#d4ee00";
  }
  return "#98ee00";
}
// This function determines the radius of the earthquake marker based on its magnitude.
// Earthquakes with a magnitude of 0 were being plotted with the wrong radius.
function eqRadius(magnitude) {
  if (magnitude === 0) {
    return 1;
  }
  return magnitude * 4;
}

let tectLineStyle = {
  color: "purple",
  weight: 1.5
};

//
// Adding Overlay Data
//

allEQLink = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";


// Retrieve the earthquake GeoJSON data.
d3.json(allEQLink).then(function(data) {
  // Creating a GeoJSON layer with the retrieved data.
  var eqData = L.geoJson(data, {
    // We turn each feature into a circleMarker on the map.
    pointToLayer: function(feature, latlng) {
     		return L.circleMarker(latlng);
    },
    // We set the style for each circleMarker using our styleInfo function.
    style: eqStyle,
    // We create a popup for each circleMarker to display the magnitude and location of the earthquake
    //  after the marker has been created and styled.
    onEachFeature: function(feature, layer) {
      layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
    }
  });//.addTo(allEarthquakes);

  // ***The allEarthquakes layer was made defunct by the layer(s) being created and managed by the Slider Control.***
  // Then we add the earthquake layer to our map.
  //allEarthquakes.addTo(map);

  minMag = Math.min(...Object.entries(eqData._layers).map(x => x[1].feature.properties.mag));
  maxMag = Math.max(...Object.entries(eqData._layers).map(x => x[1].feature.properties.mag));

  var magSlider = null;
  magSlider = L.control.sliderControl({
    position: "topright",
    layer: eqData,
    minValue: minMag,
    maxValue: maxMag
  }).addTo(map);

  magSlider.startSlider();
});

/* ***THIS WOULD BE THE CODE FOR DELIVERABLE #2, IF THERE WAS NO SLIDER

majorEQLink = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson"

// Retrieve the earthquake GeoJSON data.
d3.json(majorEQLink).then(function(data) {
  // Creating a GeoJSON layer with the retrieved data.
  L.geoJson(data, {
    // We turn each feature into a circleMarker on the map.
    pointToLayer: function(feature, latlng) {
     		console.log(data);
     		return L.circleMarker(latlng);
    },
    // We set the style for each circleMarker using our styleInfo function.
    style: eqStyle,
    // We create a popup for each circleMarker to display the magnitude and location of the earthquake
    //  after the marker has been created and styled.
    onEachFeature: function(feature, layer) {
      layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
    }
  }).addTo(majorEarthquakes);

  // Then we add the earthquake layer to our map.
  majorEarthquakes.addTo(map);
});

*/

tectonicLink = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";

// 3. Use d3.json to make a call to get our Tectonic Plate geoJSON data.
d3.json(tectonicLink).then(function(data) {
  L.geoJson(data, {
    style: tectLineStyle
  }).addTo(tectPlates);
  tectPlates.addTo(map);
});