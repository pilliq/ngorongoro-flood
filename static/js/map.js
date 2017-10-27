mapboxgl.accessToken = 'pk.eyJ1IjoicHF1aXphIiwiYSI6ImNqNzJ6OHMwMTAzamszM201enR1MmZsYzUifQ.N6yX9qx1CeFGnCl6OicU0g';
var criticalStyle = "mapbox://styles/pquiza/cj959wcp00sz42rqh6bprzt1o";
var basicStyle = 'mapbox://styles/mapbox/streets-v9';
var initCenter = [26.332091, 4.711150];
var initZoom = 2.30;
var map = new mapboxgl.Map({
    container: 'map',
    style: criticalStyle,
    center: initCenter,
    zoom: initZoom
});
map.resize();

var radius = 20;

function pointOnCircle(angle) {
    return {
        "type": "Point",
        "coordinates": [
            Math.cos(angle) * radius,
            Math.sin(angle) * radius
        ]
    };
}

function show(layer) {
    map.setLayoutProperty(layer, 'visibility', 'visible');
}

function hide(layer) {
    map.setLayoutProperty(layer, 'visibility', 'none');
}

var reliefSiteCoords = [33.373521, -3.051178];
var disasterSiteCoords = [35.269093699999985, -3.2195669];
map.on('load', function () {
    map.flyTo({center: disasterSiteCoords, zoom: 9, speed: 0.5});
    map.on('zoom', function() {
        hide('tanzania-country-boundary');
    });
    map.on('zoomend', function() {
        show('sites');
        map.flyTo({center: reliefSiteCoords, zoom: 9, speed: 0.5});
    });
    // add topography
    map.addSource('contours', {
        type: 'vector',
        url: 'mapbox://mapbox.mapbox-terrain-v2'
    });
    map.addLayer({
        'id': 'contours',
        'type': 'line',
        'source': 'contours',
        'source-layer': 'contour',
        'layout': {
            'visibility': 'visible',
            'line-join': 'round',
            'line-cap': 'round'
        },
        'paint': {
            'line-color': '#877b59',
            'line-width': 1
        }
    });
    //hide('contours');

    // add points
    map.addLayer({
        "id": "sites",
        "type": "symbol",
        "source": {
            "type": "geojson",
            "data": {
                "type": "FeatureCollection",
                "features": [{
                    "type": "Feature",
                    "geometry": {
                        "type": "Point",
                        "coordinates": reliefSiteCoords
                    },
                    "properties": {
                        "title": "Relief Site",
                        "icon": "monument"
                    }
                }, {
                    "type": "Feature",
                    "geometry": {
                        "type": "Point",
                        "coordinates": disasterSiteCoords
                    },
                    "properties": {
                        "title": "Disaster Site",
                        "icon": "harbor"
                    }
                }]
            }
        },
        "layout": {
            "icon-image": "{icon}-15",
            "text-field": "{title}",
            "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
            "text-offset": [0, 0.6],
            "text-anchor": "top"
        }
    });
    hide('sites');

    // Add a source and layer displaying a point which will be animated in a circle.
    map.addSource('point', {
        "type": "geojson",
        "data": pointOnCircle(0)
    });

    map.addLayer({
        "id": "point",
        "source": "point",
        "type": "circle",
        "paint": {
            "circle-radius": 10,
            "circle-color": "#007cbf"
        }
    });

    function animateMarker(timestamp) {
        // Update the data to a new position based on the animation timestamp. The
        // divisor in the expression `timestamp / 1000` controls the animation speed.
        map.getSource('point').setData(pointOnCircle(timestamp / 1000));

        // Request the next frame of the animation.
        requestAnimationFrame(animateMarker);
    }

    // Start the animation.
    animateMarker(0);
});
