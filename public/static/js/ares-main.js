
//
// NOTE: Global-space objects: `HEATMAPS`, `MAP`, `updateBoxInts()`
//

var pageInit = function() {
    insertOptions();
    initializeHeatmaps();
};

var insertOptions = function() {
    insertDayOptions();
    insertTimeOptions();
};

var dayOptionHTML = function(selector) {
};

var timeOptionHTML = function(selector) {
    return `
        <div class='col-lg-6 col-2 option' onclick="heatmapToggle('${selector}', this);">
            <span>${selector}</span>
        </div>
    `;
};

var insertDayOptions = function() {
};

var insertTimeOptions = function() {
    for (var selector in HEATMAPS) {
        if (HEATMAPS.hasOwnProperty(selector)) {
            $('#time-options').append(timeOptionHTML(selector));
        }
    }
};

var heatmapsUpdateAll = function(obj) {
    for (var selector in HEATMAPS) {
        if (HEATMAPS.hasOwnProperty(selector)) {
            heatmapUpdate(selector, obj);
        }
    }
};

var heatmapHoursAll = function() {
    $("div.option").addClass("active-option");
    heatmapsUpdateAll(MAP);
    updateBoxInts([]);
};

var heatmapHoursNone = function() {
    $("div.option").removeClass("active-option");
    heatmapsUpdateAll(null);
    updateBoxInts([]);
};

var heatmapDaysAll = function() {
    updateBoxInts([]);
};

var heatmapDaysNone = function() {
    updateBoxInts([]);
};

var heatmapToggle = function(selector, div) {
    if ($(div).hasClass("active-option")) {
        heatmapUpdate(selector, null);
        $(div).removeClass("active-option");
    } else {
        heatmapUpdate(selector, MAP);
        $(div).addClass("active-option");
    }
    updateBoxInts([]);
};

var heatmapUpdate = function(selector, obj) {
    HEATMAPS[selector].googleMapsObject.setMap(obj);
};

var initializeHeatmaps = function() {
    for (var selector in HEATMAPS) {
        if (HEATMAPS.hasOwnProperty(selector)) {
            var heatmapData = [];
            var coordsList = HEATMAPS[selector].coords;
            for(var i = 0; i < coordsList.length; i++) {
                heatmapData.push(new google.maps.LatLng(
                    coordsList[i][0], coordsList[i][1]
                ));
            }
            HEATMAPS[selector].googleMapsObject = (
                new google.maps.visualization.HeatmapLayer({
                    data: heatmapData,
                    dissipating: true
                })
            );
            HEATMAPS[selector].googleMapsObject.setOptions({
                radius: HEATMAPS[selector].googleMapsObject.get('120')
            });
        }
    }
};
