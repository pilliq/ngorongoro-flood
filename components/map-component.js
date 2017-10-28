import React, {Component} from 'react';
import ReactMapGL from 'react-map-gl';

const RELIEF_COORDS = [33.373521, -3.051178];
const DISASTER_COORDS = [35.269093699999985, -3.2195669];
const AFRICA_COORDS = [26.332091, 4.711150];
class MapComponent extends Component {
    onMapLoad() {
        const map = this.map.getMap();
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
                'visibility': 'none',
                'line-join': 'round',
                'line-cap': 'round'
            },  
            'paint': {
                'line-color': '#877b59',
                'line-width': 1
            }   
        });
        map.addLayer({
            "id": "relief-site",
            "type": "symbol",
            "source": {
                "type": "geojson",
                "data": {
                    "type": "FeatureCollection",
                    "features": [{
                        "type": "Feature",
                        "geometry": {
                            "type": "Point",
                            "coordinates": RELIEF_COORDS
                        },
                        "properties": {
                            "title": "Relief Site",
                            "icon": "circle"
                        }
                    }]
                }
            },
            "layout": {
                "visibility": "none",
                "icon-image": "{icon}-15",
                "text-field": "{title}",
                "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
                "text-offset": [0, 0.6],
                "text-anchor": "top"
            }
        });
        map.addLayer({
            "id": "disaster-site",
            "type": "symbol",
            "source": {
                "type": "geojson",
                "data": {
                    "type": "Feature",
                    "geometry": {
                        "type": "Point",
                        "coordinates": DISASTER_COORDS
                    },
                    "properties": {
                        "title": "Disaster Site",
                        "icon": "circle"
                    }
                }
            },
            "layout": {
                "visibility": "none",
                "icon-image": "{icon}-15",
                "text-field": "{title}",
                "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
                "text-offset": [0, 0.6],
                "text-anchor": "top"
            }
        });
    }

    // Africa
    onState0() {
        this.hideLayer('relief-site');
        this.hideLayer('disaster-site');
        this.showCountryLabels();
        this.showLayer('tanzania-country-boundary');
        this.flyTo({center: AFRICA_COORDS, zoom: 2.0, speed: 0.8});
    }

    // disaster site
    onState1() {
        this.hideLayer('tanzania-country-boundary');
        this.hideCountryLabels();
        this.showLayer('disaster-site');
        this.flyTo({center: DISASTER_COORDS, zoom: 9, speed: 0.8});
    }

    // relief site
    onState3() {
        this.hideLayer('tanzania-country-boundary');
        this.hideCountryLabels();
        this.showLayer('relief-site');
        this.flyTo({center: RELIEF_COORDS, zoom: 9, speed: 0.8});
    }

    flyTo(opts) {
        this.map.getMap().flyTo({...opts});
    }

    hideCountryLabels() {
        this.map.getMap().setLayoutProperty('country-label-sm', 'visibility', 'none');
        this.map.getMap().setLayoutProperty('country-label-md', 'visibility', 'none');
        this.map.getMap().setLayoutProperty('country-label-lg', 'visibility', 'none');
    }

    showCountryLabels() {
        this.map.getMap().setLayoutProperty('country-label-sm', 'visibility', 'visible');
        this.map.getMap().setLayoutProperty('country-label-md', 'visibility', 'visible');
        this.map.getMap().setLayoutProperty('country-label-lg', 'visibility', 'visible');
    }

    hideLayer(layer) {
        this.map.getMap().setLayoutProperty(layer, 'visibility', 'none');
    }

    showLayer(layer) {
        this.map.getMap().setLayoutProperty(layer, 'visibility', 'visible');
    }

    componentWillReceiveProps(nextProps) {
        console.log("CURRENT STATE: "  + this.props.state + " NEXT: " + nextProps.state);
        if(this.props.state !== nextProps.state) {
            if (nextProps.state === 0) {
                this.onState0();
            } else if (nextProps.state === 1) {
                this.onState1();
            } else if (nextProps.state === 3) {
                this.onState3();
            }
        }
    }

    render() {
        // when scrolling to second waypoint, zoom into disaster site
        return (
            <ReactMapGL
            ref={(map) => { this.map = map; }}
            width={600}
            height={500}
            latitude={4.711150}
            longitude={26.332091}
            zoom={2.0}
            mapStyle={'mapbox://styles/pquiza/cj959wcp00sz42rqh6bprzt1o'}
            mapboxApiAccessToken={'pk.eyJ1IjoicHF1aXphIiwiYSI6ImNqNzJ6OHMwMTAzamszM201enR1MmZsYzUifQ.N6yX9qx1CeFGnCl6OicU0g'}
            onLoad={this.onMapLoad.bind(this)}
            onViewportChange={(viewport) => {
                const {width, height, latitude, longitude, zoom} = viewport;
                // Optionally call `setState` and use the state to update the map.
            }}
            />
        );
    }
}

module.exports = MapComponent;
