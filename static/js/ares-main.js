
var map, heatmap, hmLUND;

var iMap = function() {
    console.log("INSIDE");
    map = new google.maps.Map(document.getElementById('map-canvas'), {
        center: {lat: 19.432608, lng:-99.133209},
        zoom: 5,
        styles: [
            {elementType: 'geometry', stylers: [{color: '#59606B'}]},
            {elementType: 'labels.text.stroke', stylers: [{color: '#59606B'}]},
            {elementType: 'labels.text.fill', stylers: [{color: '#59606B'}]},
            {
                featureType: 'administrative.locality',
                elementType: 'labels.text.fill',
                stylers: [{color: '#59606B'}]
            },
            {
                featureType: 'poi',
                elementType: 'labels.text.fill',
                stylers: [{color: '#59606B'}]
            },
            {
                featureType: 'poi.park',
                elementType: 'geometry',
                stylers: [{color: '#59606B'}]
            },
            {
                featureType: 'poi.park',
                elementType: 'labels.text.fill',
                stylers: [{color: '#59606B'}]
            },
            {
                featureType: 'road',
                elementType: 'geometry',
                stylers: [{color: '#59606B'}]
            },
            {
                featureType: 'road',
                elementType: 'geometry.stroke',
                stylers: [{color: '#59606B'}]
            },
            {
                featureType: 'road',
                elementType: 'labels.text.fill',
                stylers: [{color: '#59606B'}]
            },
            {
                featureType: 'road.highway',
                elementType: 'geometry',
                stylers: [{color: '#59606B'}]
            },
            {
                featureType: 'road.highway',
                elementType: 'geometry.stroke',
                stylers: [{color: '#59606B'}]
            },
            {
                featureType: 'road.highway',
                elementType: 'labels.text.fill',
                stylers: [{color: '#59606B'}]
            },
            {
                featureType: 'transit',
                elementType: 'geometry',
                stylers: [{color: '#59606B'}]
            },
            {
                featureType: 'transit.station',
                elementType: 'labels.text.fill',
                stylers: [{color: '#59606B'}]
            },
            {
                featureType: 'water',
                elementType: 'geometry',
                stylers: [{color: '#353c48'}]
            },
            {
                featureType: 'water',
                elementType: 'labels.text.fill',
                stylers: [{color: '#59606B'}]
            },
            {
                featureType: 'water',
                elementType: 'labels.text.stroke',
                stylers: [{color: '#59606B'}]
            },
            {
                featureType: "all",
                elementType: "labels",
                stylers: [{ visibility: "off" }]
            },
        ]
    });
};

var HEATMAPS = {
    '1:00': {
        'coords': [[20.11106791, -98.84941333]],
        'googleMapsObject': null
    },
    '2:00': {
        'coords': [[20.11106791, -98.84941333]],
        'googleMapsObject': null
    },
    '3:00': {
        'coords': [[18.6816123, -101.35755553]],
        'googleMapsObject': null
    },
    '4:00': {
        'coords': [[17.98524071, -98.6596144]],
        'googleMapsObject': null
    },
    '5:00': {
        'coords': [[18.16692818, -97.60328777]],
        'googleMapsObject': null
    },
    '6:00': {
        'coords': [[18.18393956, -98.35351405]],
        'googleMapsObject': null
    },
    '7:00': {
        'coords': [[19.75565027, -98.3710512]],
        'googleMapsObject': null
    },
    '8:00': {
        'coords': [[20.50116752, -100.44472832]],
        'googleMapsObject': null
    },
    '9:00': {
        'coords': [[20.76702782, -98.30227976]],
        'googleMapsObject': null
    },
    '10:00': {
        'coords': [[20.06540032, -101.05188821]],
        'googleMapsObject': null
    },
    '11:00': {
        'coords': [[17.69398571, -101.23074249]],
        'googleMapsObject': null
    },
    '12:00': {
        'coords': [[21.04040261, -98.4937895]],
        'googleMapsObject': null
    }
};

var hasBeenInitialized = false;

var initialize = function() {
    hasBeenInitialized = true;
    for (var selector in HEATMAPS) {
        if (HEATMAPS.hasOwnProperty(selector)) {
            var heatmapData = [];
            var coordsList = HEATMAPS[selector].coords;
            for(var i=0; i < coordsList.length; i++) {
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

var heatmapToggle = function(selector, checkbox) {
    if (!hasBeenInitialized) { initialize(); }
    if (checkbox.checked) {
        HEATMAPS[selector].googleMapsObject.setMap(map);
    } else {
        HEATMAPS[selector].googleMapsObject.setMap(null);
    }
};
