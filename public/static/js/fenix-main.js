
//
// NOTE: Global-space objects: `MAP`, `updateBoxInts()`
//

var ARROW, LOCATION;
var ACTIVE_VECTOR_COLOR = '#AAAAAA';
var START_LAT_POS = 2;
var START_LNG_POS = 3;
var END_LAT_POS = 4;
var END_LNG_POS = 5;

var pageInit = function() {
    insertClientOptions();
    initializeAsyncGlobalVariables();
    initializeClients();
};

var vectorsAll = function() {
    $("div.option").addClass("active-option");
    $("div.option").each(function(i) {
        $(this).find('span').css('color', CLIENTS[$(this).text().trim()].color);
    });
    updateAllVectors(MAP);
    updateBoxInts([]);
};

var vectorsNone = function() {
    $("div.option").removeClass("active-option");
    $("div.option").find('span').css('color', '#96a2b4');
    updateAllVectors(null);
    updateBoxInts([]);
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
    updateBoxInts([]);
};

var vectorsNavieros = function() {
    toggleVectorsInCategory('naviero', '#fb9678');
    updateBoxInts([]);
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
    updateBoxInts([]);
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

var initializeClients = function(row) {
    var client, params, percent;
    for (var i = 0; i < DATA.length; i++) {
        row = DATA[i];
        client = DATA[i][6];
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
    return Math.floor(Math.random() * 100) + '%';
};

var createParams = function(row, client, percent, type) {
    var start, end;
    var info = `
        ID: ${row[0]} <br>
        ETA: [Pendiente] <br>
        Recorrido: ${percent} <br>
    `;
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
        info: info,
        color: color,
        percent: percent,
        path: [start, end],
        arrow: type === 'future' ? true : false
    };
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
        strokeWeight: 4,
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
    var map;
    var infoWindow = new google.maps.InfoWindow({
        content: paramsFuture.info
    });
    infoWindow.setPosition(paramsFuture.path[0]);
    CLIENTS[client].visuals.dynamic.push(infoWindow);
    google.maps.event.addListener(infoWindow, 'closeclick', function() {
        vectors[0].setVisible(true);
        vectors[1].setVisible(false);
        marker.setVisible(false);
    });
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

var initializeAsyncGlobalVariables = function() {
    ARROW = {
        path: google.maps.SymbolPath.FORWARD_OPEN_ARROW,
        scale: 4
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
