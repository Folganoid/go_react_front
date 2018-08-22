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

            statYear: (new Date()).getFullYear(),
            statMonth: (new Date()).getMonth() + 1,
            statDay: (new Date()).getDate(),

            statDist: 0,
            statHr: 0,
            statMin: 0,
            statSec: 0,

            statAsf: 0,
            statTvp: 0,
            statGrn: 0,
            statBzd: 0,
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.fillLists = this.fillLists.bind(this);
        this.saveBikeAjax = this.saveBikeAjax.bind(this);
        this.saveTireAjax = this.saveTireAjax.bind(this);
        this.saveYearDist = this.saveYearDist.bind(this);
        this.deleteYD = this.deleteYD.bind(this);
        this.saveStat = this.saveStat.bind(this);
        this.validate = this.validate.bind(this);
        this.validate_date = this.validate_date.bind(this);

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

    validate() {
        let surf = +this.state.statAsf + +this.state.statTvp + +this.state.statBzd + +this.state.statGrn;
        let date = this.validate_date(+this.state.statYear, +this.state.statMonth - 1, +this.state.statDay);

        if (surf === 100 && date) {
            return true;
        }
        return false;
    }

    validate_date(y, m, d)
    {
        var dt = new Date(y, m, d);
        if ((dt.getFullYear() === y) && (dt.getMonth() === m) && (dt.getDate() === d)) {
            return true;
        } else {
            return false;
        }
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


    saveStat() {

        let formData = new FormData();
        formData.append('userid', this.props.state.userId);
        formData.append('token', this.props.state.token);
        formData.append('bike', this.state.addBike);
        formData.append('tire', this.state.addTire);;
        formData.append('date', (new Date(this.state.statYear, this.state.statMonth, this.state.statDay)).getTime() / 1000);
        formData.append('time', +this.state.statHr*3600 + +this.state.statMin*60 + +this.state.statSec);
        formData.append('dist', this.state.statDist);
        formData.append('prim', this.state.statPrim);
        formData.append('maxspd', this.state.statMaxspd);
        formData.append('maxpls', this.state.statMaxpls);
        formData.append('avgpls', this.state.statAvgpls);
        formData.append('asf', this.state.statAsf);
        formData.append('tvp', this.state.statTvp);
        formData.append('grn', this.state.statGrn);
        formData.append('bzd', this.state.statBzd);
        formData.append('temp', this.state.statTemp);
        formData.append('teh', this.state.statTeh);
        formData.append('wind', this.state.statWindspd + "@" + this.state.statWinddir);

        let that = this;

        axios({
            method: 'PUT',
            url: SETUP.goHost + '/stat',
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

    let sumSurface = +this.state.statAsf + +this.state.statTvp + +this.state.statBzd + +this.state.statGrn;
    let avgSpeed = this.state.statDist / (+this.state.statSec + +this.state.statMin*60 + +this.state.statHr*60*60)*3600;

    let validate = this.validate();
    let validate_date = this.validate_date(+this.state.statYear, +this.state.statMonth - 1, +this.state.statDay);
    let validate_time = (this.state.statHr > 0 || this.state.statMin > 0 || this.state.statSec > 0) ? true : false;
    let validate_dist = this.state.statDist > 0;

        return (
            <div className="uk-container">
                <h1>Data control</h1>
                <div className="uk-grid">
                    <div className="uk-width-1-2">
                    <h3>Add ride data</h3>
                            <table>
                                <tbody>
                                    <tr>
                                        <td>Bike:</td>
                                        <td>
                                            <select name="addBike" onChange={this.handleInputChange}>
                                                {this.state.bikeList.map(function(val, index){
                                                    return <option key={ index } value={val.Name}>{val.Name}</option>;
                                                })}
                                            </select>
                                        </td>
                                    </tr>
                                     <tr>
                                        <td>Tires:</td>
                                        <td>
                                            <select name="addTire" onChange={this.handleInputChange}>
                                                {this.state.tireList.map(function(val, index){
                                                    return <option key={ index } value={val.Name}>{val.Name}</option>;
                                                })}
                                            </select>
                                        </td>
                                    </tr>
                                    <tr className={(validate_date) ? "" : "invalid_stat_data"}>
                                        <td>Date:</td>
                                        <td>
                                            <select name="statDay" onChange={this.handleInputChange}>
                                                {[...Array(31)].map((x, i) =>
                                                   <option key={ i+1 } value={ i+1 } selected={ (+this.state.statDay === i+1) ? "selected" : "" }>{ i+1 }</option>
                                                )}
                                            </select>
                                            <select name="statMonth" onChange={this.handleInputChange}>
                                                {[...Array(12)].map((x, i) =>
                                                   <option key={ i } value={ i+1 } selected={ (+this.state.statMonth === i+1) ? "selected" : "" }>{ i+1 }</option>
                                                )}
                                            </select>
                                            <select name="statYear" onChange={this.handleInputChange}>
                                                {[...Array(10)].map((x, i) =>
                                                   <option key={ i } value={ +(new Date()).getFullYear() - i }>{ +(new Date()).getFullYear() - i }</option>
                                                )}
                                            </select>&nbsp;
                                            <span style={{color: "red"}}>{(validate_date) ? "" : "invalid date"}</span>
                                        </td>
                                    </tr>
                                    <tr className={(validate_time) ? "" : "invalid_stat_data"}>
                                        <td>Time:</td>
                                        <td>
                                            <select name="statHr" onChange={this.handleInputChange}>
                                                {[...Array(25)].map((x, i) =>
                                                   <option key={ i } value={ i }>{ i }</option>
                                                )}
                                            </select>h,
                                            <select name="statMin" onChange={this.handleInputChange}>
                                                {[...Array(60)].map((x, i) =>
                                                   <option key={ i } value={ i }>{ i }</option>
                                                )}
                                            </select>m,
                                            <select name="statSec" onChange={this.handleInputChange}>
                                                {[...Array(60)].map((x, i) =>
                                                   <option key={ i } value={ i }>{ i }</option>
                                                )}
                                            </select>s
                                        </td>
                                    </tr>
                                    <tr className={(validate_dist) ? "" : "invalid_stat_data"}>
                                        <td>Dist: </td>
                                        <td>
                                            <input type="text" name="statDist" onChange={this.handleInputChange}/>
                                        </td>
                                    </tr>
                                    <tr><td>Average speed: </td><td><span style={{display: (avgSpeed > 0 && avgSpeed < Infinity) ? "" : "none"}}>{avgSpeed.toFixed(2)}</span></td></tr>
                                    <tr>
                                        <td>Description: </td>
                                        <td>
                                            <input type="text" name="statPrim" onChange={this.handleInputChange}/>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Maximum speed: </td>
                                        <td>
                                            <input type="text" name="statMaxspd" onChange={this.handleInputChange}/>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Average pulse: </td>
                                        <td>
                                            <input type="text" name="statAvgpls" onChange={this.handleInputChange}/>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Maximum pulse: </td>
                                        <td>
                                            <input type="text" name="statMaxpls" onChange={this.handleInputChange}/>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Asphalte: </td>
                                        <td>
                                            <input type="text" size={3} name="statAsf" onChange={this.handleInputChange}/>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Bad asphalte: </td>
                                        <td>
                                            <input type="text" size={3} name="statTvp" onChange={this.handleInputChange}/>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Country: </td>
                                        <td>
                                            <input type="text" size={3} name="statGrn" onChange={this.handleInputChange}/>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Offroad: </td>
                                        <td>
                                            <input type="text" size={3} name="statBzd" onChange={this.handleInputChange}/>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style={{color: (sumSurface === 100) ? "green" : "red"}}>{sumSurface}</td>
                                    </tr>
                                    <tr>
                                        <td>Temperature: </td>
                                        <td>
                                            <input type="text" name="statTemp" onChange={this.handleInputChange}/>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Wind: </td>
                                        <td>
                                            <input type="text" size="4" name="statWindspd" onChange={this.handleInputChange}/>&nbsp;
                                            <select name="statWinddir" onChange={this.handleInputChange}>
                                                <option value={5}></option>
                                                <option value={8}>⇡</option>
                                                <option value={9}>↗</option>
                                                <option value={6}>⇢</option>
                                                <option value={3}>↘</option>
                                                <option value={2}>⇣</option>
                                                <option value={1}>↙</option>
                                                <option value={4}>⇠</option>
                                                <option value={7}>↖</option>
                                            </select>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Technical notice: </td>
                                        <td>
                                            <input type="textarea" name="statTeh" onChange={this.handleInputChange}/>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <button type="button" onClick={this.saveStat} disabled={(validate) ? "" : "false"}>Save</button>
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