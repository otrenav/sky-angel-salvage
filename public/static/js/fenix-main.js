
/* jshint esversion: 6 */

//
// NOTE: Global-space objects: `MAP`, `updateBoxValues()`
//

var ARROW, LOCATION;
var ACTIVE_VECTOR_COLOR = '#EEEEEE';
var ENABLED_24_HOURS = false;
var INITIALIZED = false;

//
// Positions in data observations
//
var ID_POS = 0;
var IMP_EXP_POS = 1;
var START_LAT_POS = 2;
var START_LNG_POS = 3;
var END_LAT_POS = 4;
var END_LNG_POS = 5;
var DATE_START_POS = 6;
var DATE_END_POS = 7;
var CLIENT_POS = 8;

var pageInit = function(data=DATA) {
    if (!INITIALIZED) {
        initializeAsyncGlobalVariables();
        insertClientOptions();
        INITIALIZED = true;
    }
    initializeClients(data);
};

var vectorsAll = function() {
    $("div.option").addClass("active-option");
    $("div.option").each(function(i) {
        $(this).find('span').css('color', CLIENTS[$(this).text().trim()].color);
    });
    updateAllVectors(MAP);
    updateBoxValues(updatedBoxValues());
};

var vectorsNone = function() {
    $("div.option").removeClass("active-option");
    $("div.option").find('span').css('color', '#96a2b4');
    updateAllVectors(null);
    updateBoxValues(updatedBoxValues());
};

var updateAllVectors = function(obj) {
    for (var client in CLIENTS) {
        if (CLIENTS.hasOwnProperty(client)) {
            updateVectors(client, obj);
        }
    }
};

var vectorsTerrestres = function() {
    toggleVectorsInCategory('terrestre', '#00c292');
    updateBoxValues(updatedBoxValues());
};

var vectorsNavieros = function() {
    toggleVectorsInCategory('naviero', '#fb9678');
    updateBoxValues(updatedBoxValues());
};

var toggle24Hours = function() {
    ENABLED_24_HOURS = !ENABLED_24_HOURS;
    if (ENABLED_24_HOURS) {
        $("#24-hours").css('color', '#00c292');
        vectorsNone();
        pageInit(DATA_24H);
    } else {
        $("#24-hours").css('color', '#96a2b4');
        vectorsNone();
        pageInit(DATA);
    }
};

var toggleVectorsInCategory = function(category, color) {
    for (var client in CLIENTS) {
        if (CLIENTS.hasOwnProperty(client)) {
            if (CLIENTS[client].category === category) {
                toggleVectors(client, $('#' + client), color);
            }
        }
    }
};

var toggleVectors = function(client, div, color) {
    if ($(div).hasClass("active-option")) {
        updateVectors(client, null, color);
        $(div).removeClass("active-option");
        $(div).find('span').css('color', '#96a2b4');
    } else {
        c = color ? color : CLIENTS[client].color;
        updateVectors(client, MAP, color);
        $(div).addClass("active-option");
        $(div).find('span').css('color', c);
    }
    updateBoxValues(updatedBoxValues());
};

var updateVectors = function(client, obj, color) {
    c = color ? color : CLIENTS[client].color;
    if (obj === null) {
        clearDynamicVisualizations(client);
        resetVectorsForClient(client);
    }
    updateVectorGroup(CLIENTS[client].visuals.active, obj, ACTIVE_VECTOR_COLOR);
    updateVectorGroup(CLIENTS[client].visuals.inactive, obj, c);
    updateVectorGroup(CLIENTS[client].visuals.future, obj, c);
};

var clearDynamicVisualizations = function(client) {
    var dynamics = CLIENTS[client].visuals.dynamic;
    for (var i = 0; i < dynamics.length; i++) {
        try {
            dynamics[i].setVisible(false);
        } catch (error) {
            dynamics[i].open(null);
        }
    }
};

var resetVectorsForClient = function(client) {
    for (var i = 0; i < CLIENTS[client].visuals.inactive.length; i++) {
        CLIENTS[client].visuals.inactive[i].setVisible(true);
        CLIENTS[client].visuals.active[i].setVisible(false);
    }
};

updateVectorGroup = function(group, obj, color) {
    for (var i = 0; i < group.length; i++) {
        group[i].setOptions({ strokeColor: color });
        group[i].setMap(obj);
    }
};

