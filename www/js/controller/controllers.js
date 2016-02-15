angular.module('starter.controllers', [])

    .controller('AuthCtrl', ['$scope', '$auth', '$state', 'config', '$http', '$rootScope', function($scope, $auth, $state, config, $http, $rootScope) {

        $scope.login = function(request) {

            var credential = {
                email: request.email,
                password: request.password
            };

            $auth.login(credential)
                .then(function(success) {
                    var user = JSON.stringify(success.data.auth);

                    localStorage.setItem('user', user);

                    $rootScope.authenticated = true;

                    $rootScope.currentUser = success.data.auth;

                    $state.go('menu.home');

                }, function(error) {
                    $scope.errors = error.data;
                });

        };

    }])

    .controller('RegisterCtrl', ['$scope', '$http', 'config', '$state', function($scope, $http, config, $state) {

        $scope.register = function(request) {

            var credential = {
                name: request.name,
                email: request.email,
                password: request.password
            };

            $http.post(config.domain + '/api/register/post', credential)
                .then(function(success) {
                    console.log(success);
                    alert('Register success, please login to continue');
                    $state.go('login');
                }, function(error) {
                    $scope.errors = error.data;
                    console.log($scope.errors);
                });
        };

    }])

    .controller('HomeCtrl', ['$scope', '$cordovaGeolocation', '$ionicPlatform', '$rootScope', 'config', '$http', '$ionicModal', function($scope, $cordovaGeolocation, $ionicPlatform, $rootScope, config, $http, $ionicModal) {

        $ionicModal.fromTemplateUrl('templates/add_location_modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modal = modal;
        });

        $scope.showModalAddLocation = function() {
            $scope.modal.show();
        };

        $scope.addPlace = function(request) {

            $scope.modal.hide();

            var request = {
                comment: request.comment,
                lat: $scope.lat,
                lng: $scope.lng
            };

            $scope.request = '';

            $http.post(config.domain + '/api/place', request)
                .then(function(success) {
                    alert('Location saved');
                }, function(error) {
                    console.log('An error has occured');
                });
        };

        $ionicPlatform.ready(function() {

            var posOptions = {
                timeout: 10000,
                enableHighAccuracy: false
            };

            $cordovaGeolocation.getCurrentPosition(posOptions)
                .then(function(success) {
                    $scope.lat = success.coords.latitude;
                    $scope.lng = success.coords.longitude;

                    var latLng = new google.maps.LatLng($scope.lat, $scope.lng);

                    var mapOptions = {
                        center: latLng,
                        zoom: 15,
                        mapTypeId: google.maps.MapTypeId.ROADMAP,
                        disableDefaultUI: true
                    };

                    $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);

                    google.maps.event.addListenerOnce($scope.map, 'idle', function() {

                        var marker = new google.maps.Marker({
                            map: $scope.map,
                            animation: google.maps.Animation.DROP,
                            position: latLng
                        });

                        var infoWindow = new google.maps.InfoWindow({
                            content: "Here I am!"
                        });

                        google.maps.event.addListener(marker, 'click', function() {
                            infoWindow.open($scope.map, marker);
                        });
                    });

                }, function(err) {
                    // error
                });
        });
    }])

    .controller('ProfileCtrl', ['$scope', '$http', 'config', '$auth', function($scope, $http, config, $auth) {

        $http.get(config.domain + '/api/current/user')
            .then(function(success) {
                // console.log(success.data.user);

                var user = JSON.stringify(success.data.user);

                localStorage.setItem('user', user);

                $scope.user = success.data.user;

            }, function(error) {

                console.log(error);
            });

    }])

    .controller('SocialCtrl', ['$scope', 'config', '$http', function($scope, config, $http) {

        $http.get(config.domain + '/api/place')
            .then(function(success) {
                $scope.places = success.data;
                console.log(success.data);
            }, function(error) {
                console.log('');
            });

    }])

    .controller('FlockCtrl', ['$scope', '$cordovaGeolocation', '$ionicPlatform', '$rootScope', 'config', '$http', function($scope, $cordovaGeolocation, $ionicPlatform, $rootScope, config, $http) {

        /*$http.get(config.domain + '/api/ceo')
            .then(function(success) {
                console.log(success);
            }, function(error) {
                console.log(error);
            });*/
        $ionicPlatform.ready(function() {

            var posOptions = {
                timeout: 10000,
                enableHighAccuracy: false
            };

            var user = JSON.parse(localStorage.getItem('user'));
            // console.log(user.places);

            $cordovaGeolocation.getCurrentPosition(posOptions)
                .then(function(success) {
                    $scope.lat = success.coords.latitude;
                    $scope.lng = success.coords.longitude;

                    var latLng = new google.maps.LatLng($scope.lat, $scope.lng);

                    var mapOptions = {
                        center: latLng,
                        zoom: 15,
                        mapTypeId: google.maps.MapTypeId.ROADMAP,
                    };

                    $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);

                    google.maps.event.addListenerOnce($scope.map, 'idle', function() {

                        var marker = new google.maps.Marker({
                            map: $scope.map,
                            animation: google.maps.Animation.DROP,
                            position: latLng
                        });

                        angular.forEach(user.places, function(value, key) {

                            var latLng = new google.maps.LatLng(value.lat, value.lng);

                            $scope.addMarker(latLng);
                        });

                    });

                }, function(err) {
                    // error
                });
        });

        $scope.addMarker = function(latLng) {

            var marker = new google.maps.Marker({
                map: $scope.map,
                animation: google.maps.Animation.DROP,
                position: latLng
            });

            return marker;
        };

    }])

    .controller('PlaceCtrl', ['$scope', '$http', 'config', function($scope, $http, config) {

        $scope.delete = function(index, place) {

            $http.delete(config.domain + '/api/place/' + place.id)
                .then(function(success) {
                    $scope.user = JSON.parse(localStorage.getItem('user'));

                    $scope.user.places.splice(index, 1);

                    $scope.user.places.length = 0;

                    alert('Check-in deleted');
                }, function(error) {
                    alert('An error has occured');
                });

        };
    }])

    .controller('AppCtrl', ['$scope', '$state', 'config', '$http', '$auth', '$rootScope', function($scope, $state, config, $http, $auth, $rootScope) {

        $scope.user = JSON.parse(localStorage.getItem('user'));

        $scope.logout = function() {

            $auth.logout()
                .then(function(success) {
                    localStorage.removeItem('user');

                    $rootScope.authenticated = false;

                    $rootScope.currentUser = null;

                    $state.go('login');
                }, function(error) {
                    //error
                });
        };

    }]);
