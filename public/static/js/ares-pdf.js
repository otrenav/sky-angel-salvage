
// This file uses various global objects. If you can't find a reference
// for an object, look inside the `ares.html`, `ares-main.js`, and
// `ares-constants.js` files.

var GOOGLE_MAPS, TIME_SERIES, PIE;
var GOOGLE_CHARTS_HAS_BEEN_LOADED = false;

var downloadReport = function() {
    if (DAY_SELECTED === '') {
        warning(true);
    } else {
        warning(false);
        $('#report-images').removeClass("hidden");
        if (!GOOGLE_CHARTS_HAS_BEEN_LOADED) {
            google.charts.load('current', {'packages':['corechart']});
            google.charts.setOnLoadCallback(generateImages);
        } else {
            generateImages();
        }
        setTimeout(function() {
            pdfMake.createPdf(content()).open();
            $('#report-images').addClass("hidden");
        }, 1000);
    }
};

var generateImages = function() {
    timeSeriesChart();
    pieChart();
    mapImage();
};

var content = function() {
    return {
        content: [
            {
                text: 'Reporte de incidencias ' + currentSelection(),
                style: 'heading_one'
            },
            {
                style: 'centered',
                table: {
                    widths: [ '10%', '90%'],
                    body: [
                        [ 'Día', DAY_SELECTED],
                        [ 'Horas', selectedHours() ],
                    ]
                }
            },
            {
                style: 'centered',
                table: {
                    widths: [ '25%', '15%', '15%', '15%', '15%', '15%'],
                    body: concentrations()
                }
            },
            {
                columns: [
                    {
                        width: '60%',
                        stack: [
                            {
                                image: GOOGLE_MAPS,
                                style: 'centered',
                                width: 270
                            }
                        ]
                    },
                    {
                        width: '40%',
                        stack: [
                            {
                                image: PIE,
                                style: 'centered',
                                width: 250
                            }
                        ]
                    },
                ],
                columnGap: 10
            },
            {
                image: TIME_SERIES,
                style: 'centered',
                width: 600
            }
        ],
        styles: {
            heading_one: {
                alignment: 'center',
                fontSize: 22,
                margin: 10,
                bold: true
            },
            centered: {
                alignment: 'center',
                margin: [0, 10]
            }
        }
    };
};

var currentSelection = function() {
    if (CURRENT_SELECTION === 'crimen') {
        return 'criminales';
    }
    return 'operativas';
};

var concentrations = function() {
    var zoneCounters = findZoneCounters();
    var concentrations = [['Zona'], ['Concentración']];
    for (var zone in zoneCounters) {
        if (zoneCounters.hasOwnProperty(zone)) {
            concentrations[0].push(zone);
            concentrations[1].push(concentration(zone, zoneCounters[zone]));
        }
    }
    return concentrations;
};

var concentration = function(zone, count) {
    return round(count * 150 / (24 * area(zone)), 2) + ' %';
};

var round = function(number, precision) {
    var factor = Math.pow(10, precision);
    return Math.round(number * factor) / factor;
};

var area = function(zone) {
    var topleft = ZONES[zone].topLeft;
    var bottomRight = ZONES[zone].bottomRight;
    var width = Math.abs(topleft[1]) - Math.abs(bottomRight[1]);
    var height = topleft[0] - bottomRight[0];
    return width * height;
};

var pieChart = function() {
    var data = google.visualization.arrayToDataTable(incidentsPerZone());
    var options = {
        title: 'Frecuencia relativa',
        height: 300,
        width: 300,
        chartArea: {
            width: '80%',
            height: '80%'
        }
    };
    var chart = new google.visualization.PieChart(
        document.getElementById('report-pie-chart')
    );
    google.visualization.events.addListener(chart, 'ready', function () {
        PIE = chart.getImageURI("image/png");
    });
    chart.draw(data, options);
};

var timeSeriesChart = function() {
    var data = google.visualization.arrayToDataTable(incidentsPerTime());
    var options = {
        title: 'Incidentes por hora',
        legend: { position: 'none' },
        curveType: 'function',
        height: 200,
        width: 650
    };
    var chart = new google.visualization.LineChart(
        document.getElementById('report-time-series-chart')
    );
    google.visualization.events.addListener(chart, 'ready', function () {
        TIME_SERIES = chart.getImageURI("image/png");
    });
    chart.draw(data, options);
};

incidentsPerZone = function() {
    var zoneCounters = findZoneCounters();
    var data = [['Zona', 'Frecuencia relativa']];
    for (var zone in zoneCounters) {
        if (zoneCounters.hasOwnProperty(zone)) {
            data.push([zone, zoneCounters[zone]]);
        }
    }
    return data;
};

var findZoneCounters = function() {
    var zone;
    var zoneCounters = {
        Noroeste: 0, Noreste: 0, Centro: 0, Sureste: 0, Suroeste: 0
    };
    var day = DAY_SELECTED;
    for (var time in HEATMAPS[day]) {
        if (HEATMAPS[day].hasOwnProperty(time) &&
            TIMES.indexOf(time) !== -1 &&
            HEATMAPS[day][time].active) {
            for (var i = 0; i < HEATMAPS[day][time].coords.length; i++) {
                zone = findZone(HEATMAPS[day][time].coords[i]);
                if (zone != null) {
                    zoneCounters[zone] += 1;
                }
            }
        }
    }
    return zoneCounters;
};

var findZone = function(coords) {
    for (var zone in ZONES) {
        if (ZONES.hasOwnProperty(zone)) {
            if (coords[0] <= ZONES[zone].topLeft[0] &&
                coords[0] >= ZONES[zone].bottomRight[0] &&
                coords[1] >= ZONES[zone].topLeft[1] &&
                coords[1] <= ZONES[zone].bottomRight[1]) {
                return zone;
            }
        }
    }
    console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
    console.log("Warning: Unspecified zone for");
    console.log(coords);
    console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
    return null;
};

var incidentsPerTime = function() {
    var data = [['Hour', 'Frecuencia absoluta']];
    var day = DAY_SELECTED;
    var n_incidents = 0;
    for (var time in HEATMAPS[day]) {
        if (HEATMAPS[day].hasOwnProperty(time) &&
            TIMES.indexOf(time) !== -1) {
            if (HEATMAPS[day][time].active) {
                n_incidents = HEATMAPS[day][time].coords.length;
            } else {
                n_incidents = 0;
            }
        }
        data.push([time, n_incidents]);
    }
    return data;
};

var mapImage = function() {
    html2canvas(
        document.querySelector("#map"),
        { allowTaint: false, useCORS: true, logging: false }
    ).then(canvas => {
        GOOGLE_MAPS = canvas.toDataURL("image/png");
    });
};

var selectedHours = function() {
    var day = DAY_SELECTED;
    var counter = 0;
    var hours = '';
    for (var time in HEATMAPS[day]) {
        if (HEATMAPS[day].hasOwnProperty(time) &&
            TIMES.indexOf(time) !== -1 &&
            HEATMAPS[day][time].active) {
            hours += time + ' ';
            counter += 1;
        }
    }
    if (counter === 24) {
        return 'Todo el día';
    }
    return hours;
};
