import React from 'react';

/**
 * build calendar table for one month
 *
 * @param year
 * @param month
 * @param data
 * @returns {*}
 */
function buildCalendarMonth(year, month, data) {

    let tmpArr = [["Mon", "Tus", "Wed", "Thu", "Fri", "Sat", "Sun"]];
    let crd = 1;

    // build structure array
    for(let i = 1; i < 32; i++)  {
        let date = new Date(year, month, i);
        if(!validate_date(year, month, i)) break;

        if(i === 1) {
            tmpArr.push([0,0,0,0,0,0,0]);
        }

        if (date.getDay() === 0) tmpArr[crd][6] = i;
        else tmpArr[crd][date.getDay() - 1] = i;

        if(date.getDay() === 0) {
            tmpArr.push([0,0,0,0,0,0,0]);
            crd++;
        }
    }

    // build html table
    let result = "";
    for (let z = 0 ; z < tmpArr.length; z++) {
        result += "<tr>";
        for (let x = 0 ; x < 7; x++) {
            if (tmpArr[z][x] === 0) {
                result += "<td></td>";
                continue;
            }

            let touch = false; // weekend

            if (data[month] !== undefined) {
                if (data[month][tmpArr[z][x]] !== undefined) {
                    if (x > 4) tmpArr[z][x] = "<span class='colorred'>" + tmpArr[z][x] + "</span>";
                    result += "<td align='center' class='calRideDay'>" + tmpArr[z][x] + "</td>";
                    touch = true;
                }
            }

            if (tmpArr[z][x].length > 2) {
                tmpArr[z][x] = "<b>" + tmpArr[z][x] + "</b>";
                if (x > 4) tmpArr[z][x] = "<span class='colorred'>" + tmpArr[z][x] + "</span>";
            }
            if (!touch) {
                if (x > 4) tmpArr[z][x] = "<span class='colorred'>" + tmpArr[z][x] + "</span>";
                result += "<td align='center'>" + tmpArr[z][x] + "</td>";
            }
        }
        result += "</tr>";
    }

    return <table className="calMonth">
        <tbody dangerouslySetInnerHTML={{ __html: result}} />
    </table>
}

/**
 * Date validator
 *
 * @param y
 * @param m
 * @param d
 * @returns {boolean}
 */
function validate_date(y, m, d)
{
    var dt = new Date(y, m, d);
    if ((dt.getFullYear() == y) && (dt.getMonth() == m) && (dt.getDate() == d)) {
        return true;
    } else {
        return false;
    }
}



class Calendar extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {

        return buildCalendarMonth(this.props.year, this.props.month, this.props.data);
    }
}

export default Calendar