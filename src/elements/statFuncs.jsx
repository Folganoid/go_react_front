/**
 * Init odoOptions
 * @returns {{colors: string[], chart: {type: string}, title: {text: string, x: number}, subtitle: {text: string, x: number}, xAxis: {categories: Array}, yAxis: {title: {text: boolean}, plotLines: *[]}, tooltip: {valueSuffix: string}, series: Array}}
 */
export function odoOptions() {
    return {
        colors: ['darkred', 'darkblue', 'darkgreen', 'BlueViolet ', 'Chocolate', 'DarkSlateGrey', 'Red ', 'DimGrey', 'Blue', 'Green'],
        chart: {
            type: 'spline'
        },
        title: {
            text: 'Kilometers',
            x: -20 //center
        },
        subtitle: {
            text: 'Years',
            x: -20
        },
        xAxis: {
            categories: []
        },
        yAxis: {
            title: {
                text: false
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
        tooltip: {
            valueSuffix: ' km'
        },
        series: []
    }
}

/**
 * Init odoCommonOptions
 * @returns {{colors: string[], chart: {type: string}, title: {text: string}, subtitle: {text: string}, xAxis: {type: string, labels: {rotation: number, style: {fontSize: string, fontFamily: string}}}, yAxis: {min: number, title: {text: boolean}}, legend: {enabled: boolean}, tooltip: {pointFormat: string}, series: *[]}}
 */
export function odoCommonOptions() {
    return {
        colors: ['darkred'],

        chart: {
            type: 'column'
        },
        title: {
            text: 'Total distance'
        },
        subtitle: {
            text: 'for each bike'
        },
        xAxis: {
            type: 'category',
            labels: {
                rotation: -90,
                style: {
                    fontSize: '8px',
                    fontFamily: 'Verdana, sans-serif'
                }
            }
        },
        yAxis: {
            min: 0,
            title: {
                text: false
            }
        },
        legend: {
            enabled: false
        },
        tooltip: {
            pointFormat: 'Total distance is: <b>{point.y:.1f} km</b>'
        },
        series: [{
            name: 'ТС',
            data: [],
            dataLabels: {
                enabled: true,
                rotation: -90,
                color: '#FFFFFF',
                align: 'right',
                format: '{point.y:.1f}', // one decimal
                y: 10, // 10 pixels down from the top
                style: {
                    fontSize: '12px',
                    fontFamily: 'Verdana, sans-serif'
                }
            }
        }]
    }
}


/**
 * get array of years
 *
 * @param arr
 * @param statArr
 * @returns {*[]}
 */
export function getYearsList(arr, statArr) {
    let result = [];
    for (var i = 0; i < arr.length; i++) {
        result.push(arr[i].Year);
    }

    for (var i = 0; i < statArr.length; i++) {
        result.push((new Date(statArr[i].Date * 1000)).getFullYear());
    }

    return result.sort().filter(onlyUnique);
}

/**
 * get object bike: {year: distant}
 *
 * @param arr
 * @param statArr
 * @returns {{}}
 */
export function getOdoBikeList(arr, statArr) {

    let result = {};
    let common = {};

    for (var i = 0; i < arr.length; i++) {
        if (result[arr[i].Bike] === undefined) result[arr[i].Bike] = {};
        result[arr[i].Bike][arr[i].Year] = arr[i].Dist;

        if (common[arr[i].Year] === undefined) {
            common[arr[i].Year] = arr[i].Dist;
        } else {
            common[arr[i].Year] += arr[i].Dist;
        }
    }

    for (var i = 0; i < statArr.length; i++) {
        var bike = statArr[i].Bike;
        var year = (new Date(statArr[i].Date * 1000)).getFullYear();
        var dist = statArr[i].Dist;

        if (result[bike] === undefined) result[bike] = {};
        if (result[bike][year] === undefined) {
            result[bike][year] = dist;
        } else {
            result[bike][year] += dist;
        }

        if (common[year] === undefined) {
            common[year] = dist;
        } else {
            common[year] += dist;
        }
    }

    result.COMMON = common;
    return result;
}

/**
 * make eries object for highcharts
 *
 * @param optionsOdoYear
 * @param years
 * @returns {Array}
 */
export function makeOdoOptions(optionsOdoYear, years) {

    let result = [];

    for (var k in optionsOdoYear) {
        if (typeof optionsOdoYear[k] !== 'function') {
            //alert("Key is " + k + ", value is" + optionsOdoYear[k]);
            let nameData = k;
            let dataData = [];

            for (var z = 0; z < years.length; z++) {
                if (optionsOdoYear[k][years[z]] !== undefined) {
                    dataData.push(optionsOdoYear[k][years[z]]);
                } else {
                    dataData.push(null);
                }
            }
            result.push({name: nameData, data: dataData});
        }
    }

    return result;
}

export function convertToSumChart(odoOptionsNames) {
    var result = [];
    for (var k in odoOptionsNames) {
        if (typeof odoOptionsNames[k] !== 'function') {
            result.push([odoOptionsNames[k].name, (odoOptionsNames[k].data).reduce(function (a, b) {
                return (a + b)
            })]);
        }
    }
    return result;
}

/**
 * array unique filter
 *
 * @param value
 * @param index
 * @param self
 * @returns {boolean}
 */
export function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

export function getFullYearList(optionsOdoYear) {
    return "1111111";
}