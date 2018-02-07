
//
// NOTE: Global-space variables: `BOX_VALUES`
//

var init = function() {
    initBoxValues();
    initMap();
    pageInit();
};

var initBoxValues = function() {
    for (var i = 0; i < BOX_VALUES.length; i++) {
        if (!BOX_VALUES[i].error) {
            BOX_VALUES[i].start();
        } else {
            console.error(BOX_VALUES[i].error);
        }
    }
};

var updateBoxValues = function(values) {
    for (var i = 0; i < BOX_VALUES.length; i++) {
        updateBoxPercent(i, values.percents[i]);
        updateBoxValue(i, values.numbers[i]);
    }
};

var updateBoxValue = function(position, number) {
    BOX_VALUES[position].update(number);
};

var updateBoxPercent = function(position, percent) {
    $('#progress-percent-' + (position + 1)).css('width', percent + '%');
};
