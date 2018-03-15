function initMap() {
	var uluru = {lat: -25.363, lng: 131.044};
	var map = new google.maps.Map(document.getElementById('map'), {
		zoom: 4,
		center: uluru
	});
	var marker = new google.maps.Marker({
		position: uluru,
		map: map
	});
}


var app = angular.module('myApp', []);
app.controller('aqCtrl', function($scope, $http) {
  $http.get("https://api.openaq.org/v1/cities").then(function (response) {
      $scope.myData = response.data.results;
  });
});