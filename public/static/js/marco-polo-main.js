
var DESTINATION_HTML_INPUT = document.getElementById('form-destination');
var ORIGIN_HTML_INPUT = document.getElementById('form-origin');
var DIRECTIONS_RENDERER, DIRECTIONS_SERVICE;
var DESTINATION_PLACE_ID = null;
var ORIGIN_PLACE_ID = null;
var WAYPOINTS = [];
var MARKERS = [];

var pageInit = function() {
    initMapWithAutoComplete();
};

var initMapWithAutoComplete = function() {
    DIRECTIONS_RENDERER = new google.maps.DirectionsRenderer({
        polylineOptions: { strokeColor: '#FF0000' }
    });
    DIRECTIONS_SERVICE = new google.maps.DirectionsService();
    DIRECTIONS_RENDERER.setMap(MAP);

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
        optimizeWaypoints: false,
        waypoints: WAYPOINTS

    }, function(response, status) {
        if (status === 'OK') {
            // console.log(response);
            // TODO: Use response.routes.overview_path to extract
            // Lats and Longs for path.
            DIRECTIONS_RENDERER.setDirections(response);
        } else {
            window.alert('Directions failed: ' + status);
        }
    });
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
