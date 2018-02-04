
//
// NOTE: Global-space objects: `MAP`, `updateBoxInts()`
//

var ARROW, LOCATION;

var pageInit = function() {
    insertOptions();
    initializeAsyncGlobalVariables();
    initializeClients();
};

var insertOptions = function() {
    insertClientOptions();
};

var clientOptionHTML = function(selector) {
    return `
        <div id='${selector}'
             class='col-lg-6 col-3 option'
             onclick="toggleVectors('${selector}', this, null);">
            <span>${selector}</span>
        </div>
    `;
};

var insertClientOptions = function() {
    for (var selector in CLIENTS) {
        if (CLIENTS.hasOwnProperty(selector)) {
            $('#client-options').append(clientOptionHTML(selector));
        }
    }
};

var updateAllVectors = function(obj) {
    for (var selector in CLIENTS) {
        if (CLIENTS.hasOwnProperty(selector)) {
            updateVectors(selector, obj);
        }
    }
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

var vectorsTerrestres = function() {
    toggleVectorsInCategory('terrestre', '#00c292');
    updateBoxInts([]);
};

var vectorsNavieros = function() {
    toggleVectorsInCategory('naviero', '#fb9678');
    updateBoxInts([]);
};

var toggleVectorsInCategory = function(category, color) {
    for (var selector in CLIENTS) {
        if (CLIENTS.hasOwnProperty(selector)) {
            if (CLIENTS[selector].category === category) {
                toggleVectors(selector, $('#' + selector), color);
            }
        }
    }
};

var toggleVectors = function(selector, div, color) {
    if ($(div).hasClass("active-option")) {
        updateVectors(selector, null, color);
        $(div).removeClass("active-option");
        $(div).find('span').css('color', '#96a2b4');
    } else {
        c = color ? color : CLIENTS[selector].color;
        updateVectors(selector, MAP, color);
        $(div).addClass("active-option");
        $(div).find('span').css('color', c);
    }
    updateBoxInts([]);
};

var updateVectors = function(selector, obj, color) {
    for (var i = 0; i < CLIENTS[selector].visuals.length; i++) {
        c = color ? color : CLIENTS[selector].color;
        CLIENTS[selector].visuals[i].setOptions({ strokeColor: c });
        CLIENTS[selector].visuals[i].setMap(obj);

    }
};

var createVector = function(params) {
    return new google.maps.Polyline({
        strokeColor: params.color,
        path: params.path,
        info: params.info,
        strokeOpacity: 1,
        strokeWeight: 1,
        geodesic: true,
        icons: [
            { icon: LOCATION, offset: params.percent },
            { icon: ARROW, offset: '100%' }
        ]
    });
};

var computePercent = function(row) {
    return Math.floor(Math.random() * 100) + '%';
};

var createParams = function(row, client) {
    var percent = computePercent(row);
    var info = `
        ID: ${row[0]} <br>
        ETA: [Pendiente] <br>
        Recorrido: ${percent}
    `;
    return {
        percent: percent,
        color: CLIENTS[client].color,
        info: info,
        path: [
            { lat: row[2], lng: row[3]},
            { lat: row[4], lng: row[5]}
        ]
    };
};

var createInfoWindow = function(params, vector) {
    var infoWindow = new google.maps.InfoWindow({ content: params.info });
    infoWindow.setPosition(computeTooltipCoordinates(vector));
    vector.addListener('click', function() {
        infoWindow.open(MAP, vector);
    });
};

var computeTooltipCoordinates = function(vector) {
    return google.maps.geometry.spherical.interpolate(
        vector.getPath().getAt(0),
        vector.getPath().getAt(1),
        parseFloat(vector.icons[0].offset) / 100
    );
};

var initializeClients = function() {
    var client, params;
    for (var i = 0; i < DATA.length; i++) {
        client = DATA[i][6];
        params = createParams(DATA[i], client);
        vector = createVector(params);
        createInfoWindow(params, vector);
        CLIENTS[client].visuals.push(vector);
    }
};

var initializeAsyncGlobalVariables = function() {
    ARROW = {
        path: google.maps.SymbolPath.FORWARD_OPEN_ARROW,
        scale: 2
    };
    LOCATION = {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 2
    };
};
