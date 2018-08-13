import React from 'react';
import * as statFuncs from './statFuncs';

class StatDataTable extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            filter: "",
        }

        this.handleInputChange = this.handleInputChange.bind(this);
        this.buildData = this.buildData.bind(this);

        console.log(this.state);
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
    buildData(dt, filter) {

        // filter DESC
        function compare(a,b) {
            if (a.Date < b.Date)
                return 1;
            if (a.Date > b.Date)
                return -1;
            return 0;
        }

        let tmpData = JSON.parse(JSON.stringify(dt));
        tmpData.sort(compare);

        let result = "";

        for (let d = 0; d < tmpData.length; d++) {

            let teh = (tmpData[d].Teh.length > 0) ? "*" : "";
            let date = statFuncs.humanDate(tmpData[d].Date);

            // filter
            if (this.state.filter !== "" && 
                tmpData[d].Bike.search(this.state.filter) === -1 &&
                tmpData[d].Prim.search(this.state.filter) === -1 &&
                date.search(this.state.filter) === -1) continue;

            result += "<tr><td>" + date +
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
                <table style={{width: '100%'}} dangerouslySetInnerHTML={{__html: this.buildData(this.props.data, this.state.filter)}}/>
            </div>
        )
    }
}

export default StatDataTable