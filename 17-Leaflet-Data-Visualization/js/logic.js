// Store our API endpoint inside queryUrl
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(url, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place + "</h3>" + 
      "<hr><p><u><b>Time</b></u> : " + new Date(feature.properties.time) + "</p>" +
      "<p><u><b>Magnitude</b></u> : " + feature.properties.mag + "</p>" + 
      "<p><u><b>Significance</b></u> : " + feature.properties.sig + "</p>")
  }

  function pointToLayer(feature,latlng){
      return L.circleMarker(latlng)
    }
 
  function circleStyle(feature){
    return{
          weight: 1.5,
          opacity: 1,
          fillOpacity: 1,
          radius: (feature.properties.mag+1) * 3,
          fillColor: getColor(feature.properties.mag),
          color: "none"
        };
    }
  
  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: pointToLayer,
    style: circleStyle
  });

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

function getColor(d) {
  return d > 5? "#FF0000":
         d > 4.5? "#FF2200":
         d > 4? "#FF4400":
         d > 3.5? "#FF6600":
         d > 3? "#FF8800":
         d > 2.5? "#FFAA00":
         d > 2? "#FFCC00":
         d > 1.5? "#FFEE00":
         d > 1? "#EEFF00":
         d > .5? "#CCFF00":
         "#AAFF00";
}

function createMap(earthquakes) {

  // Define streetmap and satellite layers
  var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  });

  var satellite = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Satellite Map": satellite
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [streetmap, earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);


  // Set up the legend
  var legend = L.control({ position: "bottomright" });

  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    var grades = [0, .5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];
    var labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
     div.innerHTML +=
       '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
        grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : ' and above');
    }
    return div;
  };

  // Adding legend to the map
  legend.addTo(myMap);

}