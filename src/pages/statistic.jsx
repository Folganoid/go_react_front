import React from 'react';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import SETUP from "../config";
import axios from 'axios';
import * as statFuncs from '../elements/statFuncs';
import YearList from '../elements/yearlist';
import DistStat from '../elements/distStat';

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
            curYear: (new Date()).getFullYear(),
            curYearStat: [],
        };

        this.getData = this.getData.bind(this);
        this.buildCharts = this.buildCharts.bind(this);
        this.preYear = this.preYear.bind(this);
        this.nextYear = this.nextYear.bind(this);
        this.filterStatDataByYear = this.filterStatDataByYear.bind(this);
        this.buildStatOneYear = this.buildStatOneYear.bind(this);

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

        this.filterStatDataByYear(this.state.curYear);
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
     * click - year
     */
    preYear() {
        this.setState({
            curYear: this.state.curYear - 1,
            curYearStat: this.filterStatDataByYear(this.state.curYear - 1),
        });
    }

    /**
     * click + year
     */
    nextYear() {
        this.setState({
            curYear: this.state.curYear + 1,
            curYearStat: this.filterStatDataByYear(this.state.curYear + 1),
        });
    }

    /**
     * filter data for one year
     *
     * @param year
     * @returns {Array}
     */
    filterStatDataByYear(year) {
       var result = [];
       for (var i = 0 ; i < this.state.statData.length ; i++) {
           if ((new Date(this.state.statData[i].Date*1000)).getFullYear() === year) {
               result.push(this.state.statData[i])
           };
       }

       this.buildStatOneYear(result);

       return result;
    }

    /**
     * build object for year-statistic
     *
     * @param data
     */
    buildStatOneYear(data) {
        console.log(data);

        let result = {};

        for (var  i = 0 ; i < data.length; i++) {

            let d = data[i];
            if (result[d.Bike] === undefined ) {
                result[d.Bike] = {};
                result[d.Bike]['Bike'] = d.Bike;
                result[d.Bike]['Count'] = 0;
                result[d.Bike]['Dist'] = 0;
                result[d.Bike]['Maxpls'] = [0, 0];
                result[d.Bike]['Maxspd'] = [0, 0];
                result[d.Bike]['Maxdst'] = [0, 0];
                result[d.Bike]['Time'] = 0;
                result[d.Bike]['Asf'] = 0;
                result[d.Bike]['Tvp'] = 0;
                result[d.Bike]['Grn'] = 0;
                result[d.Bike]['Bzd'] = 0;
                result[d.Bike]['Months'] = [[],[],[],[],[],[],[],[],[],[],[],[]];

            }

            result[d.Bike]['Count']++;
            result[d.Bike]['Dist'] += d.Dist ;
            result[d.Bike]['Maxpls'] = (d.Maxpls > result[d.Bike]['Maxpls'][0]) ? [d.Maxpls, d.Date] : result[d.Bike]['Maxpls'];
            result[d.Bike]['Maxspd'] = (d.Maxspd > result[d.Bike]['Maxspd'][0]) ? [d.Maxspd, d.Date] : result[d.Bike]['Maxspd'];
            result[d.Bike]['Maxdst'] = (d.Dist > result[d.Bike]['Maxdst'][0]) ? [d.Dist, d.Date] : result[d.Bike]['Maxdst'];
            result[d.Bike]['Time'] += d.Time;
            result[d.Bike]['Asf'] += (d.Dist / 100 * d.Surfasf);
            result[d.Bike]['Tvp'] += (d.Dist / 100 * d.Surftvp);
            result[d.Bike]['Grn'] += (d.Dist / 100 * d.Surfgrn);
            result[d.Bike]['Bzd'] += (d.Dist / 100 * d.Srfbzd);

            
        }

        for (var bike in result) {
            let r = result[bike];

            result[bike].Dist = r.Dist.toFixed(2);
            result[bike].AvgDist = (r.Dist / r.Count).toFixed(2);
            result[bike].AvgTime = (r.Time / r.Count).toFixed();
            result[bike].Asf = [r.Asf.toFixed(2), (r.Asf*100/r.Dist).toFixed()];
            result[bike].Tvp = [r.Tvp.toFixed(2), (r.Tvp*100/r.Dist).toFixed()];
            result[bike].Grn = [r.Grn.toFixed(2), (r.Grn*100/r.Dist).toFixed()];
            result[bike].Bzd = [r.Bzd.toFixed(2), (r.Bzd*100/r.Dist).toFixed()];

        }

        console.log(result);
        return result;
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

                <div className="uk-row">
                    <h1><span onClick={this.preYear}>-</span>{this.state.curYear}<span onClick={this.nextYear}>+</span></h1>
                    <DistStat state={this.state}/>
                </div>
            </div>

        );
    }

}

export default Statistic