var initializeClients = function(data) {
    CLIENTS = $.extend(true, {}, CLIENTS_BASE);
    var client, params, percent, row;
    for (var i = 0; i < data.length; i++) {
        row = data[i];
        client = data[i][CLIENT_POS];
        CLIENTS[client].data.push(row);
        percent = computePercent(row);

        paramsInactive = createParams(row, client, percent, 'inactive');
        paramsActive = createParams(row, client, percent, 'active');
        paramsFuture = createParams(row, client, percent, 'future');

        vectorInactive = createVector(paramsInactive);
        vectorActive = createVector(paramsActive);
        vectorFuture = createVector(paramsFuture);
        vectorActive.setVisible(false);

        CLIENTS[client].visuals.inactive.push(vectorInactive);
        CLIENTS[client].visuals.active.push(vectorActive);
        CLIENTS[client].visuals.future.push(vectorFuture);

        var marker = createRadarIcon(
            client,
            paramsFuture,
            [vectorInactive, vectorActive, vectorFuture]
        );
        createInfoWindow(
            client,
            paramsFuture,
            [vectorInactive, vectorActive, vectorFuture],
            marker
        );
        linkVectors(vectorInactive, vectorActive, vectorFuture);
    }
};

var computePercent = function(row) {
    var start = row[DATE_START_POS];
    var end = row[DATE_END_POS];
    var today = new Date();
    if (today < start) {
        return '0%';
    } else if (today > end) {
        return '100%';
    }
    return Math.round(((today - start) / (end - start)) * 100) + '%';
};

var createParams = function(row, client, percent, type) {
    var start, end;
    var color = (
        type === 'active' ? ACTIVE_VECTOR_COLOR : CLIENTS[client].color
    );
    var currentLocation = locationCoordinates(row, percent);
    if (type === 'future') {
        start = currentLocation;
        end = { lat: row[END_LAT_POS], lng: row[END_LNG_POS]};
    } else {
        start = { lat: row[START_LAT_POS], lng: row[START_LNG_POS]};
        end = currentLocation;
    }
    return {
        info: buildInfo(row, percent),
        color: color,
        percent: percent,
        path: [start, end],
        arrow: hasArrow(type, percent)
    };
};

var hasArrow = function(type, percent) {
    if (type === 'future' && percent !== '100%') {
        return true;
    } else if (type !== 'future' && percent === '100%') {
        return true;
    }
    return false;
};

var buildInfo = function(row, percent) {
    var info;
    if (CLIENTS[row[CLIENT_POS]].category == 'naviero') {
        info = `
            <div id="info-window">
                <table>
                    <tr><td>ID:</td><td class="pull-right">${row[ID_POS]}</td></tr>
                    <tr><td>Salida:</td><td class="pull-right">${dateString(row[DATE_START_POS])}</td></tr>
                    <tr><td>Llegada:</td><td class="pull-right">${dateString(row[DATE_END_POS])}</td></tr>
                    <tr><td>Recorrido:</td><td class="pull-right">${percent}</td></tr>
                </table>
            </div>
        `;
    } else {
        info = `
            <div id="info-window">
                <table>
                    <tr><td>ID:</td><td class="pull-right">${row[ID_POS]}</td></tr>
                    <tr><td>Salida:</td><td class="pull-right">${dateString(row[DATE_START_POS])}</td></tr>
                    <tr><td>Llegada:</td><td class="pull-right">${dateString(row[DATE_END_POS])}</td></tr>
                </table>
            </div>
        `;
    }
    return info;
};

var dateString = function(date) {
    year = date.getFullYear();
    month = twoZeros(date.getMonth());
    day = twoZeros(date.getDate());
    hour = date.getHours();
    min = date.getMinutes();
    return (hour + ':' + min + '&nbsp;&nbsp;' +
            day + '/' + month + '/' + year);
};

var twoZeros = function(int) {
    if (int < 10) {
        return '0' + int;
    }
    return '' + int;
};

var locationCoordinates = function(row, percent) {
    var start = new google.maps.LatLng(
        row[START_LAT_POS],
        row[START_LNG_POS]
    );
    var end = new google.maps.LatLng(
        row[END_LAT_POS],
        row[END_LNG_POS]
    );
    return google.maps.geometry.spherical.interpolate(
        start, end, parseFloat(percent) / 100);
};

var createVector = function(params) {
    var icons = params.arrow ? [{ icon: ARROW, offset: '100%' }] : [];
    return new google.maps.Polyline({
        strokeColor: params.color,
        path: params.path,
        strokeOpacity: 1,
        strokeWeight: 2,
        geodesic: true,
        icons: icons
    });
};

