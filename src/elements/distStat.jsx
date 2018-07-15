import React from 'react';

class DistStat extends React.Component {

    render() {

        let bikeList = Object.keys(this.props.data).map((item, i) => (
            <div key={i}>
                <h2>{this.props.data[item]["Bike"]}</h2>
                <hr />
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