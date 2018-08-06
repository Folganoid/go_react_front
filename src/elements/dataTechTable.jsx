import React from 'react';

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

        return "<h1>sdfsdfsd</h1>";

    }

    /**
     * convert date
     *
     * @param date
     * @returns {string}
     */
    humanDate(date) {

        let mnth = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        let d = new Date(date * 1000);
        let day = (d.getDate() < 10) ? "0" + d.getDate() : d.getDate();
        return day + " " + mnth[d.getMonth()] + " " + d.getFullYear();
    }

    /**
     * convert time
     *
     * @param t
     * @returns {string}
     */
    convertTimeStampToDate(t) {
        var h = Math.floor((t / 3600));
        var s = t % 60;
        var m = (t - s - h*3600) / 60;

        if (m < 10) m = "0" + m;
        if (s < 10) s = "0" + s;
        if (h < 10) h = "0" + h;

        return h + ":" + m + ":" + s;
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