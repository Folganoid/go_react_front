import React from 'react';
import SETUP from "../config";
import axios from 'axios';

/**
 * Add data
 */
class Data extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            bikeList: [],
            tireList: [],
            yearDistList: [],
            addBike: "",
            addTire: "",
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.fillLists = this.fillLists.bind(this);
        this.saveBikeAjax = this.saveBikeAjax.bind(this);
        this.saveTireAjax = this.saveTireAjax.bind(this);
        this.saveYearDist = this.saveYearDist.bind(this);
        this.deleteYD = this.deleteYD.bind(this);

        this.fillLists();
    }

    fillLists() {

        let formData = new FormData();
        formData.append('userid', this.props.state.userId);
        formData.append('token', this.props.state.token);

        let that = this;

        // get bike list
        axios({
            method: 'post',
            url: SETUP.goHost + '/bike',
            data: formData,
            config: {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Origin': SETUP.reactHost,
                }
            },

        }).then(function (response) {

            that.setState({bikeList: response.data});
            if (response.data[0].Name !== undefined) {
                that.setState({addBike: response.data[0].Name});
                that.setState({addYDBike: response.data[0].Name});
            }

        }).catch((error) => {
            if (error.response) {
                that.props.done("Bike list not found!", "uk-alert-warning");
            }
        });

        // get tire list
        axios({
            method: 'post',
            url: SETUP.goHost + '/tire',
            data: formData,
            config: {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Origin': SETUP.reactHost,
                }
            },

        }).then(function (response) {

            that.setState({tireList: response.data});

            if (response.data[0].Name !== undefined) {
                that.setState({addTire: response.data[0].Name});
            }

        }).catch((error) => {
            if (error.response) {
                that.props.done("Tire list not found!", "uk-alert-warning");
            }
        });

        // get year-dist list
        axios({
            method: 'post',
            url: SETUP.goHost + '/year_dist',
            data: formData,
            config: {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Origin': SETUP.reactHost,
                }
            },

        }).then(function (response) {

            that.setState({yearDistList: response.data});

        }).catch((error) => {
            if (error.response) {
                that.props.done("Year-dist list not found!", "uk-alert-warning");
            }
        });
    }

    /**
     * Input data
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
     * [saveBikeAjax description]
     * @return {[type]} [description]
     */
    saveBikeAjax() {

        let formData = new FormData();
        formData.append('userid', this.props.state.userId);
        formData.append('token', this.props.state.token);
        formData.append('bike', this.state.addBike);

        let that = this;

        axios({
            method: 'PUT',
            url: SETUP.goHost + '/bike',
            data: formData,
            config: {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Origin': SETUP.reactHost,
                }
            },

        }).then(function (response) {
            that.fillLists();
        }).catch((error) => {
            if (error.response) {
                that.props.done("Error! Can't save bike.", "uk-alert-warning");
            }
        });
    }

    /**
     * [saveTireAjax description]
     * @return {[type]} [description]
     */
    saveTireAjax() {
        
        let formData = new FormData();
        formData.append('userid', this.props.state.userId);
        formData.append('token', this.props.state.token);
        formData.append('tire', this.state.addTire);

        let that = this;

        axios({
            method: 'PUT',
            url: SETUP.goHost + '/tire',
            data: formData,
            config: {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Origin': SETUP.reactHost,
                }
            },

        }).then(function (response) {
            that.fillLists();
        }).catch((error) => {
            if (error.response) {
                that.props.done("Error! Can't save tike.", "uk-alert-warning");
            }
        });
    }

    /**
     * [saveYearDist description]
     * @return {[type]} [description]
     */
    saveYearDist() {
        
        let formData = new FormData();
        formData.append('userid', this.props.state.userId);
        formData.append('token', this.props.state.token);
        formData.append('year', this.state.addYDYear);
        formData.append('bike', this.state.addYDBike);
        formData.append('dist', this.state.addYDDist);

        let that = this;

        axios({
            method: 'PUT',
            url: SETUP.goHost + '/year_dist',
            data: formData,
            config: {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Origin': SETUP.reactHost,
                }
            },

        }).then(function (response) {
            that.fillLists();
        }).catch((error) => {
            if (error.response) {
                that.props.done("Error! Can't save tike.", "uk-alert-warning");
            }
        });
    }

    /**
     * [deleteYD description]
     * @param  {[type]} id   [description]
     * @param  {[type]} path [description]
     * @return {[type]}      [description]
     */
    deleteYD(id, path) {
        
        let formData = new FormData();
        formData.append('userid', this.props.state.userId);
        formData.append('token', this.props.state.token);
        formData.append('id', id);

        let that = this;

        axios({
            method: 'DELETE',
            url: SETUP.goHost + path,
            data: formData,
            config: {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Origin': SETUP.reactHost,
                }
            },

        }).then(function (response) {
            that.fillLists();
        }).catch((error) => {
            if (error.response) {
                that.props.done("Error! Can't save tike.", "uk-alert-warning");
            }
        });
    }

     /**
     * render
     * @returns {*}
     */
    render() {

    let delYearDist = (event) => {
        this.deleteYD(event.target.value, "/year_dist");
    }

    let delTire = (event) => {
        this.deleteYD(event.target.value, "/tire");
    }

    let delBike = (event) => {
        this.deleteYD(event.target.value, "/bike");
    }

        return (
            <div className="uk-container">
                <h1>Data control</h1>
                <div className="uk-grid">
                    <div className="uk-width-1-2">
                    <h3>Add ride data</h3>
                        <form>
                            <table>
                                <tbody>
                                    <tr>
                                        <td>Bike:</td>
                                        <td>
                                            <select name="bike">
                                                {this.state.bikeList.map(function(val, index){
                                                    return <option key={ index } value={val.Name}>{val.Name}</option>;
                                                })}
                                            </select>
                                        </td>
                                    </tr>
                                     <tr>
                                        <td>Tires:</td>
                                        <td>
                                            <select name="tire">
                                                {this.state.tireList.map(function(val, index){
                                                    return <option key={ index } value={val.Name}>{val.Name}</option>;
                                                })}
                                            </select>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Date:</td>
                                        <td>
                                            <select name="day">
                                                <option value="1">1</option>
                                                <option value="2">2</option>
                                            </select>
                                            <select name="month">
                                                <option value="1">1</option>
                                                <option value="2">2</option>
                                            </select>
                                            <select name="year">
                                                <option value="1">1</option>
                                                <option value="2">2</option>
                                            </select>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Time:</td>
                                        <td>
                                            <select name="hr">
                                                <option value="1">1</option>
                                                <option value="2">2</option>
                                            </select>h,
                                            <select name="min">
                                                <option value="1">1</option>
                                                <option value="2">2</option>
                                            </select>m,
                                            <select name="sec">
                                                <option value="1">1</option>
                                                <option value="2">2</option>
                                            </select>s
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Description: </td>
                                        <td>
                                            <input type="text" name="prim"/>
                                        </td>
                                    </tr>
                                    <tr><td>Average speed: </td><td><span>3232</span></td></tr>
                                    <tr>
                                        <td>Maximum speed: </td>
                                        <td>
                                            <input type="text" name="maxspd"/>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Average pulse: </td>
                                        <td>
                                            <input type="text" name="avgpls"/>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Maximum pulse: </td>
                                        <td>
                                            <input type="text" name="maxpls"/>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Asphalte: </td>
                                        <td>
                                            <input type="text" name="asf"/>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Bad asphalte: </td>
                                        <td>
                                            <input type="text" name="tvp"/>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Country: </td>
                                        <td>
                                            <input type="text" name="grn"/>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Offroad: </td>
                                        <td>
                                            <input type="text" name="bzd"/>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Temperature: </td>
                                        <td>
                                            <input type="text" name="temp"/>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Wind: </td>
                                        <td>
                                            <input type="text" name="windspd"/>
                                            <select name="winddir">
                                                <option value="1">1</option>
                                                <option value="2">2</option>
                                            </select>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Technical notice: </td>
                                        <td>
                                            <input type="textarea" name="teh"/>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                          
                            <input type="submit" value="Save" />
                        </form>
                    </div>
                    <div className="uk-width-1-2">
                        <h3>Add bike</h3>
                            <input id="add_bike" name="addBike" type="text" placeholder="Enter bike" onChange={this.handleInputChange}/>
                            <button className="uk-button uk-button-primary" id="save_bike" type="button" onClick={this.saveBikeAjax}>Save bike</button>
                            <br />
                            {this.state.bikeList.map(function(val, index){
                                return <dd key={ index }>{val.Name}<button value={val.Id} onClick={delBike}>X</button></dd>;
                            })}
                        <h3>Add tires</h3>
                            <input id="add_tire" type="text" name="addTire" placeholder="Enter tire" onChange={this.handleInputChange}/>
                             <button className="uk-button uk-button-primary" id="save_tire" type="button" onClick={this.saveTireAjax}>Save tire</button>
                            <br />
                            {this.state.tireList.map(function(val, index){
                                return <dd key={ index }>{val.Name} <button value={val.Id} onClick={delTire}>X</button></dd>;
                            })}

                        <h3>Add year distantion</h3>
                            <table>
                                <tbody>
                                    <tr>
                                        <td>Bike:</td>
                                        <td>
                                            <select name="addYDBike" onChange={this.handleInputChange}>
                                                {this.state.bikeList.map(function(val, index){
                                                    return <option key={ index } value={val.Name}>{val.Name}</option>;
                                                })}
                                            </select>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Year / Dist </td>
                                        <td>
                                            <input type="text" name="addYDYear" onChange={this.handleInputChange} />/
                                            <input type="text" name="addYDDist" onChange={this.handleInputChange} />
                                            <button className="uk-button uk-button-primary" type="button" onClick={this.saveYearDist}>Save</button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <table>
                                <tbody>
                                    {this.state.yearDistList.map(function(val, index){
                                        return <tr key={ index }><td>{val.Year}</td><td>{val.Bike}</td><td>{val.Dist}</td><td><button value={val.Id} onClick={delYearDist}>X</button></td></tr>;
                                    })}
                                </tbody>
                            </table>
                    </div>
                </div>
                <br />
            </div>
        );
    }

}

export default Data