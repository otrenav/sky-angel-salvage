
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
    stylers: [{ color: '#57598E' }]
  },
  {
    elementType: 'labels.icon',
    stylers: [{ visibility: 'off' }]
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#303268' }]
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
    stylers: [{ color: '#57598E' }]
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#303268' }]
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{ visibility: 'off' }]
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#f29100' }]
  },
  {
    featureType: 'administrative',
    elementType: 'geometry',
    stylers: [{ visibility: 'off' }]
  },
  {
    elementType: "labels.text.fill",
    stylers: [{ color: '#FCEFFC' }]
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
    stylers: [{ color: '#57598E' }]
  },
  {
    elementType: 'labels.icon',
    stylers: [{ visibility: 'off' }]
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#303268' }]
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
    stylers: [{ color: '#d8e400' }]
  },
  {
    elementType: "labels.text.fill",
    stylers: [{ color: '#FCEFFC' }]
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
    stylers: [{ color: '#57598E' }]
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#303268' }]
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{ visibility: 'off' }]
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#f29100' }]
  },
  {
    featureType: 'administrative',
    elementType: 'geometry',
    stylers: [{ color: '#d8e400' }]
  },
  {
    elementType: "labels.text.fill",
    stylers: [{ color: '#FCEFFC' }]
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
