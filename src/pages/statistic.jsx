import React from 'react';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import SETUP from "../config";
import axios from 'axios';


let odoOptions = {
    colors: ['darkred', 'darkblue', 'darkgreen', 'BlueViolet ', 'Chocolate', 'DarkSlateGrey', 'Red ', 'DimGrey', 'Blue', 'Green'],
    chart: {
        type: 'spline'
    },
    title: {
        text: 'Kilometers',
        x: -20 //center
    },
    subtitle: {
        text: 'Years',
        x: -20
    },
    xAxis: {
        categories: []
    },
    yAxis: {
        title: {
            text: false
        },
        plotLines: [{
            value: 0,
            width: 1,
            color: '#808080'
        }]
    },
    tooltip: {
        valueSuffix: ' km'
    },
    series: [
        {
            name: 'Расстояние',
            data: [10,3,null,3,4]
        },
        {
            name: 'asd',
            data: [1,23,2,24]
        },
    ]
};

function getYearsList(arr) {
    let result = [];
    for (var i = 0; i < arr.length; i++) {
         result.push(arr[i].Year);
    }
    return result.sort().filter(onlyUnique);
}

function getOdoBikeList(arr) {

    let result = {};

    for (var i = 0 ; i < arr.length; i++) {

        if(result[arr[i].Bike] === undefined) result[arr[i].Bike] = {};
        result[arr[i].Bike][arr[i].Year] = arr[i].Dist;
    }
return result;
}

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

/**
 * Statistic
 */
class Statistic extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            yearData: [],
            statData: [],
            years: [],
            optionsOdoYear: [],
        };

        this.getData = this.getData.bind(this);
        this.buildCharts = this.buildCharts.bind(this);
    }

    buildCharts() {
        this.setState({
            years: getYearsList(this.state.yearData),
            optionsOdoYear: getOdoBikeList(this.state.yearData),
        });

        console.log(this.state);
    }

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
            that.setState({yearData: response.data})
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


    render() {
        return (
            <div className="uk-container">
                <h1>Statistic</h1><button onClick={this.getData}>!!!</button>
            <div className="uk-grid">
                <div className="uk-width-1-2">
                    <div className="uk-grid">
                        <div className="uk-width-1-2">Year</div>
                        <div className="uk-width-1-2">Odo</div>
                    </div>
                </div>
                <div className="uk-width-1-2">
                    <HighchartsReact
                        highcharts={Highcharts}
                        options={odoOptions}
                    />
                </div>
            </div>
            </div>

        );
    }

}

export default Statistic