
var MAP, MAP_HIDDEN;

var BOX_VALUES = [
    new CountUp("box-int-one", 0, 0),
    new CountUp("box-int-two", 0, 0),
    new CountUp("box-int-three", 0, 0),
    new CountUp("box-int-four", 0, 0),
    new CountUp("box-int-five", 0, 0)
];

var MAP_STYLES = [
    {
        elementType: 'geometry',
        stylers: [{ color: '#59606B' }]
    },
    {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [{ color: '#98a2b5' }]
    },
    {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [{ color: '#353c48' }]
    },
    {
        elementType: "labels.text.fill",
        stylers: [{ color: "#FFFFFF" }]
    },
    {
        elementType: "labels.text.stroke",
        stylers: [{ visibility: 'off' }]
    },
    {
        featureType: 'administrative',
        elementType: 'labels.text.fill',
        stylers: [{ visibility: 'off' }]
    },
    {
        featureType: 'water',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#353c48' }]
    },
];

var initMap = function() {
    MAP = new google.maps.Map(document.getElementById('map-canvas'), {
        center: {lat: 19.432608, lng:-99.133209},
        styles: MAP_STYLES,
        zoom: 5
    });
};
