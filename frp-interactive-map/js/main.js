/* get element by ID */
function $(element) {
  return document.getElementById(element);
}
var default_thumb = 'images/default_thumb.png';

var styledMapType = new google.maps.StyledMapType(
[
  {
    "featureType": "administrative",
    "elementType": "geometry",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "administrative.country",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#e8f0e7"
      },
      {
        "visibility": "on"
      },
      {
        "weight": 1
      }
    ]
  },
  {
    "featureType": "administrative.country",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#2b4a38"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "administrative.neighborhood",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "administrative.province",
    "elementType": "labels",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "landscape",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#b0cdad"
      },
      {
        "visibility": "simplified"
      }
    ]
  },
  {
    "featureType": "poi",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "road",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "transit",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#e8f0e7"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  }
]
);

var styles = [[{
    url: '/images/people35.png',
    height: 35,
    width: 35,
    anchor: [16, 0],
    textColor: '#ff00ff',
    textSize: 10
  }, {
    url: '/images/people45.png',
    height: 45,
    width: 45,
    anchor: [24, 0],
    textColor: '#ff0000',
    textSize: 11
  }, {
    url: '/images/people55.png',
    height: 55,
    width: 55,
    anchor: [32, 0],
    textColor: '#ffffff',
    textSize: 12
  }], [{
    url: '/images/conv30.png',
    height: 27,
    width: 30,
    anchor: [3, 0],
    textColor: '#ff00ff',
    textSize: 10
  }, {
    url: '/images/conv40.png',
    height: 36,
    width: 40,
    anchor: [6, 0],
    textColor: '#ff0000',
    textSize: 11
  }, {
    url: '/images/conv50.png',
    width: 50,
    height: 45,
    anchor: [8, 0],
    textSize: 12
  }], [{
    url: '/images/heart30.png',
    height: 26,
    width: 30,
    anchor: [4, 0],
    textColor: '#ff00ff',
    textSize: 10
  }, {
    url: '/images/heart40.png',
    height: 35,
    width: 40,
    anchor: [8, 0],
    textColor: '#ff0000',
    textSize: 11
  }, {
    url: '/images/heart50.png',
    width: 50,
    height: 44,
    anchor: [12, 0],
    textSize: 12
  }]];

var markerClusterer = null;
var map = null;
var imageUrl = 'http://chart.apis.google.com/chart?cht=mm&chs=24x32&' +
    'chco=FFFFFF,008CFF,000000&ext=.png';
    imageUrl = 'images/marker.png';
var markers;
var grantee_list = null;
var infoWindow = null;

function refreshMap() {
  showMarkers(); 
}

function showMarkers() {
  if (markerClusterer) {
    markerClusterer.clearMarkers();
  }

  var markers = [];

  var markerImage = new google.maps.MarkerImage(imageUrl,
    new google.maps.Size(29, 37));

  var panel = $('markerlist');
  panel.innerHTML = '';
  var competition_filter = $('competition').value;
  console.log(competition_filter);
  // console.log( data.grantees[i] );
  for (var i = 0; i < data.grantees.length; ++i) {
    if( competition_filter == "All" || grantee_list[i].competition == competition_filter ) {
      var titleText = grantee_list[i].company;
      if (titleText == '') {
        titleText = 'No title';
      }

      var item = document.createElement('DIV');
      var title = document.createElement('A');
      title.href = '#';
      title.className = 'title';
      title.innerHTML = titleText;

      item.appendChild(title);
      panel.appendChild(item);

      if( data.grantees[i].latitude != undefined ) {
      console.log( i + " " + grantee_list[i].latitude);
        var latLng = new google.maps.LatLng(grantee_list[i].latitude,
            data.grantees[i].longitude);
        var marker = new google.maps.Marker({
         position: latLng,
         draggable: true,
         icon: markerImage
        });
        var fn = markerClickFunction(grantee_list[i], latLng);
        google.maps.event.addListener(marker, 'click', fn);
        google.maps.event.addDomListener(title, 'click', fn);
        markers.push(marker);
      }
    }
  }

  var zoom  = -1;
  var size  = -1;
  var style = -1;

  zoom = zoom == -1 ? null : zoom;
  size = size == -1 ? null : size;
  style = style == -1 ? null: style;

  markerClusterer = new MarkerClusterer(map, markers, {
    maxZoom: zoom,
    gridSize: size,
    styles: styles[style]
  });
}

function initialize() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 3,
    center: new google.maps.LatLng(0.0432331, 20.448291),
    mapTypeId: google.maps.MapTypeId.ROADMAP
  });

  //Associate the styled map with the MapTypeId and set it to display.
  map.mapTypes.set('styled_map', styledMapType);
  map.setMapTypeId('styled_map');

  // var refresh = document.getElementById('refresh');
  // google.maps.event.addDomListener(refresh, 'click', refreshMap);

  // var clear = document.getElementById('clear');
  // google.maps.event.addDomListener(clear, 'click', clearClusters);

  var competition = document.getElementById('competition');
  google.maps.event.addDomListener(competition, 'change', refreshMap);

  infoWindow = new google.maps.InfoWindow();

  grantee_list = data.grantees;
  refreshMap();
}

function clearClusters(e) {
  e.preventDefault();
  e.stopPropagation();
  markerClusterer.clearMarkers();
}

markerClickFunction = function(grantee, latlng) {
  return function(e) {
    e.cancelBubble = true;
    e.returnValue = false;
    if (e.stopPropagation) {
      e.stopPropagation();
      e.preventDefault();
    }
    var title = grantee.company;
    var url = grantee.photo_url;
    var fileurl = grantee.thumbnail !== "" ? 'images/thumbs/' + grantee.thumbnail 
                                           : default_thumb;

    var blurb = grantee.blurb || 'No description available';

    var infoHtml = '<div class="info">' +
      '<div class="info-body">' +
      '<a href="' + grantee.url + '" target="_blank"><img src="' +
      fileurl + '" class="info-img"/></a></div>' +
      '<h3 class="info-title">' + title + '</h3>' +
      '<p class="info-blurb">' + blurb + '</p>' +
      '<a href="' + grantee.url + '" target="_blank" class="info-read-more">Read more</a></div></div>';

    infoWindow.setContent(infoHtml);
    infoWindow.setPosition(latlng);
    infoWindow.open(map);

    // map.setZoom( 8);
  };
};

