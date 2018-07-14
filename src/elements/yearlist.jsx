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
                    result += "<tr><td width='70%'>" + k + ":</td><td width='30%' align='right'>" + this.props.data[k][year] + ((+this.props.data[k][year]%1 === 0) ? ".00" : "") + "</td></tr>";
                }
            }
        }
    return result;
    }

    render() {

        let ylist = this.props.years.map((year, i) => {
            return (<div key={i}>
                <dd><b className="colorred">{year}</b></dd>
                <table style={{width: '90%'}} dangerouslySetInnerHTML={{__html: this.getByYear(year)}}/>
                </div>)
        });

        return (
            <div>
                <h4>Total:</h4>
            <div style={{height: "350px", overflow: "auto"}}>
                {ylist}
            </div>
            </div>
        )
    }
}

export default YearList