var createRadarIcon = function(client, paramsFuture, vectors) {
    var marker = new google.maps.Marker({
        position: paramsFuture.path[0],
        optimized: false,
        icon: LOCATION,
        map: MAP
    });
    marker.setVisible(false);
    CLIENTS[client].visuals.dynamic.push(marker);
    for (var i = 0; i < vectors.length; i++) {
        vectors[i].addListener('click', function() {
            marker.setVisible(!marker.getVisible());
        });
    }
    return marker;
};

var createInfoWindow = function(client, paramsFuture, vectors, marker) {
    var infoWindow = new google.maps.InfoWindow({
        content: paramsFuture.info,
        maxWidth: 500
    });
    infoWindow.setPosition(paramsFuture.path[0]);
    CLIENTS[client].visuals.dynamic.push(infoWindow);
    resetInfoWindowCloseBehavior(infoWindow, vectors, marker);
    clickVectorsToShowHideInfoWindow(infoWindow, vectors);
    removeWhiteBoxAroundInfoWindow(infoWindow);
};

var resetInfoWindowCloseBehavior = function(infoWindow, vectors, marker) {
    google.maps.event.addListener(infoWindow, 'closeclick', function() {
        vectors[0].setVisible(true);
        vectors[1].setVisible(false);
        marker.setVisible(false);
    });
};

var removeWhiteBoxAroundInfoWindow = function(infoWindow) {
    google.maps.event.addListener(infoWindow, 'domready', function(){
        $('.gm-style-iw').prev('div').remove();
    });
};

var clickVectorsToShowHideInfoWindow = function(infoWindow, vectors) {
    var map;
    for (var i = 0; i < vectors.length; i++) {
        vectors[i].addListener('click', function() {
            map = infoWindow.getMap();
            if (map === undefined || map === null) {
                infoWindow.open(MAP);
            } else {
                infoWindow.open(null);
            }
        });
    }
};

var linkVectors = function(vectorInactive, vectorActive, vectorFuture) {
    vectorInactive.addListener('click', function() {
        vectorInactive.setVisible(false);
        vectorActive.setVisible(true);
    });
    vectorActive.addListener('click', function() {
        vectorInactive.setVisible(true);
        vectorActive.setVisible(false);
    });
    vectorFuture.addListener('click', function() {
        vectorInactive.setVisible(!vectorInactive.getVisible());
        vectorActive.setVisible(!vectorActive.getVisible());
    });
};

var updatedBoxValues = function() {
    var client, data;
    var total = 0;
    var navieros = 0;
    var terrestres = 0;
    var importaciones = 0;
    var exportaciones = 0;
    $('div.option.active-option').each(function(i) {
        client = CLIENTS[$(this).text().trim()];
        for (i = 0; i < client.data.length; i++) {
            total += 1;
            if (client.data[i][IMP_EXP_POS] === 1) {
                importaciones += 1;
            } else if (client.data[i][IMP_EXP_POS] === 2) {
                exportaciones += 1;
            } else {
                throw('Se esperaba `1` o `2` para valor de imp/exp.');
            }
            if (client.category === 'terrestre') {
                terrestres += 1;
            } else if (client.category === 'naviero') {
                navieros += 1;
            } else {
                throw('Se esperaba `terrestre` o `naviero` para categoría.');
            }
        }
    });
    return {
        numbers: [
            terrestres,
            navieros,
            importaciones,
            exportaciones
        ],
        percents: [
            total ? terrestres / total * 100 : 0,
            total ? navieros / total * 100 : 0,
            total ? importaciones / total * 100: 0,
            total ? exportaciones / total * 100: 0
        ]
    };
};

var initializeAsyncGlobalVariables = function() {
    ARROW = {
        path: google.maps.SymbolPath.FORWARD_OPEN_ARROW,
        scale: 2
    };
    LOCATION = {
        url: "static/img/ripple.svg",
        scaledSize: new google.maps.Size(100, 100),
        anchor: new google.maps.Point(50, 50)
    };
};

var insertClientOptions = function() {
    for (var client in CLIENTS) {
        if (CLIENTS.hasOwnProperty(client)) {
            $('#client-options').append(clientOptionHTML(client));
        }
    }
};

var clientOptionHTML = function(client) {
    return `
        <div id='${client}'
             class='col-lg-6 col-3 option'
             onclick="toggleVectors('${client}', this, null);">
            <span>${client}</span>
        </div>
    `;
};
