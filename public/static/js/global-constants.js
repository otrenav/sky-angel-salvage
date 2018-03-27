
var MAP, MAP_HIDDEN;

var BOX_VALUES = [
    new CountUp("box-int-one", 0, 0),
    new CountUp("box-int-two", 0, 0),
    new CountUp("box-int-three", 0, 0),
    new CountUp("box-int-four", 0, 0),
    new CountUp("box-int-five", 0, 0)
];

var MAP_STYLE_NO_LABELS = [
    {
        elementType: 'geometry',
        stylers: [{ color: '#59606B' }]
    },
    {
        elementType: 'labels.icon',
        stylers: [{ visibility: 'off' }]
    },
    {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [{ color: '#353c48' }]
    },
    {
        featureType: 'water',
        elementType: 'labels.text.fill',
        stylers: [{ visibility: 'off' }]
    },
    {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [{ visibility: 'off' }]
    },
    {
        featureType: 'administrative',
        elementType: 'geometry',
        stylers: [{ visibility: 'off' }]
    },
    {
        elementType: "labels.text.fill",
        stylers: [{ visibility: 'off' }]
    },
    {
        elementType: "labels.text.stroke",
        stylers: [{ visibility: 'off' }]
    },
    {
        featureType: 'road',
        elementType: 'labels.text.fill',
        stylers: [{ visibility: 'off' }]
    },
    {
        featureType: 'administrative',
        elementType: 'labels.text.fill',
        stylers: [{ visibility: 'off' }]
    }
];
var MAP_STYLE_ROADS = [
    {
        elementType: 'geometry',
        stylers: [{ color: '#59606B' }]
    },
    {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [{ color: '#353c48' }]
    },
    {
        featureType: 'water',
        elementType: 'labels.text.fill',
        stylers: [{ visibility: 'off' }]
    },
    {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [{ color: '#fb9678' }]
    },
    {
        featureType: 'administrative',
        elementType: 'geometry',
        stylers: [{ visibility: 'off' }]
    },
    {
        elementType: "labels.text.fill",
        stylers: [{ color: '#FFFFFF' }]
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
];
var MAP_STYLE_ENTITIES = [
    {
        elementType: 'geometry',
        stylers: [{ color: '#59606B' }]
    },
    {
        elementType: 'labels.icon',
        stylers: [{ visibility: 'off' }]
    },
    {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [{ color: '#353c48' }]
    },
    {
        featureType: 'water',
        elementType: 'labels.text.fill',
        stylers: [{ visibility: 'off' }]
    },
    {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [{ visibility: 'off' }]
    },
    {
        featureType: 'administrative',
        elementType: 'geometry',
        stylers: [{ color: '#01c0c8' }]
    },
    {
        elementType: "labels.text.fill",
        stylers: [{ color: '#FFFFFF' }]
    },
    {
        elementType: "labels.text.stroke",
        stylers: [{ visibility: 'off' }]
    },
    {
        featureType: 'road',
        elementType: 'labels.text.fill',
        stylers: [{ visibility: 'off' }]
    }
];
var MAP_STYLE_ALL = [
    {
        elementType: 'geometry',
        stylers: [{ color: '#59606B' }]
    },
    {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [{ color: '#353c48' }]
    },
    {
        featureType: 'water',
        elementType: 'labels.text.fill',
        stylers: [{ visibility: 'off' }]
    },
    {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [{ color: '#fb9678' }]
    },
    {
        featureType: 'administrative',
        elementType: 'geometry',
        stylers: [{ color: '#01c0c8' }]
    },
    {
        elementType: "labels.text.fill",
        stylers: [{ color: '#FFFFFF' }]
    },
    {
        elementType: "labels.text.stroke",
        stylers: [{ visibility: 'off' }]
    }
];

var initMap = function() {
    MAP = new google.maps.Map(document.getElementById('map-canvas'), {
        mapTypeControlOptions: {
            mapTypeIds: [ 'empty', 'roads', 'entities', 'all' ]
        },
        center: { lat: 19.432608, lng:-99.133209 },
        styles: MAP_STYLE_ALL,
        zoom: 5
    });
    var mapStyleSinEtiquetas = new google.maps.StyledMapType(
        MAP_STYLE_NO_LABELS, { name: 'Vacio' }
    );
    var mapStyleRoads = new google.maps.StyledMapType(
        MAP_STYLE_ROADS, { name: 'Vialidades' }
    );
    var mapStyleEntities = new google.maps.StyledMapType(
        MAP_STYLE_ENTITIES, { name: 'Entidades' }
    );
    var mapStyleAll = new google.maps.StyledMapType(
        MAP_STYLE_ALL, { name: 'Todo' }
    );
    MAP.mapTypes.set('empty', mapStyleSinEtiquetas);
    MAP.mapTypes.set('roads', mapStyleRoads);
    MAP.mapTypes.set('entities', mapStyleEntities);
    MAP.mapTypes.set('all', mapStyleAll);
    MAP.setMapTypeId('empty');
};

//  var roadAtlasStyles = [
//     {
//       featureType: 'transit.line',
//       elementType: 'geometry',
//       stylers: [
//         { hue: '#ff0000' },
//         { visibility: 'on' },
//         { lightness: -70 }
//       ],
//       enableCloseButton: true,
//       visible: false
//     }
//   ];

//   var mapOptions = {
//     zoom: 12,
//     center: chicago,
//     mapTypeControlOptions: {
//       mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'usroadatlas']
//     }
//   };

//   map = new google.maps.Map(document.getElementById('map-canvas'),
//       mapOptions);

//   var styledMapOptions = {
//     name: 'US Road Atlas'
//   };

//   var usRoadMapType = new google.maps.StyledMapType(
//       roadAtlasStyles, styledMapOptions);


//   map.mapTypes.set('usroadatlas', usRoadMapType);
//   map.setMapTypeId('usroadatlas');

//   google.maps.event.addDomListener(document.getElementById('test'), 'click', function() {
//     map.setMapTypeId(google.maps.MapTypeId.ROADMAP);
//   });

// }

// jQuery(document).ready(function () {
//     google.maps.event.addDomListener(window, 'load', initialize);
// });
