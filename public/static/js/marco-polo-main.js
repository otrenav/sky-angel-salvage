
/* jshint esversion: 6 */

var COLORS = ['#01c0c8', '#fb9678', '#00c292', '#ab8ce4', '#ef6464'];
var DESTINATION_HTML_INPUT = document.getElementById('form-destination');
var ORIGIN_HTML_INPUT = document.getElementById('form-origin');
var INCIDENT_INCIDENT_RADIUS = 5000;
var INCIDENT_PATH_RADIUS = 150;
var DESTINATION_PLACE_ID = null;
var ORIGIN_PLACE_ID = null;
var DIRECTIONS_RENDERERS = [];
var DIRECTIONS_SERVICE;
var WAYPOINTS = [];
var MARKERS = [];
var RESPONSE, R, NR, M, NM, C;

var pageInit = function() {
    overrideTopBoxes();
    initMapWithAutoComplete();
};

var overrideTopBoxes = function() {
    BOX_VALUES = [
        new CountUp("box-int-one", 0, 0, 0, 2),
        new CountUp("box-int-two", 0, 0, 0, 2),
        new CountUp("box-int-three", 0, 0, 0, 2),
        new CountUp("box-int-four", 0, 0, 0, 2),
        new CountUp("box-int-five", 0, 0, 2, 2)
    ];
    for (var i = 0; i < BOX_VALUES.length; i++) {
        if (!BOX_VALUES[i].error) {
            BOX_VALUES[i].start();
        } else {
            console.error(BOX_VALUES[i].error);
        }
    }
};


var initMapWithAutoComplete = function() {
    DIRECTIONS_SERVICE = new google.maps.DirectionsService();
    var originAutocomplete = new google.maps.places.Autocomplete(
        ORIGIN_HTML_INPUT, {placeIdOnly: true});
    var destinationAutocomplete = new google.maps.places.Autocomplete(
        DESTINATION_HTML_INPUT, {placeIdOnly: true});
    placeChangedListener(originAutocomplete, 'ORIGIN');
    placeChangedListener(destinationAutocomplete, 'DESTINATION');
    mapClicksListener();
};

var placeChangedListener = function(autocomplete, mode) {
    autocomplete.bindTo('bounds', MAP);
    autocomplete.addListener('place_changed', function() {
        var place = autocomplete.getPlace();
        if (!place.place_id) {
            window.alert("Select option from the dropdown.");
            return;
        }
        if (mode === 'ORIGIN') {
            ORIGIN_PLACE_ID = place.place_id;
        } else if (mode === 'DESTINATION') {
            DESTINATION_PLACE_ID = place.place_id;
        } else {
            console.error('Unexpected mode');
        }
        route();
    });
};

var route = function(originID, destinationID) {
    if (!ORIGIN_PLACE_ID || !DESTINATION_PLACE_ID) { return; }
    DIRECTIONS_SERVICE.route({
        travelMode: 'DRIVING',
        origin: {'placeId': ORIGIN_PLACE_ID},
        destination: {'placeId': DESTINATION_PLACE_ID},
        unitSystem: google.maps.UnitSystem.METRIC,
        provideRouteAlternatives: true,
        optimizeWaypoints: true,
        waypoints: WAYPOINTS

    }, function(response, status) {
        if (status === 'OK') {
            RESPONSE = response;
            updateRoutesOnMap();
            updateRouteStatistics();
        } else {
            window.alert('Ruta inexistente');
        }
    });
};

var updateRoutesOnMap = function() {
    deleteCurrentDisplayedRoutes();
    for (var i = 0; i < RESPONSE.routes.length; i++) {
        var renderer = new google.maps.DirectionsRenderer({
            polylineOptions: {
                strokeColor: COLORS[i % COLORS.length]
            }
        });
        renderer.setMap(MAP);
        renderer.setDirections(keepRoute(i));
        DIRECTIONS_RENDERERS.push(renderer);
    }
};

var keepRoute = function(index) {
    var r = $.extend(true, {}, RESPONSE);
    r.routes = [r.routes[index]];
    return(r);
};

var deleteCurrentDisplayedRoutes = function() {
    for (var i = 0; i < DIRECTIONS_RENDERERS.length; i++) {
        DIRECTIONS_RENDERERS[i].setMap(null);
    }
    DIRECTIONS_RENDERERS = [];
};

var updateRouteStatistics = function() {
    resetRiskTable();
    resetTimeTable();
    resetDistanceTable();
    for (var i = 0; i < RESPONSE.routes.length; i++) {
        updateRiskOnTable(i);
        updateTimeOnTable(i);
        updateDistanceOnTable(i);
    }
    activateRoute(0);
};

var resetRiskTable = function() {
    $('#table-risk').html(`
        <tr>
            <td>#</td>
            <td class="pull-right">C</td>
        </tr>
    `);
};

var resetTimeTable = function() {
    $('#table-time').html(`
        <tr>
            <td>#</td>
            <td class="pull-right">Horas</td>
        </tr>
    `);
};

var resetDistanceTable = function() {
    $('#table-distance').html(`
        <tr>
            <td>#</td>
            <td class="pull-right">Km</td>
        </tr>
    `);
};

