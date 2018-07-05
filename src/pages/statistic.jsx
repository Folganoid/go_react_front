import React from 'react';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import SETUP from "../config";
import axios from 'axios';


const options = {
    title: {
        text: 'My chart'
    },
    series: [{
        data: [1, 2, 3]
    }]
};

const App = () => <div>
    <HighchartsReact
        highcharts={Highcharts}
        options={options}
    />
</div>;


class Statistic extends React.Component {

    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        return <App />
    }

}

export default Statistic