const moment = require('moment');

const kelvinToFarenheit = function (t) {
    var res = (t - 273.15) * 9 / 5 + 32;
    return Math.round(res * 10) / 10; // Round to nearest tenth
};

/*
 * openweathermap.org API has format result > list > [{dt: <unix timestamp>, temp_min: <min temp in Kelvin>, temp_max: <max temp in Kelvin>}]
 * Multiple temperature readings per day, so we need to condense it into a single max & min per day.
 */
module.exports.parseOpenWeatherApi = function (apiResult) {
    const temperatures = apiResult.list;
    var result = [];
    var currentResult = null;
    var lastDate = null;

    temperatures.forEach(t => {
        var date = moment.unix(t.dt).startOf('day');
        if (currentResult === null || date > lastDate) {
            // API is at new day, so add a new entry
            currentResult = {
                DATE: date.format('YYYYMMDD'),
                TMAX: kelvinToFarenheit(t.main.temp_max),
                TMIN: kelvinToFarenheit(t.main.temp_min)
            };
            result.push(currentResult);
        } else {
            // Update existing entry for day if temperature extremes beat current records
            currentResult.TMAX = Math.max(currentResult.TMAX, kelvinToFarenheit(t.main.temp_max));
            currentResult.TMIN = Math.min(currentResult.TMIN, kelvinToFarenheit(t.main.temp_min));
        }
        lastDate = date;
    });

    return result;
};