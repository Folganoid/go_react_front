import React from 'react';

class YearList extends React.Component {

    /**
     * get odolist by year
     *
     * @param year
     * @returns {string}
     */
    getByYear(year) {
        let result = "";
        for (var k in this.props.data) {
            if (typeof this.props.data[k] !== 'function') {
                if (this.props.data[k][year] > 0) {
                    result += "<dd>" + k + ": " + this.props.data[k][year] + "</dd>";
                }
            }
        }
    return result;
    }

    render() {

        let ylist = this.props.years.map((year, i) => {
            return (<div key={i}>
                <dd><b>{year}</b></dd>
                <div dangerouslySetInnerHTML={{__html: this.getByYear(year)}}/>
                </div>)
        });

        return (
            <div>
                <h4>Total:</h4>
            <div style={{height: "500px", overflow: "auto"}}>
                {ylist}
            </div>
            </div>
        )
    }
}

export default YearList