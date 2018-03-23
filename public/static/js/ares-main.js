
//
// NOTE: Global-space objects: `HEATMAPS`, `MAP`,
//       `MAP_HIDDEN`, `updateBoxValues()`
//

var DAY_SELECTED = '';

var pageInit = function() {
    insertOptions();
    initializeHeatmaps();
    initMapHidden();
    setupPDFTables();
};

var heatmapToggleDay = function(day, div) {
    if (DAY_SELECTED !== '') {
        $("div.option-enabled").removeClass("option-enabled");
        heatmapHoursNone();
    }
    if (DAY_SELECTED !== day) {
        $(div).addClass("option-enabled");
        DAY_SELECTED = day;
        heatmapHoursAll();
    } else {
        DAY_SELECTED = '';
    }
    updateBoxValues(updatedBoxValues());
};

var heatmapToggleTime = function(time, div) {
    if (DAY_SELECTED === '') {
        warning(true);
    } else {
        warning(false);
        if ($(div).hasClass("option-enabled")) {
            $(div).removeClass("option-enabled");
            toggleDayTime(DAY_SELECTED, time, false);
        } else {
            $(div).addClass("option-enabled");
            toggleDayTime(DAY_SELECTED, time, true);
        }
        updateHeatmapData(DAY_SELECTED, true);
        updateBoxValues(updatedBoxValues());
    }
};

var heatmapHoursAll = function() {
    if (DAY_SELECTED === '') {
        warning(true);
    } else {
        warning(false);
        $("div.hour-option").addClass("option-enabled");
        heatmapsUpdateAllHoursForDay(DAY_SELECTED, true);
        updateBoxValues(updatedBoxValues());
    }
};

var heatmapHoursNone = function() {
    warning(false);
    $("div.hour-option").removeClass("option-enabled");
    heatmapsUpdateAllHoursForDay(DAY_SELECTED, false);
    updateBoxValues(updatedBoxValues());
};

var heatmapsUpdateAllHoursForDay = function(day, show) {
    for (var time in HEATMAPS[day]) {
        if (HEATMAPS[day].hasOwnProperty(time) &&
            TIMES.indexOf(time) !== -1) {
            toggleDayTime(day, time, show);
        }
    }
    updateHeatmapData(day, show);
};

var toggleDayTime = function(day, time, show) {
    HEATMAPS[day][time].active = show;
};

var updateHeatmapData = function(day, show) {
    if (show) {
        HEATMAPS[day].googleMapsShown.setData(heatmapData(day));
        HEATMAPS[day].googleMapsShown.setMap(MAP);
        HEATMAPS[day].googleMapsHidden.setData(heatmapData(day));
        HEATMAPS[day].googleMapsHidden.setMap(MAP_HIDDEN);
    } else {
        HEATMAPS[day].googleMapsShown.setMap(null);
        HEATMAPS[day].googleMapsHidden.setMap(null);
    }
};

var updatedBoxValues = function() {
    var zoneCounters = findZoneCounters();
    var percents = [
        zoneCounters.NW > 0 ? zoneCounters.NW / zoneCounters.total * 100 : 0,
        zoneCounters.NE > 0 ? zoneCounters.NE / zoneCounters.total * 100 : 0,
        zoneCounters.C > 0 ? zoneCounters.C / zoneCounters.total * 100 : 0,
        zoneCounters.SW > 0 ? zoneCounters.SW / zoneCounters.total * 100 : 0,
        zoneCounters.SE > 0 ? zoneCounters.SE / zoneCounters.total * 100 : 0
    ];
    return {
        numbers: percents,
        percents: percents
    };
};

var heatmapData = function(day) {
    var coordList;
    var data = [];
    for (var time in HEATMAPS[day]) {
        if (HEATMAPS[day].hasOwnProperty(time) &&
            TIMES.indexOf(time) !== -1 &&
            HEATMAPS[day][time].active) {
            coordsList = HEATMAPS[day][time].coords;
            for(var i = 0; i < coordsList.length; i++) {
                data.push(new google.maps.LatLng(
                    coordsList[i][0], coordsList[i][1]
                ));
            }
        }
    }
    return data;
};

var initializeHeatmaps = function() {
    for (var day in HEATMAPS) {
        if (HEATMAPS.hasOwnProperty(day)) {
            initializeMap(day, 'googleMapsShown');
            initializeMap(day, 'googleMapsHidden');
        }
    }
};

var initializeMap = function(day, mapName) {
    HEATMAPS[day][mapName] = (
        new google.maps.visualization.HeatmapLayer({
            data: heatmapData(day),
            dissipating: true
        })
    );
    HEATMAPS[day][mapName].setOptions({
        radius: HEATMAPS[day][mapName].get('120')
    });
};

var insertOptions = function() {
    insertDayOptions();
    insertTimeOptions();
};

var insertDayOptions = function() {
    for (var day in HEATMAPS) {
        if (HEATMAPS.hasOwnProperty(day)) {
            $('#day-options').append(dayOptionHTML(day));
        }
    }
};

var insertTimeOptions = function() {
    for (var selector in HEATMAPS.Lunes) {
        if (HEATMAPS.Lunes.hasOwnProperty(selector)) {
            $('#time-options').append(timeOptionHTML(selector));
        }
    }
};

var dayOptionHTML = function(day) {
    return `
        <div class='col-lg-12 col-2 option' onclick="heatmapToggleDay('${day}', this);">
            <span>${day}</span>
        </div>
    `;
};

var timeOptionHTML = function(selector) {
    return `
        <div class='col-lg-6 col-2 hour-option' onclick="heatmapToggleTime('${selector}', this);">
            <span>${selector}</span>
        </div>
    `;
};

var warning = function(boolean) {
    if (boolean) {
        $('#select-a-day-warning').css('display', 'inline');
    } else {
        $('#select-a-day-warning').css('display', 'none');
    }
};

var setupPDFTables = function() {
    pdfMake.tableLayouts = {
        customBorderColor: {
            hLineColor: function (i) {
                return '#151F4A';
            },
            vLineColor: function (i) {
                return '#151F4A';
            }
        }
    };
};

var findZoneCounters = function() {
    var zone;
    var total = 0;
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
                total += 1;
                if (zone != null) {
                    zoneCounters[zone] += 1;
                }
            }
        }
    }
    zoneCounters.total = total;
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
