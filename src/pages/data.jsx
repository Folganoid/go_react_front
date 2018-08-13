import React from 'react';
import SETUP from "../config";
import axios from 'axios';

/**
 * Add data
 */
class Data extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};

        this.handleInputChange = this.handleInputChange.bind(this);
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
     * render
     * @returns {*}
     */
    render() {


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
                                                <option value="1">1</option>
                                                <option value="2">2</option>
                                            </select>
                                        </td>
                                    </tr>
                                     <tr>
                                        <td>Tires:</td>
                                        <td>
                                            <select name="tire">
                                                <option value="1">1</option>
                                                <option value="2">2</option>
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
                            <input id="add_bike" type="text"/>
                            <button id="save_bike">Save bike</button>
                        <h3>Add tires</h3>
                            <input id="add_tire" type="text"/>
                            <button id="save_tire">Save tire</button>
                        <h3>Add year distantion</h3>
                            <form>
                            <table>
                                <tbody>
                                    <tr>
                                        <td>Bike:</td>
                                        <td>
                                            <select name="bike">
                                                <option value="1">1</option>
                                                <option value="2">2</option>
                                            </select>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Year / Dist </td>
                                        <td>
                                            <input type="text" name="odoyear"/>/
                                            <input type="text" name="ododist"/>
                                            <input type="submit" value="Save" />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            </form>        

                    </div>
                </div>
                <br />
            </div>
        );
    }

}

export default Data