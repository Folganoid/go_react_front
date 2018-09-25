import React from 'react';
import * as statFuncs from './statFuncs';
import SETUP from "../config";
import axios from 'axios';

const direction = {
    "8": "⇡",
    "9": "↗",
    "6": "⇢",
    "3": "↘",
    "2": "⇣",
    "1": "↙",
    "4": "⇠",
    "7": "↖",
    "5": " ",
};

/**
 *
 */
class StatDataTable extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            filter: "",

            "modalPrim": "",
            "modalDate": "",
            "modalTime": "",
            "modalDist": "",

            "setBike": 0,
            "setTires": 0,
        }

        this.handleInputChange = this.handleInputChange.bind(this);
        this.buildData = this.buildData.bind(this);
        this.statListInit = this.statListInit.bind(this);
        this.changeModal = this.changeModal.bind(this);
        this.editModal = this.editModal.bind(this);
        this.saveModal = this.saveModal.bind(this);
        this.cancelModal = this.cancelModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.setModalTime = this.setModalTime.bind(this);
        this.setModalDate = this.setModalDate.bind(this);
        this.setBike = this.setBike.bind(this);
        this.setTires = this.setTires.bind(this);
        this.setDir = this.setDir.bind(this);
        this.deleteModal = this.deleteModal.bind(this);

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

            result += "<tr id='cal"+ tmpData[d].Id +"' key='"+tmpData[d].Id+"' class='cellStat' value='"+ tmpData[d].Id +"'><td>" + date +
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

    /**
     * fill modal-window data
     * @param statId
     */
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
                    "modalWind": (this.props.data[i].Wind.split("@")[1]) ? this.props.data[i].Wind.split("@")[1] : "",
                    "modalDir": (this.props.data[i].Wind.split("@")[0]) ? this.props.data[i].Wind.split("@")[0]: "",
                    "modalId": statId,
                });

                document.getElementById('statModal').style['display'] = "block";

                break;
            }
        }
    }

    /**
     * edit button
     */
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

    /**
     * save button
     */
    saveModal() {

        let formData = new FormData();

        let windForm = (this.state.modalWind === undefined || this.state.modalDir === 5) ? "" : this.state.modalDir + "@" + this.state.modalWind;
        let temp = (this.state.modalTemp === undefined) ? "" : this.state.modalTemp;
        let prim = (this.state.modalPrim === undefined) ? "" : this.state.modalPrim;
        let teh = (this.state.modalTeh === undefined) ? "" : this.state.modalTeh;

        formData.append('userid', this.props.userId);
        formData.append('token', this.props.token);
        formData.append('bike', this.state.modalBike);
        formData.append('tire', this.state.modalTires);;
        formData.append('date', this.state.modalDate);
        formData.append('time', this.state.modalTime);
        formData.append('dist', this.state.modalDist);
        formData.append('prim', prim);
        formData.append('maxspd', this.state.modalMaxspd);
        formData.append('maxpls', this.state.modalMaxpls);
        formData.append('avgpls', this.state.modalAvgpls);
        formData.append('asf', this.state.modalSurfasf);
        formData.append('tvp', this.state.modalSurftvp);
        formData.append('grn', this.state.modalSurfgrn);
        formData.append('bzd', this.state.modalSrfbzd);
        formData.append('temp', temp);
        formData.append('teh', teh);
        formData.append('wind', windForm);
        formData.append('id', this.state.modalId);

        let that = this;

        axios({
            method: 'PUT',
            url: SETUP.goHost + '/stat',
            data: formData,
            config: {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Origin': SETUP.reactHost,
                }
            },

        }).then(function (response) {
            that.props.done("Data saved successfully.", "uk-alert-primary");

            let tmpData = JSON.parse(JSON.stringify(that.props.data));

            for (let i = 0 ; i < tmpData.length ; i++) {
                if (+that.state.modalId === +tmpData[i].Id) {

                    tmpData[i].Bike = that.state.modalBike;
                    tmpData[i].Tires = that.state.modalTires;
                    tmpData[i].Date = +that.state.modalDate;
                    tmpData[i].Time = +that.state.modalTime;
                    tmpData[i].Dist = +that.state.modalDist;
                    tmpData[i].Date = +that.state.modalDate;
                    tmpData[i].Prim = prim;
                    tmpData[i].Maxspd = +that.state.modalMaxspd;
                    tmpData[i].Avgpls = +that.state.modalAvgpls;
                    tmpData[i].Maxpls = +that.state.modalMaxpls;
                    tmpData[i].Surfasf = +that.state.modalSurfasf;
                    tmpData[i].Surftvp = +that.state.modalSurftvp;
                    tmpData[i].Surfgrn = +that.state.modalSurfgrn;
                    tmpData[i].Srfbzd = +that.state.modalSrfbzd;
                    tmpData[i].Temp = temp;
                    tmpData[i].Teh = that.state.modalTeh;
                    tmpData[i].Wind = windForm;
                    break;

                }
            }

            that.props.reload(tmpData);
            that.cancelModal();
            that.closeModal();

        }).catch((error) => {
            if (error.response) {
                that.props.done("Error! Can't save ride statistic.", "uk-alert-warning");
            }
        });
    }


    /**
     * cancel button
     */
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

    /**
     * close button
     */
    closeModal() {
        document.getElementById('statModal').style['display'] = "none";
        this.cancelModal();
    }

    /**
     * delete button
     */
    deleteModal() {
        let formData = new FormData();

        formData.append('userid', this.props.userId);
        formData.append('token', this.props.token);
        formData.append('id', this.state.modalId);

        let that = this;

        axios({
            method: 'DELETE',
            url: SETUP.goHost + '/stat',
            data: formData,
            config: {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Origin': SETUP.reactHost,
                }
            },

        }).then(function () {
            that.props.done("Data deleted successfully.", "uk-alert-primary");
            let tmpData = JSON.parse(JSON.stringify(that.props.data));

            for (let i = 0 ; i < tmpData.length ; i++) {
                if (+that.state.modalId === +tmpData[i].Id) {
                    tmpData.splice(i, 1);
                }
            }

            that.props.reload(tmpData);
            that.cancelModal();
            that.closeModal();

        }).catch((error) => {
            if (error.response) {
                that.props.done("Error! Can't delete statistic.", "uk-alert-warning");
            }
        });
    }

    /**
     * choose time
     * @param e
     */
    setModalTime(e) {
        let cnt = +e.target.value;
        this.setState({
          "modalTime": this.state.modalTime + cnt,
       });
    }

    /**
     * choose date
     * @param e
     */
    setModalDate(e) {
        let cnt = +e.target.value;
        this.setState({
          "modalDate": this.state.modalDate + cnt,
       });
    }

    /**
     * choose bike
     * @param e
     */
    setBike(e) {

        let cnt = +e.target.value;
        let setCount = this.state.setBike + cnt;

        let res = [];
        for (var k in this.props.odoYear){
            if (this.props.odoYear.hasOwnProperty(k)) {
                if (k !== "COMMON") res.push(k);
            }
        }

        if (res[setCount]) {
            this.setState({
                "modalBike": res[setCount],
                "setBike": setCount,
            });
        }
    }

    /**
     * choose tires
     * @param e
     */
    setTires(e) {

        let cnt = +e.target.value;
        let setCount = this.state.setTires + cnt;

        if (this.props.tires[setCount]) {
            this.setState({
                "modalTires": this.props.tires[setCount],
                "setTires": setCount,
            });
        }
    }

    /**
     * set winow dir
     * @param e
     */
    setDir(e) {

        let cnt = +e.target.value;
        let setCount = (+this.state.modalDir + cnt === 5) ? +this.state.modalDir + cnt*2 : +this.state.modalDir + cnt;

        if (direction[setCount] !== undefined) {
            this.setState({
                "modalDir": setCount,
            });

        }
    }

    /*
    * render
     */
    render() {

        let avgSpd = this.state.modalDist / this.state.modalTime * 3600;

        let ht = statFuncs.convertTimeStampToDate(this.state.modalTime).split(":");
        let hr = ht[0];
        let mn = ht[1];
        let sc = ht[2];

        let surf = +this.state.modalSrfbzd + +this.state.modalSurfgrn + +this.state.modalSurftvp + +this.state.modalSurfasf;
        let surfVal = (surf === 100);
        let totalSurf = (surfVal) ? "" : "invalid_stat_data";

        return (
            <div>

                <div id="statModal" className="uk-container">
                    <h1>{this.state.modalPrim}</h1> 
                    <dd className="modalEdit"><input name="modalPrim" onChange={this.handleInputChange} value={this.state.modalPrim} /></dd>
                    <table width="100%">
                        <tbody>
                            <tr className="modalShow"><td width="30%">Bike:</td><td width="70%">{this.state.modalBike}</td></tr>
                            <tr className="modalEdit"><td width="30%">Bike:</td><td width="70%"><button value="-1" onClick={this.setBike}>{"-"}</button><input name="modalBike" onChange={this.handleInputChange} value={this.state.modalBike} /><button value="1" onClick={this.setBike}>{"+"}</button></td></tr>
                            <tr className="modalShow"><td width="30%">Tires:</td><td width="70%">{this.state.modalTires}</td></tr>
                            <tr className="modalEdit"><td width="30%">Tires:</td><td width="70%"><button value="-1" onClick={this.setTires}>{"-"}</button><input name="modalTires" onChange={this.handleInputChange} value={this.state.modalTires} /><button value="1" onClick={this.setTires}>{"+"}</button></td></tr>
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
                            <tr className="modalEdit"><td width="30%">Offroad:</td><td width="70%"><input name="modalSrfbzd" onChange={this.handleInputChange} value={this.state.modalSrfbzd} /></td></tr>
                            <tr className="modalEdit"><td className={totalSurf} width="30%">Total:</td><td width="70%">{surf+""}</td></tr>
                            <tr className="modalShow"><td width="30%">Temperature:</td><td width="70%">{this.state.modalTemp}</td></tr>
                            <tr className="modalEdit"><td width="30%">Temperature:</td><td width="70%"><input name="modalTemp" onChange={this.handleInputChange} value={this.state.modalTemp} /></td></tr>
                            <tr className="modalShow"><td width="30%">Technical notice:</td><td width="70%">{this.state.modalTeh}</td></tr>
                            <tr className="modalEdit"><td width="30%">Technical notice:</td><td width="70%"><input name="modalTeh" onChange={this.handleInputChange} value={this.state.modalTeh} /></td></tr>
                            <tr className="modalShow"><td width="30%">Wind:</td><td width="70%">{this.state.modalWind}</td></tr>
                            <tr className="modalEdit"><td width="30%">Wind:</td><td width="70%"><input name="modalWind" onChange={this.handleInputChange} value={this.state.modalWind} /><button value="-1" onClick={this.setDir}>{"<"}</button>{direction[this.state.modalDir]}<button value="1" onClick={this.setDir}>{">"}</button></td></tr>
                        </tbody>
                    </table>

                    <button id = "closeModal" onClick={this.closeModal}>Close</button>
                    <button id = "editModal" onClick={this.editModal}>Edit</button>
                    <button id = "saveModal" onClick={this.saveModal}>Save</button>
                    <button id = "cancelModal" onClick={this.cancelModal}>Cancel</button>
                    <button className="modalEdit" id = "deleteModal" onClick={this.deleteModal}>Delete</button>
                </div>

                <input name="filter" onChange={this.handleInputChange} placeholder="Filter"/>
                <table style={{width: '100%'}} dangerouslySetInnerHTML={{__html: this.buildData(this.props.data, this.state.filter)}}/>
            </div>
        )
    }
}

export default StatDataTable