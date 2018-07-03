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
            foreignLogin: '',
            filter: "",
            centerMap: {lat: 50.9129663, lng: 34.8055385},
            color: "reset",
        };

        this.onMapClicked = this.onMapClicked.bind(this);
        this.onMarkerClick = this.onMarkerClick.bind(this);
        this.getMarker = this.getMarker.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.getForeignMarker = this.getForeignMarker.bind(this);
        this.colorFilter = this.colorFilter.bind(this);
        this.listMarkerClick = this.listMarkerClick.bind(this);

        this.getMarker();
    }

    /**
     * map click
     * @param props
     */
    onMapClicked (props) {
        if (this.state.showingInfoWindow) {
            this.setState({
                showingInfoWindow: false,
                activeMarker: null
            })
        }
    };

    /**
     * marker click
     *
     * @param props
     * @param marker
     * @param e
     */
    onMarkerClick (props, marker, e) {
        this.setState({
            selectedPlace: props,
            activeMarker: marker,
            showingInfoWindow: true
        });
        console.log(props);
        console.log(marker);
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
        formData.append('userid', this.props.state.userId);
        formData.append('token', this.props.state.token);

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
                that.props.done("Markers not found!", "uk-alert-warning");
            }
        });
    }

    /**
     * set state
     * @param event
     */
    handleInputChange(event) {

        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    /**
     * get markers by login
     */
    getForeignMarker() {

        let formData = new FormData();
        formData.append('login', this.state.foreignLogin);

        let that = this;

        axios({
            method: 'post',
            url: SETUP.goHost + '/get_foreign_markers',
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
                that.props.done("Markers not found!", "uk-alert-warning");
            }
        });

        this.setState({
            foreignLogin: ""
        })
    }

    /**
     * set color filter
     * @param str
     */
    colorFilter(str) {
        this.setState({color: str});
    }

    /**
     * list marker click
     * @param str
     */
    listMarkerClick(cord) {
        console.log(cord);
        this.setState({centerMap: {lat: cord[0], lng: cord[1]}});
    }

    render() {

        // sort
        let sortObj = [...this.state.markers];
        sortObj.sort((a,b) => {
            if(a.Name < b.Name) return -1;
            if(a.Name > b.Name) return 1;
            return 0;
        });

        //filter
        let filteredObj = [];
        sortObj = sortObj.map((answer, i) => {
            let color = (this.state.color !== "reset" && answer.Color !== this.state.color) ? false : true;

            if (answer.Name.toLowerCase().indexOf(this.state.filter.toLowerCase()) >= 0 && color) {
                filteredObj.push(answer);
            };
        });


        // make marker template
        let list = filteredObj.map((answer, i) => {
            return (<Marker key={i}
                name={answer.Name}
                subname={answer.Subname}
                x={answer.X}
                y={answer.Y}
                link={answer.Link}
                color={answer.Color}
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

        // make list template
        let listTable = filteredObj.map((answer, i) => {
            return (
                <tr className={'listMarkers'} key={i} onClick={this.listMarkerClick.bind(this, [answer.X, answer.Y])}>
                    <td style={{color: answer.Color}}>{answer.Name}</td>
                    <td>{answer.X}</td><td>{answer.Y}</td>
                    <td><a href={answer.Link}>Link...</a></td>
                </tr>
            )
        });

        // subname
        let subname = "";
        if (this.state.selectedPlace.subname != "") {
            subname = <h4>{this.state.selectedPlace.subname}</h4>;
        };

        let colors = ["red", "blue", "green", "orange", "purple", "reset"];
        colors = colors.map((answer, i) => {
            return (<button key={i} value={answer} onClick={this.colorFilter.bind(this, answer)}>{answer}</button>);
        });

        return (<div className="uk-container">
                <h1>Map</h1>
                <div className="uk-grid">
                    <div className="uk-width-1-2" style={{height: "500px"}}>
                        Watch another map by login: <input type={'text'} name={'foreignLogin'} placeholder={'Login'} onChange={this.handleInputChange} /><button onClick={this.getForeignMarker}>Watch</button> <button onClick={this.getMarker}>My map</button>
                        <br />
                        <Map
                            google={this.props.google}
                            style={style}
                            className={'map'}
                            initialCenter={this.state.centerMap}
                            zoom={12}
                            onClick={this.onMapClicked}
                        >
                            {list}
                            <InfoWindow
                                marker={this.state.activeMarker}
                                visible={this.state.showingInfoWindow}>
                                <div>
                                    <div style={{width: "100%", height: "20px", backgroundColor: this.state.selectedPlace.color, padding: "0px", margin: "0px"}}></div>
                                    <h3>{this.state.selectedPlace.name}</h3>
                                    {subname}
                                    <p>{this.state.selectedPlace.x + ", " + this.state.selectedPlace.y}</p>
                                    <a target="blank" href={this.state.selectedPlace.link}>Link...</a>
                                </div>
                            </InfoWindow>
                        </Map>
                    </div>
                    <div className="uk-width-1-2" style={{maxHeight: "500px", overflow: "auto"}}>
                        <input name="filter" onChange={this.handleInputChange} placeholder="Filter"/>{colors}
                        <table>
                            <tbody>
                            {listTable}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        );
    }
}

const style = {
    width: '100%',
    height: '100%'
};

export default GoogleApiWrapper({
    apiKey: ("AIzaSyDEF7mhKBOcKf3DOomC3CPSq8htToAlZ84")
})(MapContainer)
