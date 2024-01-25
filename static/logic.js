// initialize map
let myMap = L.map("map", {
    // set center as middle of the US, adjust the zoom
    center: [37.0902, -95.7129],
    zoom: 4
  });

// create tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// make marker size a function of earthquake magnitude
function markerSize(mag) {
    return mag*5;
  }

  // make color a function of earthquake depth
function chooseColor(depth) {
    if (depth>90) return "rgb(255,33,33)"; // red
    else if (depth>70) return "rgb(253, 111, 8)"; // orange
    else if (depth>50) return "rgb(235, 198, 1)"; // yellow
    else if (depth>30) return "rgb(156, 211, 1)"; // yellow-green
    else if (depth>10) return "rgb(82, 193, 0)"; // green-yellow
    else return "rgb(0, 162, 16)"; // green 
    };

let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(url).then(function(data) {
    //console.log(data);
    features = data.features;
    console.log(features[0].geometry);
    //console.log(features);

    // set marker limit or uncomment line below for subset of datapoints
    let marker_limit = features.length;
    //let marker_limit = 100;

    // loop through the JSON data and add a circle + popup for each earthquake
    for (let i = 0; i < marker_limit; i++) {
        // set variables for color of marker and pinpoint the "geometry" section of the JSON data
        let location = features[i].geometry;
        
        if(location){
        L.circleMarker([location.coordinates[1], location.coordinates[0]], {
            color: 'white',
            fillColor: chooseColor(location.coordinates[2]),
            fillOpacity: .90,
            radius: markerSize(features[i].properties.mag)})
        // add popup with further information
        .bindPopup(`<h3>${features[i].properties.place}</h3> 
        <p>Magnitude of earthquake: ${features[i].properties.mag}<br />
        <p>Earthquake depth: ${location.coordinates[2]}<br />
        <p>Earthquake coordinates: (${location.coordinates[1]},${location.coordinates[0]})`)
        .addTo(myMap);
        }
    };
    // create the legend using the same color function from above
    let legend = L.control({
        position: 'bottomright'
      });
      legend.onAdd = function() {
        let div = L.DomUtil.create('div', 'info legend'),
          grades = [-10, 10, 30, 50, 70, 90],
          labels = ["<h3>Earthquake Depth</h3>"],
          from, to;
        
        for (let i = 0; i < grades.length; i++) {
          from = grades[i];
          to = grades[i + 1];
          labels.push(
            '<i style="background:' + chooseColor(from + 1) + '">[ ]</i> ' +
            from + (to ? '&ndash;' + to : '+'));
        }
        div.innerHTML = labels.join('<br>');
        return div;
      };
      legend.addTo(myMap);
});
