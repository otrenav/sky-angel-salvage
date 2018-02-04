
//
// NOTE: Global-space variables: `BOX_INTS`
//

var init = function() {
    initBoxInts();
    initMap();
    pageInit();
};

var initBoxInts = function() {
    for (var i = 0; i < BOX_INTS.length; i++) {
        if (!BOX_INTS[i].error) {
            BOX_INTS[i].start();
        } else {
            console.error(BOX_INTS[i].error);
        }
    }
};

var updateBoxInts = function(values) {
    for (var i = 0; i < BOX_INTS.length; i++) {
        updateBoxInt(i, Math.floor(Math.random() * 1000));
    }
};

var updateBoxInt = function(position, value) {
    BOX_INTS[position].update(value);
};
