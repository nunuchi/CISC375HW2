 var app = angular.module('myApp', []);
 var options;
 var map;

 var scope;
 var http_data;
 var newCoord;
 var backup;
 var coordArray;
 var coordArray2;
 var paramArray;
 var valueArray;
 var selectedDate;
 var particle;
 var particleMax;
 var particleMin;
 var days;
 var usedDate;
 var jsonArray;
 var markersArray = [];

 //end of variables
app.controller('aqCtrl', function($scope, $http) {
  $http.get("https://api.openaq.org/v1/measurements?coordinates=-34,151&radius=200000&limit=100").then(function (response) {
       $scope.myData = response.data.results;
       console.log("test A");

  }); //first get

$scope.updateTable = function() { //updates the table, this is an Angular function that can be called
  $http.get("https://api.openaq.org/v1/measurements?coordinates="+newCoord+"&radius=200000").then(function (response) {
      if (response.data.results.length>0){
       $scope.myData = response.data.results;
       console.log(response.data.results.length);
       coordArray = [];
       coordArray2 = [];
       paramArray = [];
       valueArray = [];
       jsonArray = [];
        for(i = 0; i<response.data.results.length; i++){
       
          var j1 = JSON.parse(JSON.stringify(response.data.results[i]));
          var stringCoords = JSON.stringify(j1["coordinates"]);
          var stringCoords2 = stringCoords.split('/').join(',').split('"').join(',').split(':').join(',').split(' ').join(',').split('{').join(',').split('}').join(',').split(',');
          coordArray.push(parseFloat(stringCoords2[4]));
          coordArray2.push(parseFloat(stringCoords2[8]));
          console.log(stringCoords2[4]+','+stringCoords2[8]);

          var j2 = JSON.parse(JSON.stringify(response.data.results[i]));
          var stringParam = JSON.stringify(j2["parameter"]);
          var stringParam2 = stringParam.split('/').join(',').split('"').join(',').split(':').join(',').split(' ').join(',').split('{').join(',').split('}').join(',').split(',');
          paramArray.push(stringParam2);
          
          console.log(stringParam2[1]);

          var j3 = JSON.parse(JSON.stringify(response.data.results[i]));
          var stringValue = JSON.stringify(j3["value"]);
          var stringValue2 = stringValue.split('/').join(',').split('"').join(',').split(':').join(',').split(' ').join(',').split('{').join(',').split('}').join(',').split(',');
          valueArray.push(stringValue2);
          
          console.log(stringValue2[0]);

          jsonArray.push({
            "content":stringParam2[1]+" "+stringValue2+"µg/m³",
            "coordinates":{lat:stringCoords2[4],lng:stringCoords2[8]}}); //end jsonArray push
        }//for(i = 0; i<response.data.results.length; i++){
          markersArray = [];
          markersArray = jsonArray
          for(var i = 0; i < markersArray.length; i++) {
            console.log(markersArray[i]);
            addMarker(markersArray[i]);
          }//for(var i = 0; i < markersArray.length; i++)
       console.log(jsonArray);
     }
       
  });
  }// update
$scope.getCoords = function() { // curently unused
  return $scope.myData;
}

});

  function initMap(){
    //The map options
    options = {
      zoom: 8,
      center: {lat: -33.8688, lng: 151.2195}
    }
    //Create new map
    map = new google.maps.Map(document.getElementById('map'), options);


    //add a listener, that changes the user_input to the center of where they are on the map
    map.addListener('center_changed', function() {
    var center = map.getCenter();
    var latitude = center.lat();
    var longitude = center.lng();
    document.getElementById("user_input").value = latitude;
    document.getElementById("user_input2").value = longitude;
    });


    // var input = document.getElementById('user_input').value;
    // input = input.split(',');
    // alert(input[0]+','+input[1]);


    var input = document.getElementById('user_input');
    var input2 = document.getElementById('user_input2');
    input.addEventListener('keyup', function(event) {
      var inputx = input.value;
      var input2x = input2.value;
      
      if(inputx==null||input2x==null) {alert('Please enter a latitude and longitude!');}
      if (event.keyCode === 13) {
        var latLng = new google.maps.LatLng(inputx,input2x);
        map.panTo(latLng);
        change(inputx,input2x);
      }
    });

    var filterItems = document.getElementById('filterButton'); //gets filter Data
    filterItems.addEventListener('click', function(event) {

      particle = document.getElementById('particles').value;
      particleMax = document.getElementById('particleRange').value;
      particleMin = document.getElementById('particleRangeMin').value;
      days = document.getElementById('numDays').value;

      if(!particle) {particle2 = "";}
      else {particle = "&parameter="+particle;}

      if(!particleMax) {particleMax2 = "";}
      else {particleMax = "&value_to="+particleMax;}

      if(!particleMin) {particleMin2 = "";}
      else {particleMin = "&value_from="+particleMin;}

      if(!days) {days = "";}
      else {
        var today = new Date();
        var prevDate = new Date(today);
        prevDate.setDate(today.getDate - days);
        var dd = prevDate.getDate();
        var mm = prevDate.getMonth()+1;
        var yyyy = prevDate.getFullYear();
        if(dd<10){
            dd='0'+dd;
        } 
        if(mm<10){
        mm='0'+mm;
        } 
        var prevDate = yyyy+'/'+mm+'/'+dd;
        usedDate = prevDate;

      }


      alert(particle+''+particleMax+''+particleMin+''+days);
    });//Filter Data End
    

    //https://api.openaq.org/v1/measurements?coordinates=28.63576,77.22445&radius=2500, example of coor + radius

    //Array of markers


    /*addMarker({coord:{lat: -32, lng: 150}});
    addMarker({ coord:{lat: -33, lng: 150}, 
          iconImage:'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
          content:'<h1>City, State</h1>'
          });*/


  //Map Markers, have to insert positions into the markers
  //position: {lat: x, lng: y}, where to place the marker
  //map:map, which map to set the marker
  //icon: 'https.png', to set icons for different markers

  }//function initMap()

function change(latitude,longitude) {
  var appElement = document.querySelector('[ng-app=myApp]');
  var $scope = angular.element(appElement).scope();
  $scope = $scope.$$childHead;
  newCoord = latitude+','+longitude;
  $scope.$apply(function(){$scope.updateTable().then(this);});
}

function addMarker(property){
  console.log('addMarker Area')
  console.log(property.coordinates.lat);
  var markerCoords = {lat: parseFloat(property.coordinates.lat), lng: parseFloat(property.coordinates.lng)};
  var marker = new google.maps.Marker({
  position: markerCoords,
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