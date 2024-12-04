// GeoJSON URL for earthquake data
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Create a map
var myMap = L.map("map", {
    center: [37.0902, -95.7129], // Centering over the USA
    zoom: 4
});

// Add a default OpenStreetMap TileLayer
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "Map data © <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors",
    maxZoom: 18
}).addTo(myMap);

// Fetch GeoJSON data
d3.json(url).then(function(data) {
    // Define marker size based on earthquake magnitude
    function markerSize(magnitude) {
        return magnitude * 4;
    }

    // Define color based on earthquake depth
    function colorDepth(depth) {
        return depth > 90 ? "#ff5f65" :
               depth > 70 ? "#fca35d" :
               depth > 50 ? "#fdb72a" :
               depth > 30 ? "#f7db11" :
               depth > 10 ? "#dcf900" :
                            "#a3f600";
    }

    // Add GeoJSON layer to the map
    L.geoJSON(data, {
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng, {
                radius: markerSize(feature.properties.mag),
                fillColor: colorDepth(feature.geometry.coordinates[2]), // Depth is the 3rd coordinate
                color: "#000",
                weight: 0.5,
                opacity: 1,
                fillOpacity: 0.8
            });
        },
        onEachFeature: function(feature, layer) {
            layer.bindPopup(
                `<strong>Location:</strong> ${feature.properties.place}<br>
                 <strong>Magnitude:</strong> ${feature.properties.mag}<br>
                 <strong>Depth:</strong> ${feature.geometry.coordinates[2]} km`
            );
        }
    }).addTo(myMap);

    // Add a legend to the map
    var legend = L.control({ position: "bottomright" });

    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend");
        var depths = [-10, 10, 30, 50, 70, 90];
        var colors = ["#a3f600", "#dcf900", "#f7db11", "#fdb72a", "#fca35d", "#ff5f65"];

        div.innerHTML = "<h4>Depth (km)</h4>";
        for (var i = 0; i < depths.length; i++) {
            div.innerHTML +=
                '<i style="background:' + colors[i] + '"></i> ' +
                depths[i] + (depths[i + 1] ? "&ndash;" + depths[i + 1] + "<br>" : "+");
        }
        return div;
    };

    legend.addTo(myMap);

}).catch(function(error) {
    console.error("Error fetching GeoJSON data:", error);
});
