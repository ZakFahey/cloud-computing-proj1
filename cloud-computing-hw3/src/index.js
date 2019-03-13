var host = 'http://localhost:8000';

$('#submit').click(function (e) {
    $('#error').text('');
    $.ajax(host + '/forecast/' + $('#date').val())
        .done(OnAPILoad)
        .fail(OnAPIFail);
    //$.ajax('https://api.weather.gov')
    //    .done(OnExternalAPILoad);
});

function getTableForTemps(temps) {
    return '<table>' +
        '<thead>' +
        '<tr>' +
        '<th>Date</th><th>Max Temp</th><th>Min Temp</th>' +
        '</tr>' +
        '</thead>' +
        '<tbody>' +
        temps.map(function (t) {
            return '<tr><th>' + t.DATE + '</th><th>' + t.TMAX + '</th><th>' + t.TMIN + '</th></tr>';
        }).join('') +
        '</tbody>' +
        '</table>';
}

function OnAPILoad(result) {
    $('#results').html('<h2>Weather forecast from my API</h2>' + getTableForTemps(result));
}

function OnExternalAPILoad(result) {
    $('#results2').html('<h2>Weather forecast from weather.gov</h2>' + getTableFromThirdParty(result));
}

function OnAPIFail(err) {
    $('#error').text(err.responseText || 'Request failed');
}