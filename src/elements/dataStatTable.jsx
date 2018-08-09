import React from 'react';
import * as statFuncs from './statFuncs';

class StatDataTable extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            filter: "",
        }

        this.handleInputChange = this.handleInputChange.bind(this);
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
     * build data
     *
     * @returns {string}
     */
    buildData() {

        // filter DESC
        function compare(a,b) {
            if (a.Date < b.Date)
                return 1;
            if (a.Date > b.Date)
                return -1;
            return 0;
        }

        let tmpData = JSON.parse(JSON.stringify(this.props.data));
        tmpData.sort(compare);

        let result = "";

        for (let d = 0; d < tmpData.length; d++) {

            let teh = (tmpData[d].Teh.length > 0) ? "*" : "";

            result += "<tr><td>" + statFuncs.humanDate(tmpData[d].Date) +
                "</td><td>" + tmpData[d].Bike +
                "</td><td>" + tmpData[d].Prim +
                "</td><td>" + tmpData[d].Dist +
                "</td><td>" + statFuncs.convertTimeStampToDate(tmpData[d].Time) +
                "</td><td>" + tmpData[d].Temp +
                "</td><td>" + teh +
                "</td></tr>";
        }

        return result;
    }

    render() {
        return (
            <div>
                <input name="filter" onChange={this.handleInputChange} placeholder="Filter"/>
                <table style={{width: '100%'}} dangerouslySetInnerHTML={{__html: this.buildData()}}/>
            </div>
        )
    }
}

export default StatDataTable