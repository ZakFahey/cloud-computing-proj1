const fs = require('fs');
const moment = require('moment');
const stats = require("stats-lite");

// Data structure that holds the weather data
let data = {};

function loadData() {
    const dataString = fs.readFileSync('./dailyweather.csv', 'utf8');
    let lines = dataString.split('\n');
    lines.splice(0, 1);
    lines.forEach(l => {
        const vals = l.split(',');
        data[vals[0]] = {
            DATE: vals[0],
            TMAX: parseFloat(vals[1]),
            TMIN: parseFloat(vals[2])
        };
    });
}

// Taken from https://stackoverflow.com/a/36481059
function randomGaussian(mean, stdev) {
    var u = 0, v = 0;
    while (u === 0) u = Math.random(); //Converting [0,1) to (0,1)
    while (v === 0) v = Math.random();
    return mean + Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v) * stdev;
}

// Get a sampling of the surrounding dates to get an idea of what the weather is like
// You should get colder temps in the winter, warmer temps in the summer, etc.
function getTemperatureDistributionAroundDay(date) {
    let d = moment(date, 'YYYYMMDD').add(-7, 'd');
    let averageTemps = []; // Midpoint between high and low for each day
    let ranges = []; // Difference between high and low for each day

    for (let i = 0; i < 14; i++) {
        const dName = d.format('YYYYMMDD');
        if (dName in data) {
            ranges.push(data[dName].TMAX - data[dName].TMIN);
            averageTemps.push((data[dName].TMAX + data[dName].TMIN) / 2);
        }
        d = d.add(1, 'd');
    }

    // Not enough data
    if (averageTemps.length < 4) return null;

    return {
        tempMean: stats.mean(averageTemps),
        tempStdev: stats.stdev(averageTemps),
        rangeMean: stats.mean(ranges),
        rangeStdev: stats.stdev(ranges)
    };
}

loadData();


module.exports.getAllDates = function () {
    return Object.values(data).map(d => ({ DATE: d.DATE}));
};

module.exports.getRecord = function (date) {
    if (!(date in data)) return null;
    return data[date];
};

module.exports.addOrUpdateRecord = function (record) {
    data[record.DATE] = record;
};

module.exports.deleteRecord = function (date) {
    if (!(date in data)) return null;
    const deleted = data[date];
    delete data[date];
    return deleted;
};

module.exports.getForecast = function (date) {
    let dist = getTemperatureDistributionAroundDay(date);
    if (dist === null) return null;

    let d = moment(date, 'YYYYMMDD');
    let result = [];

    for (let i = 0; i < 7; i++) {
        const dName = d.format('YYYYMMDD');
        if (dName in data) {
            result.push(data[dName]);
        } else {
            // Make a guess
            const middle = randomGaussian(dist.tempMean, dist.tempStdev);
            const range = Math.max(0, randomGaussian(dist.rangeMean, dist.rangeStdev));
            result.push({
                DATE: dName,
                TMAX: middle + range / 2,
                TMIN: middle - range / 2
            });
        }
        d = d.add(1, 'd');
    }

    return result;
};