import React, {Component} from 'react';
import ReactMapGL from 'react-map-gl';

class MapComponent extends Component {
    // Africa
    onState0() {
        const coords = [26.332091, 4.711150];
        const opts = {
            center: coords,
            zoom: 2.0,
            speed: 0.8
        };
        this.map.getMap().flyTo({...opts})
    }

    // disaster site
    onState1() {
        const coords = [35.269093699999985, -3.2195669];
        const opts = {
            center: coords,
            zoom: 9,
            speed: 0.8
        };
        this.map.getMap().flyTo({...opts})
    }

    // relief site
    onState2() {
        const coords = [33.373521, -3.051178];
        const opts = {
            center: coords,
            zoom: 9,
            speed: 0.8
        };
        this.map.getMap().flyTo({...opts})
    }

    componentWillReceiveProps(nextProps) {
        console.log("CURRENT STATE: "  + this.props.state + " NEXT: " + nextProps.state);
        if(this.props.state !== nextProps.state) {
            if (nextProps.state === 0) {
                this.onState0();
            } else if (nextProps.state === 1) {
                this.onState1();
            } else if (nextProps.state === 2) {
                this.onState2();
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
            onViewportChange={(viewport) => {
                const {width, height, latitude, longitude, zoom} = viewport;
                // Optionally call `setState` and use the state to update the map.
            }}
            />
        );
    }
}

module.exports = MapComponent;
