import React from 'react';
import * as statFuncs from './statFuncs';

const direction = {
    "8": "⇡",
    "9": "↗",
    "6": "⇢",
    "3": "↘",
    "2": "⇣",
    "1": "↙",
    "4": "⇠",
    "7": "↖",
};

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
        this.setModalTime = this.setModalTime.bind(this);
        this.setModalDate = this.setModalDate.bind(this);

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
            let wind = tmpData[d].Wind;

            let aaa = wind.split("@");
            let windRes = "";
            if(aaa && aaa[0] && aaa[1]) windRes = aaa[1] + " " + direction[aaa[0]];

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
                "</td><td>" + windRes +
                "</tr>";
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

        for (let i = 0 ; i < document.getElementsByClassName('modalShow').length ; i++) {
            document.getElementsByClassName('modalShow')[i].style['display'] = "none";            
        }

        for (let i = 0 ; i < document.getElementsByClassName('modalEdit').length ; i++) {
            document.getElementsByClassName('modalEdit')[i].style['display'] = "table-row";            
        }

        document.getElementById('editModal').style['display'] = "none";
    }

    saveModal() {

    }

    cancelModal() {
        document.getElementById('saveModal').style['display'] = "none";
        document.getElementById('cancelModal').style['display'] = "none";
        for (let i = 0 ; i < document.getElementsByClassName('modalShow').length ; i++) {
            document.getElementsByClassName('modalShow')[i].style['display'] = "table-row";            
        }

        for (let i = 0 ; i < document.getElementsByClassName('modalEdit').length ; i++) {
            document.getElementsByClassName('modalEdit')[i].style['display'] = "none";            
        }
        document.getElementById('editModal').style['display'] = "inline";
    }

    setModalTime(e) {
        let cnt = +e.target.value;
        this.setState({
          "modalTime": this.state.modalTime + cnt,
       });
    }

    setModalDate(e) {
        let cnt = +e.target.value;
        this.setState({
          "modalDate": this.state.modalDate + cnt,
       });
    }

    render() {

        let avgSpd = this.state.modalDist / this.state.modalTime * 3600;

        let ht = statFuncs.convertTimeStampToDate(this.state.modalTime).split(":");
        let hr = ht[0];
        let mn = ht[1];
        let sc = ht[2];

        return (
            <div>

                <div id="statModal" className="uk-container">
                    <h1>{this.state.modalPrim}</h1> 
                    <dd className="modalEdit"><input name="modalPrim" onChange={this.handleInputChange} value={this.state.modalPrim} /></dd>
                    <table width="100%">
                        <tbody>
                            <tr className="modalShow"><td width="30%">Bike:</td><td width="70%">{this.state.modalBike}</td></tr>
                            <tr className="modalEdit"><td width="30%">Bike:</td><td width="70%"><input name="modalBike" onChange={this.handleInputChange} value={this.state.modalBike} /></td></tr>
                            <tr className="modalShow"><td width="30%">Tires:</td><td width="70%">{this.state.modalTires}</td></tr>
                            <tr className="modalEdit"><td width="30%">Tires:</td><td width="70%"><input name="modalTires" onChange={this.handleInputChange} value={this.state.modalTires} /></td></tr>
                            <tr><td width="30%">Date:</td><td width="70%"><button value="-86400" onClick={this.setModalDate} className="modalEdit">{"-"}</button>{statFuncs.humanDate(this.state.modalDate)}<button className="modalEdit" value="86400" onClick={this.setModalDate}>{"+"}</button></td></tr>
                            <tr className="modalShow"><td width="30%">Dist:</td><td width="70%">{this.state.modalDist}</td></tr>
                            <tr className="modalEdit"><td width="30%">Dist:</td><td width="70%"><input name="modalDist" onChange={this.handleInputChange} value={this.state.modalDist} /></td></tr>
                            <tr className="modalShow"><td width="30%">Time:</td><td width="70%">{statFuncs.convertTimeStampToDate(this.state.modalTime)}</td></tr>
                            <tr className="modalEdit"><td width="30%">Time:</td><td width="70%">
                                <button value="-3600" onClick={this.setModalTime}>{"-"}</button>{hr}<button value="3600" onClick={this.setModalTime}>{"+"}</button>
                                <button value="-60" onClick={this.setModalTime}>{"-"}</button>{mn}<button value="60" onClick={this.setModalTime}>{"+"}</button>
                                <button value="-1" onClick={this.setModalTime}>{"-"}</button>{sc}<button value="1" onClick={this.setModalTime}>{"+"}</button>
                            </td></tr>
                            <tr><td width="30%">Average speed:</td><td width="70%">{avgSpd.toFixed(2)}</td></tr>
                            <tr className="modalShow"><td width="30%">Maximal speed:</td><td width="70%">{this.state.modalMaxspd}</td></tr>
                            <tr className="modalEdit"><td width="30%">Maximal speed:</td><td width="70%"><input name="modalMaxspd" onChange={this.handleInputChange} value={this.state.modalMaxspd} /></td></tr>
                            <tr className="modalShow"><td width="30%">Average pulse:</td><td width="70%">{this.state.modalAvgpls}</td></tr>
                            <tr className="modalEdit"><td width="30%">Average pulse:</td><td width="70%"><input name="modalAvgpls" onChange={this.handleInputChange} value={this.state.modalAvgpls} /></td></tr>
                            <tr className="modalShow"><td width="30%">Maximal pulse:</td><td width="70%">{this.state.modalMaxpls}</td></tr>
                            <tr className="modalEdit"><td width="30%">Maximal pulse:</td><td width="70%"><input name="modalMaxpls" onChange={this.handleInputChange} value={this.state.modalMaxpls} /></td></tr>
                            <tr className="modalShow"><td width="30%">Asph:</td><td width="70%">{this.state.modalSurfasf}</td></tr>
                            <tr className="modalEdit"><td width="30%">Asph:</td><td width="70%"><input name="modalSurfasf" onChange={this.handleInputChange} value={this.state.modalSurfasf} /></td></tr>
                            <tr className="modalShow"><td width="30%">Bad asph:</td><td width="70%">{this.state.modalSurftvp}</td></tr>
                            <tr className="modalEdit"><td width="30%">Bad asph:</td><td width="70%"><input name="modalSurftvp" onChange={this.handleInputChange} value={this.state.modalSurftvp} /></td></tr>
                            <tr className="modalShow"><td width="30%">Country:</td><td width="70%">{this.state.modalSurfgrn}</td></tr>
                            <tr className="modalEdit"><td width="30%">Country:</td><td width="70%"><input name="modalSurfgrn" onChange={this.handleInputChange} value={this.state.modalSurfgrn} /></td></tr>
                            <tr className="modalShow"><td width="30%">Offroad:</td><td width="70%">{this.state.modalSrfbzd}</td></tr>
                            <tr className="modalEdit"><td width="30%">Offroad:</td><td width="70%"><input name="modalSurfbzd" onChange={this.handleInputChange} value={this.state.modalSurfbzd} /></td></tr>
                            <tr className="modalShow"><td width="30%">Temperature:</td><td width="70%">{this.state.modalTemp}</td></tr>
                            <tr className="modalEdit"><td width="30%">Temperature:</td><td width="70%"><input name="modalTemp" onChange={this.handleInputChange} value={this.state.modalTemp} /></td></tr>
                            <tr className="modalShow"><td width="30%">Technical notice:</td><td width="70%">{this.state.modalTeh}</td></tr>
                            <tr className="modalEdit"><td width="30%">Technical notice:</td><td width="70%"><input name="modalTeh" onChange={this.handleInputChange} value={this.state.modalTeh} /></td></tr>
                            <tr className="modalShow"><td width="30%">Wind:</td><td width="70%">{this.state.modalWind}</td></tr>
                            <tr className="modalEdit"><td width="30%">Wind:</td><td width="70%"><input name="modalWind" onChange={this.handleInputChange} value={this.state.modalWind} /></td></tr>
                        </tbody>
                    </table>

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