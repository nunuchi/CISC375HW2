  var app = angular.module('myApp', []);
app.controller('aqCtrl', function($scope, $http) {
  $http.get("https://api.openaq.org/v1/measurements").then(function (response) {
      $scope.myData = response.data.results;
  });
});
  function initMap(){
    //The map options
    var options = {
      zoom: 8,
      center: {lat: -33.8688, lng: 151.2195}
    }
    //Create new map
    var map = new google.maps.Map(document.getElementById('map'), options);


    //add a listener, that changes the user_input to the center of where they are on the map
    map.addListener('center_changed', function() {
    var center = map.getCenter();
    var latitude = center.lat();
    var longitude = center.lng();
    document.getElementById("user_input").value = latitude+','+longitude;
    });


    // var input = document.getElementById('user_input').value;
    // input = input.split(',');
    // alert(input[0]+','+input[1]);


    var input = document.getElementById('user_input');
    input.addEventListener('keyup', function(event) {
      var input2 = input.value;
      var inputSplit = input2.split(',');

      if (event.keyCode === 13) {
        var latLng = new google.maps.LatLng(inputSplit[0], inputSplit[1])
        map.panTo(latLng);
        alert(inputSplit[0]+','+inputSplit[1]);
      }
    });


    map.setCenter({lat:75,lng:150});

    //https://api.openaq.org/v1/measurements?coordinates=28.63576,77.22445&radius=2500, example of coor + radius

    //Array of markers
    var markersArray = 
    [
      { 
        coord:{lat: -33.8688, lng: 151.2195}, 
        iconImage:'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
        content:'<h1>City, State</h1>'
      },
      { 
        coord:{lat: -36, lng: 150},
        content:'<h1>City, State</h1>'
      },
      { 
        coord:{lat: -27, lng: 150},
        content:'<h1>City, State</h1>'
      },
    ];

    for(var i = 0; i < markersArray.length; i++) {
      addMarker(markersArray[i]);
    }//for(var i = 0; i < markersArray.length; i++)


    /*addMarker({coord:{lat: -32, lng: 150}});
    addMarker({ coord:{lat: -33, lng: 150}, 
          iconImage:'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
          content:'<h1>City, State</h1>'
          });*/


  //Map Markers, have to insert positions into the markers
  //position: {lat: x, lng: y}, where to place the marker
  //map:map, which map to set the marker
  //icon: 'https.png', to set icons for different markers
    function addMarker(property){
      var marker = new google.maps.Marker({
        position: property.coord,
        map: map,

      });

      //Check for if Icon value exists
      if(property.iconImage){ //Sets IconImage of the Marker
        marker.setIcon(property.iconImage);
      }//if(property.iconImage)

      //Check for if Content value exists
      if(property.content){//Sets the Content to the Marker
        var infoWindow = new google.maps.InfoWindow({
          content:property.content
        });

        //adds a click listener to the Marker, showing the Content
        marker.addListener('click', function(){
          infoWindow.open(map, marker);
        });

      }//if(property.content)
    }//function addMarker(property)
  }//function initMap()
