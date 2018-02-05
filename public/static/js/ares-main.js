
//
// NOTE: Global-space objects: `HEATMAPS`, `MAP`, `updateBoxInts()`
//

var DAY_SELECTED = '';

var pageInit = function() {
    insertOptions();
    initializeHeatmaps();
};

var heatmapToggleDay = function(day, div) {
    if (DAY_SELECTED !== '') {
        resetDaySelection();
    }
    if (DAY_SELECTED === day) {
        $(div).removeClass("option-enabled");
        heatmapHoursNone();
        DAY_SELECTED = '';
    } else {
        $(div).addClass("option-enabled");
        DAY_SELECTED = day;
        heatmapHoursAll();
    }
    updateBoxInts([]);
};

var heatmapToggleTime = function(time, div) {
    if (DAY_SELECTED === '') {
        warning(true);
    } else {
        warning(false);
        if ($(div).hasClass("option-enabled")) {
            $(div).removeClass("option-enabled");
            heatmapUpdateDayTime(DAY_SELECTED, time, null);
        } else {
            heatmapUpdateDayTime(DAY_SELECTED, time, MAP);
            $(div).addClass("option-enabled");
        }
        updateBoxInts([]);
    }
};

var heatmapHoursAll = function() {
    if (DAY_SELECTED === '') {
        warning(true);
    } else {
        warning(false);
        heatmapsUpdateAllHoursForDay(DAY_SELECTED, MAP);
        $("div.hour-option").addClass("option-enabled");
        updateBoxInts([]);
    }
};

var heatmapHoursNone = function() {
    warning(false);
    $("div.hour-option").removeClass("option-enabled");
    heatmapsUpdateAllHoursForDay(DAY_SELECTED, null);
    updateBoxInts([]);
};

var heatmapsUpdateAllHoursForDay = function(day, obj) {
    for (var time in HEATMAPS[day]) {
        if (HEATMAPS[day].hasOwnProperty(time)) {
            heatmapUpdateDayTime(day, time, obj);
        }
    }
};

var heatmapUpdateDayTime = function(day, time, obj) {
    HEATMAPS[day][time].googleMapsObject.setMap(obj);
};

var resetDaySelection = function() {
    warning(false);
    heatmapHoursNone();
    $("div.option").removeClass("option-enabled");
};

var initializeHeatmaps = function() {
    var heatmapData;
    for (var day in HEATMAPS) {
        if (HEATMAPS.hasOwnProperty(day)) {
            for (var time in HEATMAPS[day]) {
                if (HEATMAPS[day].hasOwnProperty(time)) {
                    heatmapData = [];
                    var coordsList = HEATMAPS[day][time].coords;
                    for(var i = 0; i < coordsList.length; i++) {
                        heatmapData.push(new google.maps.LatLng(
                            coordsList[i][0], coordsList[i][1]
                        ));
                    }
                    HEATMAPS[day][time].googleMapsObject = (
                        new google.maps.visualization.HeatmapLayer({
                            data: heatmapData,
                            dissipating: true
                        })
                    );
                    HEATMAPS[day][time].googleMapsObject.setOptions({
                        radius: HEATMAPS[day][time].googleMapsObject.get('120')
                    });
                }
            }
        }
    }
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
