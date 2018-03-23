
// This file uses various global objects. If you can't find a reference
// for an object, look inside the `ares.html`, `ares-main.js`, and
// `ares-constants.js` files.

var GOOGLE_MAPS, TIME_SERIES, PIE;
var GOOGLE_CHARTS_HAS_BEEN_LOADED = false;

var downloadReport = function() {
    updateGeographicConcentrations();
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

var updateGeographicConcentrations = function() {
    var zoneCounters = findZoneCounters();
    addGeographicLabel(concentration('NW', zoneCounters.NW), 24, -120.5, 18);
    addGeographicLabel(concentration('NE', zoneCounters.NE), 31, -92.8, 18, 'left');
    addGeographicLabel(concentration('C', zoneCounters.C), 20.5, -109, 18);
    addGeographicLabel(concentration('SW', zoneCounters.SW), 16, -107.5, 18);
    addGeographicLabel(concentration('SE', zoneCounters.SE), 18.5, -84.5, 18);
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
                columns: [
                    {
                        width: '15%',
                        stack: [
                            {
                                image: LOGO,
                                style: 'logo',
                                width: 40
                            }
                        ]
                    },
                    {
                        width: '50%',
                        stack: [
                            {
                                text: 'ARES | Atlas de Riesgos \n',
                                style: 'title'
                            },
                            {
                                text: ('Reporte de Incidencias ' +
                                       currentSelection()),
                                style: 'report_name'
                            },
                        ]
                    },
                    {
                        width: '35%',
                        text: 'Apellido, Nombre \n\n ' + timeAndDay(),
                        style: 'metadata'
                    }
                ],
                columnGap: 0
            },
            {
                style: 'daytimes',
                layout: 'customBorderColor',
                table: {
                    widths: [ '15%', '85%'],
                    body: [
                        [ { text: 'Día', bold: true },
                          { text: 'Horas', bold: true } ],
                        [ DAY_SELECTED, selectedHours() ],
                    ]
                }
            },
            {
                layout: 'customBorderColor',
                table: {
                    widths: [ '100%' ],
                    body: [[{
                        style: 'map',
                        image: GOOGLE_MAPS,
                        height: 328,
                        width: 585
                    }]]
                }
            },
            {
                style: 'graphs',
                layout: 'customBorderColor',
                table: {
                    widths: [ '40%', '60%' ],
                    body: [
                        [ 'Concentración de incidencias',
                          'Número de incidencias por hora' ],
                        [ { image: PIE, width: 200 },
                          { image: TIME_SERIES, width: 340 } ]
                    ]
                }
            },
            {
                layout: 'customBorderColor',
                table: {
                    widths: [ '100%' ],
                    body: [[{
                        text: 'Observaciones: \n\n\n\n',
                        style: 'observations'
                    }]]
                }
            },
            {
                text: ('© Copyright. All rights reserved. Esta es' +
                       ' información confidencial de grado superior' +
                       ' perteneciente a Ska Tracking and Security S.A. de C.V.'),
                style: 'footnote'
            },
        ],
        styles: {
            logo: {
                margin: [10, 20, 0, 0],
                alignment: 'center'
            },
            title: {
                margin: [10, 20, 0, 0],
                color: 'white',
                fontSize: 20,
                bold: true
            },
            report_name: {
                margin: [10, 5, 0, 0],
                color: 'white',
                fontSize: 16
            },
            metadata: {
                margin: [0, 20, 20, 0],
                alignment: 'right',
                color: '#DDDDDD',
                fontSize: 12
            },
            daytimes: {
                margin: [0, 20, 0, 0],
                alignment: 'center',
                color: '#324c92',
                fontSize: 14
            },
            map: {
                margin: [-14, -2, -2, -4]
            },
            graphs: {
                alignment: 'center',
                color: '#324c92',
                fontSize: 12,
                bold: true
            },
            observations: {
                margin: [5, 5, 0, 0],
                alignment: 'left',
                fontSize: 14,
                color: '#324c92',
                bold: true
            },
            footnote: {
                margin: [0, 10, 0, 0],
                alignment: 'center',
                color: '#777777',
                fontSize: 9,
                bold: false
            },
            centered: {
                alignment: 'center'
            }
        },
        pageMargins: [ 10, 10, 10, 10 ],
        background: function () {
            return {
	            canvas: [
				    {
					    type: 'rect',
					    x: 10, y: 10, w: 575, h: 89,
					    color: '#284c92'
				    }
			    ]
	        };
        }
    };
};

var currentSelection = function() {
    if (CURRENT_SELECTION === 'crimen') {
        return 'de Crimen';
    }
    return 'Operativas';
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
        color: '#324c92',
        fontSize: 16,
        height: 250,
        width: 250,
        chartArea: {
            width: '80%',
            height: '80%'
        },
        legend: {
            textStyel: {
                fontSize: 14
            },
            position: 'bottom',
            maxLines: 2
        },
        colors:[
            '#305297',
            '#3c63b2',
            '#4671ca',
            '#91a3d8',
            '#bcc5e5'
        ]
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
        color: '#324c92',
        fontSize: 18,
        lineWidth: 3,
        curveType: 'function',
        height: 270,
        width: 470,
        chartArea: {
            width: '80%',
            height: '60%'
        },
        legend: {
            position: 'none'
        },
        hAxis: {
            slantedTextAngle: 90,
            textStyle: {
                color: '#324c92',
                fontSize: 16
            }
        },
        vAxis: {
            textStyle: {
                color: '#324c92',
                fontSize: 16
            }
        },
        trendlines: {
            0: {
                type: 'linear',
                color: 'red',
                lineWidth: 3,
                opacity: 0.3,
                showR2: true
            }
        }
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
    var orderedData = [];
    for (var zone in zoneCounters) {
        if (zoneCounters.hasOwnProperty(zone)) {
            orderedData.push([zone, zoneCounters[zone]]);
        }
    }
    orderedData.sort(function(a, b) {
        return a[1] < b[1];
    });
    for (var i = 0; i < orderedData.length; i++) {
        data.push(orderedData[i]);
    }
    return data;
};

var findZoneCounters = function() {
    var zone;
    var zoneCounters = {
        NW: 0, NE: 0, C: 0, SE: 0, SW: 0
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
            data.push([time, n_incidents]);
        }
    }
    return data;
};

var mapImage = function() {
    html2canvas(
        document.querySelector("#map-hidden"),
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
            hours += time + ' , ';
            counter += 1;
        }
    }
    if (counter === 24) {
        return 'Todo el día';
    }
    // Remove last coma (' , ') from hours
    hours = hours.substr(0, hours.length - 3);
    return hours;
};

var timeAndDay = function() {
    var d = new Date();
    return (twoDigits(d.getHours()) + ':' +
            twoDigits(d.getMinutes()) + ' de ' +
            twoDigits(d.getDate()) + '/' +
            twoDigits(d.getMonth() + 1) + '/' +
            d.getFullYear());
};
