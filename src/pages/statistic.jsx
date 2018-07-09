import React from 'react';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import SETUP from "../config";
import axios from 'axios';
import * as statFuncs from '../elements/statFuncs';
import YearList from '../elements/yearlist';

/**
 * Statistic
 */
class Statistic extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            odoOptions: statFuncs.odoOptions(),
            odoCommonOptions: statFuncs.odoCommonOptions(),
            yearData: [],
            statData: [],
            years: [],
            optionsOdoYear: [],
            odoOptionsNames: [],
        };

        this.getData = this.getData.bind(this);
        this.buildCharts = this.buildCharts.bind(this);

        this.getData();
    }

    /**
     * build chart options
     */
    buildCharts() {

        this.setState({
            years: statFuncs.getYearsList(this.state.yearData, this.state.statData),
            optionsOdoYear: statFuncs.getOdoBikeList(this.state.yearData, this.state.statData),
        });

        this.setState({
            odoOptionsNames: statFuncs.makeOdoOptions(this.state.optionsOdoYear, this.state.years),
        });

        let odoCatTmp = this.state.odoOptions;
        let odoSumTmp = this.state.odoCommonOptions;
        odoCatTmp.xAxis.categories = this.state.years;
        odoCatTmp.series = this.state.odoOptionsNames;
        odoSumTmp.series[0].data = statFuncs.convertToSumChart(this.state.odoOptionsNames);

        this.setState({
            odoOptions: odoCatTmp,
            odoCommonOptions: odoSumTmp,
        });

        console.log(this.state);
    }

    /**
     * get data from DB
     */
    getData() {

        let formData = new FormData();
        formData.append('userid', this.props.state.userId);
        formData.append('token', this.props.state.token);

        let that = this;

        axios({
            method: 'post',
            url: SETUP.goHost + '/get_year_data',
            data: formData,
            config: {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Origin': SETUP.reactHost,
                }
            },

        }).then(function (response) {
            that.setState({yearData: response.data});
            that.buildCharts();
        }).catch((error) => {
            if (error.response) {
                that.props.done("Years data not found!", "uk-alert-warning");
            }
        });

        axios({
            method: 'post',
            url: SETUP.goHost + '/get_stat_data',
            data: formData,
            config: {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Origin': SETUP.reactHost,
                }
            },

        }).then(function (response) {
            that.setState({statData: response.data});
            that.buildCharts();
        }).catch((error) => {
            if (error.response) {
                that.props.done("Stat data not found!", "uk-alert-warning");
            }
        });
    }

    /**
     * render
     * @returns {*}
     */
    render() {

        return (
            <div className="uk-container">
                <h1>Statistic</h1>
                <div className="uk-grid">
                    <div className="uk-width-1-2">
                        <div className="uk-grid">
                            <div className="uk-width-1-2">
                                <YearList data={this.state.optionsOdoYear} years={JSON.parse(JSON.stringify( this.state.years )).reverse()}/>
                            </div>
                            <div className="uk-width-1-2">
                                <HighchartsReact
                                    highcharts={Highcharts}
                                    options={this.state.odoCommonOptions}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="uk-width-1-2">
                        <HighchartsReact
                            highcharts={Highcharts}
                            options={this.state.odoOptions}
                        />
                    </div>
                </div>
            </div>

        );
    }

}

export default Statistic