var updateRiskOnTable = function(i) {
    updateRisk(i);
    $('#table-risk').append(routeRiskHTML(i));
};

var updateRisk = function(i) {
    var incidents = getIncidents();
    var path = getPath(i);
    R = computeRiskR(incidents, path);
    NR = computeRiskNR(incidents, path);
    M = computeRiskM(incidents, path);
    NM = computeRiskNM(incidents, path);
    C = computeRiskC();
};

var computeRiskR = function(incidents, path) {
    var R = 0;
    for (var i = 0; i < incidents.length; i++) {
        for (var p = 0; p < incidents.length; p++) {
            R += Math.max(
                INCIDENT_PATH_RADIUS - distance(incidents[i], path[p]), 0
            ) / INCIDENT_PATH_RADIUS;
        }
    }
    return R;
};

var distance = function(p_one, p_two) {
    // TODO: Use geograhpic distance
    return Math.sqrt(Math.pow(p_two[1] - p_one[1], 2) +
                     Math.pow(p_two[0] - p_one[0], 2));
};

var computeRiskNR = function(incidents, path) {
    return incidents.length * path.length;
};

var computeRiskM = function(incidents) {
    var M = 0;
    for (var i = 0; i < incidents.length; i++) {
        for (var j = 0; j < incidents.length; j++) {
            if (j != i) {
                M += 1 - Math.min(distance(incidents[i], incidents[j]), 1);
            }
        }
    }
    return M;
};

var computeRiskNM = function(incidents) {
    var n = incidents.length;
    return n*n - n;
};

var computeRiskC = function() {
    return 10 - 5 * (1 + M / NM) * (R / NR);
};

var routeRiskHTML = function(i) {
    return `
        <tr style='color: ${COLORS[i % COLORS.length]}' onclick='activateRoute(${i})'>
            <td>${i}</td>
            <td class="pull-right">${C.toFixed(2)}</td>
        </tr>
    `;
};

var updateTimeOnTable = function(i) {
    var seconds = RESPONSE.routes[i].legs[0].duration.value;
    $('#table-time').append(routeTimeHTML(i, seconds / 3600));
};

var routeTimeHTML = function(i, hours) {
    return `
        <tr style='color: ${COLORS[i % COLORS.length]}' onclick='activateRoute(${i})'>
            <td>${i}</td>
            <td class="pull-right">${hours.toFixed(2)}</td>
        </tr>
    `;
};

var updateDistanceOnTable = function(i) {
    var meters = RESPONSE.routes[i].legs[0].distance.value;
    $('#table-distance').append(routeDistanceHTML(i, meters / 1000));
};

var routeDistanceHTML = function(i, km) {
    return `
        <tr style='color: ${COLORS[i % COLORS.length]}' onclick='activateRoute(${i})'>
            <td>${i}</td>
            <td class="pull-right">${km.toFixed(2)}</td>
        </tr>
    `;
};

var activateRoute = function(i) {
    updateRisk(i);
    updateBoxValues({
        numbers: [R, NR, M, NM, C],
        percents: [0, 0, 0, 0, 0]
    });
    var color = COLORS[i % COLORS.length];
    $('#box-int-one').css('color', color);
    $('#box-int-two').css('color', color);
    $('#box-int-three').css('color', color);
    $('#box-int-four').css('color', color);
    $('#box-int-five').css('color', color);
};

var mapClicksListener = function() {
    google.maps.event.addListener(MAP, 'click', function(event) {
        WAYPOINTS.push({
            location: event.latLng,
            stopover: false
        });
        addWaypointMarkerOnMap(event);
        route();
    });
};

var addWaypointMarkerOnMap = function(event) {
    var marker = new google.maps.Marker({
        label: {
            text: WAYPOINTS.length - 1 + '',
            color: '#FFFFFF'
        },
        position: event.latLng,
        map: MAP
    });
    marker.addListener('click', function() {
        marker.setMap(null);
        var index = parseInt(marker.getLabel().text);
        WAYPOINTS.splice(index, 1);
        MARKERS.splice(index, 1);
        updateMarkerLabels();
        route();
    });
    MARKERS.push(marker);
};

var updateMarkerLabels = function() {
    for (var i = 0; i < MARKERS.length; i++) {
        MARKERS[i].setLabel({ color: '#FFFFFF', text: i + '' });
    }
};

var getIncidents = function() {
    var d = HEATMAPS_CRIMEN;
    var incidents = [];
    for (var day in d) {
        if (d.hasOwnProperty(day)) {
            for (var time in d[day]) {
                if (d[day].hasOwnProperty(time)) {
                    for (var i = 0; i < d[day][time].coords.length; i++) {
                        incidents.push(d[day][time].coords[i]);
                    }
                }
            }
        }
    }
    return incidents;
};

var getPath = function(i) {
    path = [];
    for (var j = 0; j < RESPONSE.routes[i].overview_path.length; j++) {
        path.push([
            RESPONSE.routes[i].overview_path[j].lat(),
            RESPONSE.routes[i].overview_path[j].lng()
        ]);
    }
    return path;
};
