import React from 'react';
import * as statFuncs from './statFuncs';

class StatDataTable extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            filter: "",

            "modalPrim": "",
            "modalDate": "",
            "modalTime": "",
            "modalDist": "",
        }

        this.handleInputChange = this.handleInputChange.bind(this);
        this.buildData = this.buildData.bind(this);
        this.statListInit = this.statListInit.bind(this);
        this.changeModal = this.changeModal.bind(this);
        this.editModal = this.editModal.bind(this);
        this.saveModal = this.saveModal.bind(this);
        this.cancelModal = this.cancelModal.bind(this);

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

            result += "<tr key='"+tmpData[d].Id+"' class='cellStat' value='"+ tmpData[d].Id +"'><td>" + date +
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

    componentDidUpdate() {
        this.statListInit();
    }

    componentDidMount() {
       this.statListInit();
    }

    /**
     * Init stat List click
     * @return {[type]} [description]
     */
    statListInit() {

        let list = document.getElementsByClassName("cellStat");
            if (list) {
                for (let a = 0 ; a < list.length ; a++) {
                    list[a].onclick = () => {
                        this.changeModal(list[a].getAttribute("value"));
                    };
                }
            }
    }

    changeModal(statId) {

        for (let i = 0 ; i < this.props.data.length ; i++) {

            if (+this.props.data[i].Id === +statId) {

                this.setState({
                    "modalAvgpls": this.props.data[i].Avgpls,
                    "modalBike": this.props.data[i].Bike,
                    "modalDate": this.props.data[i].Date,
                    "modalDist": this.props.data[i].Dist,
                    "modalMaxpls": this.props.data[i].Maxpls,
                    "modalMaxspd": this.props.data[i].Maxspd,
                    "modalPrim": this.props.data[i].Prim,
                    "modalSrfbzd": this.props.data[i].Srfbzd,
                    "modalSurfasf": this.props.data[i].Surfasf,
                    "modalSurftvp": this.props.data[i].Surftvp,
                    "modalSurfgrn": this.props.data[i].Surfgrn,
                    "modalTeh": this.props.data[i].Teh,
                    "modalTemp": this.props.data[i].Temp,
                    "modalTime": this.props.data[i].Time,
                    "modalTires": this.props.data[i].Tires,
                    "modalWind": this.props.data[i].Wind,
                    "modalId": this.props.data[i].Id,
                });

                document.getElementById('statModal').style['display'] = "block";

                break;
            }
        }
    }

    editModal() {
        document.getElementById('saveModal').style['display'] = "inline";
        document.getElementById('cancelModal').style['display'] = "inline";
        document.getElementById('editModal').style['display'] = "none";
    }

    saveModal() {

    }

    cancelModal() {
        document.getElementById('saveModal').style['display'] = "none";
        document.getElementById('cancelModal').style['display'] = "none";
        document.getElementById('editModal').style['display'] = "inline";
    }

    render() {

        let avgSpd = this.state.modalDist / this.state.modalTime * 3600;
        return (
            <div>

                <div id="statModal" className="uk-container">
                    <h1>{this.state.modalPrim}</h1> 
                    <dd><input name="modalPrim" onChange={this.handleInputChange} value={this.state.modalPrim} /></dd>
                    <dd>{this.state.modalBike} / {this.state.modalTires}</dd>
                    <dd>{statFuncs.humanDate(this.state.modalDate)}</dd>
                    <dd><input name="modalDate" onChange={this.handleInputChange} value={this.state.modalDate} /></dd>
                    <dd>{this.state.modalDist}</dd>
                    <dd>{statFuncs.convertTimeStampToDate(this.state.modalTime)}</dd>
                    <dd>{avgSpd.toFixed(2)}</dd>
                    <dd>{this.state.modalMaxpls}</dd>
                    <dd>{this.state.modalMaxspd}</dd>
                    <dd>{this.state.modalSrfbzd}</dd>
                    <dd>{this.state.modalSurfasf}</dd>
                    <dd>{this.state.modalSurftvp}</dd>
                    <dd>{this.state.modalSurfgrn}</dd>
                    <dd>{this.state.modalTeh}</dd>
                    <dd>{this.state.modalTemp}</dd>
                    <dd>{this.state.modalWind}</dd>
                    <button id = "closeModal" onClick={()=> {document.getElementById('statModal').style['display'] = "none"}}>Close</button>
                    <button id = "editModal" onClick={this.editModal}>Edit</button>
                    <button id = "saveModal" onClick={this.saveModal}>Save</button>
                    <button id = "cancelModal" onClick={this.cancelModal}>Cancel</button>
                </div>

                <input name="filter" onChange={this.handleInputChange} placeholder="Filter"/>
                <table style={{width: '100%'}} dangerouslySetInnerHTML={{__html: this.buildData(this.props.data, this.state.filter)}}/>
            </div>
        )
    }
}

export default StatDataTable