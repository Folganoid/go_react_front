import React from 'react';
import * as statFuncs from './statFuncs';

class TechDataTable extends React.Component {

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

            let odoTehDist = 0;
            let date = statFuncs.humanDate(tmpData[d].Date);
            
            for (let z = 0; z < tmpData.length; z++) {
                if (tmpData[d].Date < tmpData[z].Date && tmpData[d].Bike === tmpData[z].Bike) odoTehDist += tmpData[z].Dist;
            };

            if (tmpData[d].Teh.length === 0) continue;

            // filter
            if (this.state.filter !== "" && 
                tmpData[d].Bike.search(this.state.filter) === -1 &&
                tmpData[d].Teh.search(this.state.filter) === -1 &&
                date.search(this.state.filter) === -1) continue;

            result += "<tr><td width='15%'>" + date +
                "</td><td width='15%'>" + tmpData[d].Bike +
                "</td><td width='60%'>" + tmpData[d].Teh +
                "</td><td width='10%'>" + odoTehDist.toFixed(2) +
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

export default TechDataTable