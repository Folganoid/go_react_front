import React from 'react';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import SETUP from "../config";
import axios from 'axios';
import * as statFuncs from '../elements/statFuncs';
import YearList from '../elements/yearlist';
import DistStat from '../elements/distStat';
import Calendar from '../elements/calendar';
import StatDataTable from '../elements/dataStatTable';
import TechDataTable from '../elements/dataTechTable';

/**
 * Statistic
 */
class Statistic extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            odoOptions: statFuncs.odoOptions(),
            odoCommonOptions: statFuncs.odoCommonOptions(),
            odoYearOptions: statFuncs.odoYearOptions(),
            avgPlsOptions: statFuncs.avgPlsOptions(),
            avgSpdOptions: statFuncs.avgSpdOptions(),
            yearData: [],
            statData: [],
            years: [],
            optionsOdoYear: [],
            odoOptionsNames: [],
            curYear: (new Date()).getFullYear(),
            curYearStat: {},
            rideDaysArr: {},
            tiresOdo: {},
        };

        this.getData = this.getData.bind(this);
        this.buildCharts = this.buildCharts.bind(this);
        this.preYear = this.preYear.bind(this);
        this.nextYear = this.nextYear.bind(this);
        this.filterStatDataByYear = this.filterStatDataByYear.bind(this);
        this.buildStatOneYear = this.buildStatOneYear.bind(this);
        this.buildRideDays = this.buildRideDays.bind(this);
        this.getForeignStat = this.getForeignStat.bind(this);
        this.getMyStat = this.getMyStat.bind(this);
        this.reload = this.reload.bind(this);

        this.getData();
    }

    countTiresOdo(data) {
        let result = {};

        for (let i = 0 ; i < data.length ; i++) {
            if (result[data[i].Tires] === undefined) result[data[i].Tires] = 0;
            result[data[i].Tires] += +data[i].Dist;
        }

        return result;
    }


    buildRideDays(data, year) {

        let result = {};

        for(let d = 0 ; d < data.length; d++) {
            let date = new Date(data[d].Date * 1000);
            if (date.getFullYear() !== year) continue;
            if (result[date.getMonth()] === undefined) result[date.getMonth()] = {};
            result[date.getMonth()][date.getDate()] = data[d].Id;
        }

        return result;
    }

    /**
     * build chart options
     */
    buildCharts(data) {

        this.setState({
            years: statFuncs.getYearsList(this.state.yearData, data),
            optionsOdoYear: statFuncs.getOdoBikeList(this.state.yearData, data),
        });

        this.setState({
            odoOptionsNames: statFuncs.makeOdoOptions(this.state.optionsOdoYear, this.state.years),
        });

        // chart data
        let odoCatTmp = this.state.odoOptions;
        let odoSumTmp = this.state.odoCommonOptions;
        let odoYearTmp = this.state.odoYearOptions;
        let avgPlsTmp = this.state.avgPlsOptions;
        let avgSpdTmp = this.state.avgSpdOptions;
        odoCatTmp.xAxis.categories = this.state.years;
        odoCatTmp.series = this.state.odoOptionsNames;
        odoSumTmp.series[0].data = statFuncs.convertToSumChart(this.state.odoOptionsNames);
        odoYearTmp.series[0].data = statFuncs.makeOdoYearOptionsData(data, this.state.curYear);
        avgPlsTmp.series = statFuncs.makeAvgPulseData(data, this.state.curYear);
        avgSpdTmp.series = statFuncs.makeAvgSpeedData(data, this.state.curYear);

        this.setState({
            odoOptions: odoCatTmp,
            odoCommonOptions: odoSumTmp,
            odoYearOptions: odoYearTmp,
            avgPlsOptions: avgPlsTmp,
            avgSpdOptions: avgSpdTmp,
        });

        this.setState({
            curYearStat: this.filterStatDataByYear(this.state.curYear),
            rideDaysArr: this.buildRideDays(data, this.state.curYear),
            tiresOdo: this.countTiresOdo(this.state.statData),
        });

        console.log(this.state);
    }

    /**
     * get data from DB
     */
    getData(login = "") {

        let formData = new FormData();
        formData.append('userid', this.props.state.userId);
        formData.append('token', this.props.state.token);
        if (login !== "") formData.append('foreign', login);

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
                        that.buildCharts(response.data);
                    }).catch((error) => {
                        if (error.response) {
                            that.props.done("Stat data not found!", "uk-alert-warning");
                        }
                    });
        }).catch((error) => {
            if (error.response) {
                that.props.done("Years data not found!", "uk-alert-warning");
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
            let res = [];
            for (let i = 0 ; i < response.data.length ; i++ ) {
                res.push(response.data[i].Name);
            }
            that.setState({tires: res});

        }).catch((error) => {
            if (error.response) {
                that.props.done("Tire list not found!", "uk-alert-warning");
            }
        });
    }

    /**
     * click - year
     */
    preYear() {

        let tmpYearStat = this.filterStatDataByYear(this.state.curYear - 1);
        let count = 1;

        if (Object.keys(tmpYearStat).length === 0) {
            for (let i = 1 ; i < 10; i++) {
                tmpYearStat = this.filterStatDataByYear(this.state.curYear - i);
                if (Object.keys(tmpYearStat).length !== 0) {
                    count = i;
                    break;
                }
            }
            return;
        }

        let avgPlsTmp = this.state.avgPlsOptions;

        avgPlsTmp.series = statFuncs.makeAvgPulseData(this.state.statData, this.state.curYear - count);
        let avgSpdTmp = this.state.avgSpdOptions;
        avgSpdTmp.series = statFuncs.makeAvgSpeedData(this.state.statData, this.state.curYear - count);

        let odoYearTmp = this.state.odoYearOptions;
        odoYearTmp.series[0].data = statFuncs.makeOdoYearOptionsData(this.state.statData, this.state.curYear - count);

        this.setState({
            curYear: this.state.curYear - 1,
            curYearStat: tmpYearStat,
            rideDaysArr: this.buildRideDays(this.state.statData, this.state.curYear - count),
            avgPlsOptions: avgPlsTmp,
            avgSpdOptions: avgSpdTmp,
            odoYearOptions: odoYearTmp,
        });
    }

    /**
     * click + year
     */
    nextYear() {

        let tmpYearStat = this.filterStatDataByYear(this.state.curYear + 1);
        let count = 1;

        if (Object.keys(tmpYearStat).length === 0) {
            for (let i = 1 ; i < 10; i++) {
               tmpYearStat = this.filterStatDataByYear(this.state.curYear + i);
               if (Object.keys(tmpYearStat).length !== 0) {
                   count = i;
                   break;
               }
            }
            return;
        }

        let avgPlsTmp = this.state.avgPlsOptions;
        avgPlsTmp.series = statFuncs.makeAvgPulseData(this.state.statData, this.state.curYear + count);
        let avgSpdTmp = this.state.avgSpdOptions;
        avgSpdTmp.series = statFuncs.makeAvgSpeedData(this.state.statData, this.state.curYear + count);

        let odoYearTmp = this.state.odoYearOptions;
        odoYearTmp.series[0].data = statFuncs.makeOdoYearOptionsData(this.state.statData, this.state.curYear + count);

        this.setState({
            curYear: this.state.curYear + count,
            curYearStat: tmpYearStat,
            rideDaysArr: this.buildRideDays(this.state.statData, this.state.curYear + count),
            avgPlsOptions: avgPlsTmp,
            avgSpdOptions: avgSpdTmp,
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

       return this.buildStatOneYear(result);
    }

    /**
     * build object for year-statistic
     *
     * @param data
     */
    buildStatOneYear(data) {

        // add total stat
        let dataCommon = [];
        for (var  i = 0 ; i < data.length; i++) {
            let tmp = JSON.parse(JSON.stringify(data[i]));
            tmp.Bike = "TOTAL";
            dataCommon.push(tmp);
        }
        data = data.concat(dataCommon);

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
                result[d.Bike]['Maxavgspd'] = [0, 0];
                result[d.Bike]['Time'] = 0;
                result[d.Bike]['Asf'] = 0;
                result[d.Bike]['Tvp'] = 0;
                result[d.Bike]['Grn'] = 0;
                result[d.Bike]['Bzd'] = 0;
                result[d.Bike]['Months'] = [[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0]];
                result[d.Bike]['Avgspd'] = 0;
                result[d.Bike]['Avgpls'] = [0, 0];
                result[d.Bike]['LastDate'] = 0;
                result[d.Bike]['LastDist'] = 0;
                result[d.Bike]['LastAvgspd'] = 0;
                result[d.Bike]['LastAvgpls'] = 0;
                result[d.Bike]['LastBike'] = "";

            }

            result[d.Bike]['Count']++;
            result[d.Bike]['Dist'] += d.Dist ;
            result[d.Bike]['Maxpls'] = (d.Maxpls > result[d.Bike]['Maxpls'][0]) ? [d.Maxpls, d.Date] : result[d.Bike]['Maxpls'];
            result[d.Bike]['Maxspd'] = (d.Maxspd > result[d.Bike]['Maxspd'][0]) ? [d.Maxspd, d.Date] : result[d.Bike]['Maxspd'];
            result[d.Bike]['Maxdst'] = (d.Dist > result[d.Bike]['Maxdst'][0]) ? [d.Dist, d.Date] : result[d.Bike]['Maxdst'];
            result[d.Bike]['Maxavgspd'] = ((d.Dist / d.Time * 60 * 60) > result[d.Bike]['Maxavgspd'][0]) ? [(d.Dist / d.Time * 60 * 60).toFixed(2), d.Date] : result[d.Bike]['Maxavgspd'];
            result[d.Bike]['Time'] += d.Time;
            result[d.Bike]['Asf'] += (d.Dist / 100 * d.Surfasf);
            result[d.Bike]['Tvp'] += (d.Dist / 100 * d.Surftvp);
            result[d.Bike]['Grn'] += (d.Dist / 100 * d.Surfgrn);
            result[d.Bike]['Bzd'] += (d.Dist / 100 * d.Srfbzd);

            let month = (new Date(d.Date*1000)).getMonth();
            result[d.Bike]['Months'][month] = [result[d.Bike]['Months'][month][0] += d.Dist, result[d.Bike]['Months'][month][1] + 1, 0 ];

            if (d.Avgpls > 0) {
                result[d.Bike]['Avgpls'] = [result[d.Bike]['Avgpls'][0] + d.Avgpls, result[d.Bike]['Avgpls'][1]+1];
            }

            if (d.Date > result[d.Bike]['LastDate']) {
                result[d.Bike]['LastDate'] = d.Date;
                result[d.Bike]['LastDist'] = d.Dist;
                result[d.Bike]['LastAvgpls'] = d.Avgpls;
                result[d.Bike]['LastAvgspd'] = (d.Dist / d.Time * 60 * 60).toFixed(2);
                if (d.Bike === "TOTAL" ) result[d.Bike]['LastBike'] = d.Id;
            }
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

            // build month dist percents
            let maxMonthDist = 0;
            for (var z = 0 ; z < result[bike].Months.length ; z++) {
                if (result[bike].Months[z][0] > maxMonthDist) maxMonthDist = result[bike].Months[z][0];
            }

            for (var z = 0 ; z < result[bike].Months.length ; z++) {
                result[bike].Months[z][2] = r.Months[z][0] / maxMonthDist * 100;
            }

            result[bike].Avgpls = (r.Avgpls[0] / r.Avgpls[1]).toFixed();
            result[bike].Avgspd = (r.Dist / r.Time * 60 * 60).toFixed(2);
        }

        // last bike for common
        for (let z = 0 ; z < data.length; z++) {
            if (data[z].Id === result['TOTAL']['LastBike']) {
                result['TOTAL']['LastBike'] = data[z].Bike;
                break;
            }
        }

        return result;
    }


    getForeignStat() {
        this.getData(document.getElementById("foreign").value);
    }

    getMyStat() {
        document.getElementById("foreign").value = "";
        this.getData();
    }

    reload(data) {
        this.setState({
            statData: data,
        });

        this.buildCharts(data);
    }


    /**
     * render
     * @returns {*}
     */
    render() {

        let tiresOdo = (odo) => {
            let res = '';
            Object.keys(odo).forEach(function(key) {
                res += '<tr key="' + key + '"><td>' + key + '</td><td className="colorred textBold" align="right">' + odo[key].toFixed(2) + ' km</td><td><div style={{wide: }} className="monthPerc"></div></td></tr>';
            });
            return res;
        };


        return (
            <div className="uk-container">
                <h1>Statistic</h1>
                Watch another Stat by login: <input id="foreign" type={'text'} name={'foreignLogin'} placeholder={'Login'} /><button onClick={this.getForeignStat}>Watch</button> <button onClick={this.getData}>My map</button>
                <br />
                <div className="uk-grid">
                    <div className="uk-width-1-2@m uk-width-1-1@s">
                        <div className="uk-grid">
                            <div className="uk-width-1-2@m uk-width-1-1@s">
                                <YearList data={this.state.optionsOdoYear} years={JSON.parse(JSON.stringify( this.state.years )).reverse()}/>
                            </div>
                            <div className="uk-width-1-2@m uk-width-1-1@s">
                                <HighchartsReact
                                    highcharts={Highcharts}
                                    options={this.state.odoCommonOptions}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="uk-width-1-2@m uk-width-1-1@s">
                        <HighchartsReact
                            highcharts={Highcharts}
                            options={this.state.odoOptions}
                        />
                    </div>
                </div>
                <br />
                <div className="uk-row" align="center">
                    <h1><span onClick={this.preYear}>-</span>{this.state.curYear}<span onClick={this.nextYear}>+</span></h1>
                    <DistStat data={this.state.curYearStat} />
                </div>
                <h4>Tires odo</h4>
                <table>
                    <tbody style={{width: '100%'}} dangerouslySetInnerHTML={{__html: tiresOdo(this.state.tiresOdo)}}/>
                </table>
                <h2>Activity</h2>
                <div className="uk-flex-center" uk-grid="true">
                    <div className="uk-flex-first">January<Calendar data={this.state.rideDaysArr} year={this.state.curYear} month={0} /></div>
                    <div>Febrary<Calendar data={this.state.rideDaysArr} year={this.state.curYear} month={1} /></div>
                    <div>Marth<Calendar data={this.state.rideDaysArr} year={this.state.curYear} month={2} /></div>
                    <div>April<Calendar data={this.state.rideDaysArr} year={this.state.curYear} month={3} /></div>
                    <div>May<Calendar data={this.state.rideDaysArr} year={this.state.curYear} month={4} /></div>
                    <div>June<Calendar data={this.state.rideDaysArr} year={this.state.curYear} month={5} /></div>
                    <div>Jule<Calendar data={this.state.rideDaysArr} year={this.state.curYear} month={6} /></div>
                    <div>August<Calendar data={this.state.rideDaysArr} year={this.state.curYear} month={7} /></div>
                    <div>September<Calendar data={this.state.rideDaysArr} year={this.state.curYear} month={8} /></div>
                    <div>October<Calendar data={this.state.rideDaysArr} year={this.state.curYear} month={9} /></div>
                    <div>November<Calendar data={this.state.rideDaysArr} year={this.state.curYear} month={10} /></div>
                    <div className="uk-flex-last">December<Calendar data={this.state.rideDaysArr} year={this.state.curYear} month={11} /></div>
                </div>
                <br />
                <HighchartsReact
                    highcharts={Highcharts}
                    options={this.state.odoYearOptions}
                />
                <br />
                <div className="uk-grid">
                    <div className="uk-width-1-2@m uk-width-1-1@s">
                        <HighchartsReact
                            highcharts={Highcharts}
                            options={this.state.avgPlsOptions}
                        />
                    </div>
                    <div className="uk-width-1-2@m uk-width-1-1@s">
                        <HighchartsReact
                            highcharts={Highcharts}
                            options={this.state.avgSpdOptions}
                        />
                    </div>
                </div>
                <h1>Data</h1>
                    <StatDataTable reload={this.reload} data={this.state.statData} odoYear={this.state.optionsOdoYear} tires={this.state.tires} userId={this.props.state.userId} token={this.props.state.token} done={this.props.done}/>
                <br />
                <h1>Technical data</h1>
                    <TechDataTable data={this.state.statData}/>
            </div>

        );
    }

}

export default Statistic