
//
// NOTE: Global-space objects: `HEATMAPS`, `MAP`, `updateBoxValues()`
//

var DAY_SELECTED = '';

var pageInit = function() {
    insertOptions();
    initializeHeatmaps();
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
        HEATMAPS[day].googleMapsObject.setData(heatmapData(day));
        HEATMAPS[day].googleMapsObject.setMap(MAP);
    } else {
        HEATMAPS[day].googleMapsObject.setMap(null);
    }
};

var updatedBoxValues = function() {
    return {
        numbers: [
            Math.floor(Math.random() * 1000),
            Math.floor(Math.random() * 1000),
            Math.floor(Math.random() * 1000),
            Math.floor(Math.random() * 1000)
        ],
        percents: [
            Math.floor(Math.random() * 100),
            Math.floor(Math.random() * 100),
            Math.floor(Math.random() * 100),
            Math.floor(Math.random() * 100)
        ]
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
            HEATMAPS[day].googleMapsObject = (
                new google.maps.visualization.HeatmapLayer({
                    data: heatmapData(day),
                    dissipating: true
                })
            );
            HEATMAPS[day].googleMapsObject.setOptions({
                radius: HEATMAPS[day].googleMapsObject.get('120')
            });
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
