import React, {Component} from 'react';
import MapComponent from './map-component';
import VizComponent from './viz-component';

class GraphicComponent extends Component {
    //constructor(props, context) {
    //    super(props, context);

    //    this.state = {
    //        showOverlay: false
    //    };
    //}
    //shouldShowOverlay(state) {
    //    return state === 2;
    //}
    //componentWillReceiveProps(nextProps) {
    //    if (this.props.state !== nextProps.state) {
    //        if (this.shouldShowOverlay(nextProps.state)) {
    //            this.setState({showOverlay: true});
    //        } else {
    //            this.setState({showOverlay: false});
    //        }
    //    }
    //}
    render() {
        //{ this.state.showOverlay ? <svg width='600' height='500' style={{'position': 'absolute', 'z-index': '1'}}><rect fill='rgba(255,0,0,.5)' width='600' height='500'></rect></svg> : null }
        //<VizComponent className={this.state.showOverlay ? 'visible' : 'invisible'} style={{'position': 'absolute', 'zIndex': '1'}} state={this.props.state}/>
        return (
            <div>
                <VizComponent style={{'position': 'absolute', 'zIndex': '1'}} state={this.props.state}/>
                <MapComponent state={this.props.state}/>
            </div>
        );
    }
}

module.exports = GraphicComponent;
