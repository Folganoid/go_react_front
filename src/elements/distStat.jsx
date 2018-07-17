import React from 'react';

class DistStat extends React.Component {

    convertTimeStampToDate(t) {
        var h = Math.floor((t / 3600));
        var s = t % 60;
        var m = (t - s - h*3600) / 60;

        if (m < 10) m = "0" + m;
        if (s < 10) s = "0" + s;

        return h + ":" + m + ":" + s;
    }



    render() {

        let bikeList = Object.keys(this.props.data).map((item, i) => (
            <div key={i}>
                <dd>{this.props.data[item]["Bike"]}</dd>
                <div className="customhr"></div>
                <div className="uk-grid">
                    <div className="uk-width-1-3">
                        <dd>Total dist: {this.props.data[item]['Dist']}</dd>
                        <dd>Total time: {this.convertTimeStampToDate(this.props.data[item]['Time'])}</dd>
                        <dd>Average dist: {this.props.data[item]['AvgDist']}</dd>
                        <dd>Average time: {this.convertTimeStampToDate(this.props.data[item]['AvgTime'])}</dd>
                        <dd>Count: {this.props.data[item]['Count']}</dd>
                        <br />
                        <table width="100%">
                            <tbody>
                                <tr><td width="25%">Asphalt:</td><td width="50%"><div style={{width: this.props.data[item]['Asf'][1] + "%"}} className="surfacePerc"></div></td><td width="25%">{this.props.data[item]['Asf'][0]}</td></tr>
                                <tr><td width="25%">Bad asphalt:</td><td width="50%"><div style={{width: this.props.data[item]['Tvp'][1] + "%"}} className="surfacePerc"></div></td><td width="25%">{this.props.data[item]['Tvp'][0]}</td></tr>
                                <tr><td width="25%">Country:</td><td width="50%"><div style={{width: this.props.data[item]['Grn'][1] + "%"}} className="surfacePerc"></div></td><td width="25%">{this.props.data[item]['Grn'][0]}</td></tr>
                                <tr><td width="25%">Offroad:</td><td width="50%"><div style={{width: this.props.data[item]['Bzd'][1] + "%"}} className="surfacePerc"></div></td><td width="25%">{this.props.data[item]['Bzd'][0]}</td></tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="uk-width-1-3">
                        <table width="100%">
                            <tbody>
                            <tr><td width="60%">Total average speed: </td><td width="40%">{this.props.data[item]['Avgspd']}</td></tr>
                            <tr><td width="60%">Maximum average speed: </td><td width="40%">{this.props.data[item]['Maxavgspd'][0]} / {this.props.data[item]['Maxavgspd'][1]}</td></tr>
                            <tr><td width="60%">Total average pulse: </td><td width="40%">{this.props.data[item]['Avgpls']}</td></tr>
                            <tr><td width="60%">Maximum pulse: </td><td width="40%">{this.props.data[item]['Maxpls'][0]} / {this.props.data[item]['Maxpls'][1]}</td></tr>
                            <tr><td width="60%">Maximum speed: </td><td width="40%">{this.props.data[item]['Maxspd'][0]} / {this.props.data[item]['Maxspd'][1]}</td></tr>
                            <tr><td width="60%">Maximum dist: </td><td width="40%">{this.props.data[item]['Maxdst'][0]} / {this.props.data[item]['Maxdst'][1]}</td></tr>
                            </tbody>
                        </table>
                        <p>{this.props.data[item]['LastBike']}</p>
                        <table>
                            <tbody>
                            <tr><td>Last date</td><td>{this.props.data[item]['LastDate']}</td></tr>
                            <tr><td>Last average speed</td><td>{this.props.data[item]['LastAvgspd']}</td></tr>
                            <tr><td>Last average pulse</td><td>{this.props.data[item]['LastAvgpls']}</td></tr>
                            <tr><td>Last dist</td><td>{this.props.data[item]['LastDist']}</td></tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="uk-width-1-3">
                        <table width="100%">
                            <tbody>
                            <tr><td width="10%">Jan</td><td width="10%">{this.props.data[item]['Months'][0][1]}</td><td width="20%">{this.props.data[item]['Months'][0][0]}</td><td width="60%"><div style={{width: this.props.data[item]['Months'][0][2] + "%"}} className="monthPerc"></div></td></tr>
                            <tr><td width="10%">Feb</td><td width="10%">{this.props.data[item]['Months'][1][1]}</td><td width="20%">{this.props.data[item]['Months'][1][0]}</td><td width="60%"><div style={{width: this.props.data[item]['Months'][1][2] + "%"}} className="monthPerc"></div></td></tr>
                            <tr><td width="10%">Mar</td><td width="10%">{this.props.data[item]['Months'][2][1]}</td><td width="20%">{this.props.data[item]['Months'][2][0]}</td><td width="60%"><div style={{width: this.props.data[item]['Months'][2][2] + "%"}} className="monthPerc"></div></td></tr>
                            <tr><td width="10%">Apr</td><td width="10%">{this.props.data[item]['Months'][3][1]}</td><td width="20%">{this.props.data[item]['Months'][3][0]}</td><td width="60%"><div style={{width: this.props.data[item]['Months'][3][2] + "%"}} className="monthPerc"></div></td></tr>
                            <tr><td width="10%">May</td><td width="10%">{this.props.data[item]['Months'][4][1]}</td><td width="20%">{this.props.data[item]['Months'][4][0]}</td><td width="60%"><div style={{width: this.props.data[item]['Months'][4][2] + "%"}} className="monthPerc"></div></td></tr>
                            <tr><td width="10%">Jun</td><td width="10%">{this.props.data[item]['Months'][5][1]}</td><td width="20%">{this.props.data[item]['Months'][5][0]}</td><td width="60%"><div style={{width: this.props.data[item]['Months'][5][2] + "%"}} className="monthPerc"></div></td></tr>
                            <tr><td width="10%">Jul</td><td width="10%">{this.props.data[item]['Months'][6][1]}</td><td width="20%">{this.props.data[item]['Months'][6][0]}</td><td width="60%"><div style={{width: this.props.data[item]['Months'][6][2] + "%"}} className="monthPerc"></div></td></tr>
                            <tr><td width="10%">Aug</td><td width="10%">{this.props.data[item]['Months'][7][1]}</td><td width="20%">{this.props.data[item]['Months'][7][0]}</td><td width="60%"><div style={{width: this.props.data[item]['Months'][7][2] + "%"}} className="monthPerc"></div></td></tr>
                            <tr><td width="10%">Sep</td><td width="10%">{this.props.data[item]['Months'][8][1]}</td><td width="20%">{this.props.data[item]['Months'][8][0]}</td><td width="60%"><div style={{width: this.props.data[item]['Months'][8][2] + "%"}} className="monthPerc"></div></td></tr>
                            <tr><td width="10%">Oct</td><td width="10%">{this.props.data[item]['Months'][9][1]}</td><td width="20%">{this.props.data[item]['Months'][9][0]}</td><td width="60%"><div style={{width: this.props.data[item]['Months'][9][2] + "%"}} className="monthPerc"></div></td></tr>
                            <tr><td width="10%">Nov</td><td width="10%">{this.props.data[item]['Months'][10][1]}</td><td width="20%">{this.props.data[item]['Months'][10][0]}</td><td width="60%"><div style={{width: this.props.data[item]['Months'][10][2] + "%"}} className="monthPerc"></div></td></tr>
                            <tr><td width="10%">Dec</td><td width="10%">{this.props.data[item]['Months'][11][1]}</td><td width="20%">{this.props.data[item]['Months'][11][0]}</td><td width="60%"><div style={{width: this.props.data[item]['Months'][11][2] + "%"}} className="monthPerc"></div></td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <br />
            </div>
        ));

        return (
            <div className="uk-container">
                {bikeList}
            </div>
        )
    }
}

export default DistStat