import React from 'react';
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';
import SETUP from "../config";
import axios from 'axios';

export class MapContainer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showingInfoWindow: false,
            activeMarker: {},
            selectedPlace: {},
            markers: [],
        };

        this.onMapClicked = this.onMapClicked.bind(this);
        this.onMarkerClick = this.onMarkerClick.bind(this);
        this.getMarker = this.getMarker.bind(this);
        this.getMarker();
    }

    onMapClicked (props) {
        if (this.state.showingInfoWindow) {
            this.setState({
                showingInfoWindow: false,
                activeMarker: null
            })
        }
    };

    onMarkerClick (props, marker, e) {
        this.setState({
            selectedPlace: props,
            activeMarker: marker,
            showingInfoWindow: true
        });
    };

    onMouseoverMarker (props, marker, e) {
        marker.setAnimation(props.google.maps.Animation.BOUNCE);
        setTimeout(() => {marker.setAnimation(null)}, 3000);
    }

    /**
     * get markers
     */
    getMarker() {

        let formData = new FormData();
        formData.append('userid', localStorage.getItem('userId'));
        formData.append('token', localStorage.getItem('token'));

        let that = this;

        axios({
            method: 'post',
            url: SETUP.goHost + '/get_markers',
            data: formData,
            config: {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Origin': SETUP.reactHost,
                }
            },

        }).then(function (response) {
            that.setState({markers: response.data});
        }).catch((error) => {
            if (error.response) {
                that.props.done("Markers not find!", "uk-alert-warning");
            }
        });
    }

    render() {

        let list = this.state.markers.map((answer, i) => {

            // Return the element. Also pass key
            return (<Marker key={i}
                name={answer.Name}
                position={{lat: answer.X, lng: answer.Y}}
                icon={{
                    path: this.props.google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
                    strokeColor: answer.Color,
                    scale: 5
                }}
                onClick={this.onMarkerClick}
                onMouseover={this.onMouseoverMarker}
            />)
        });



        return (<div className="uk-container">
                <h1>Map</h1>
                <button onClick={this.getMarker}>1111</button>

            <Map
                google={this.props.google}
                style={style}
                initialCenter={{lat: 50.9129663, lng: 34.8055385}}
                zoom={12}
                onClick={this.onMapClicked}
            >
                {list}
                <InfoWindow
                    marker={this.state.activeMarker}
                    visible={this.state.showingInfoWindow}>
                    <div>
                        <h3>{this.state.selectedPlace.name}</h3>
                    </div>
                </InfoWindow>
            </Map>
            </div>
        );
    }
}

const style = {
    width: '500px',
    height: '300px'
};

export default GoogleApiWrapper({
    apiKey: ("AIzaSyDEF7mhKBOcKf3DOomC3CPSq8htToAlZ84")
})(MapContainer)
