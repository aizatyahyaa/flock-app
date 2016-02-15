angular.module('starter', ['ionic', 'satellizer', 'starter.controllers', 'ngCordova', 'angularReverseGeocode'])

    .run(function($ionicPlatform) {
        $ionicPlatform.ready(function() {
            if (window.cordova && window.cordova.plugins.Keyboard) {

                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

                cordova.plugins.Keyboard.disableScroll(true);
            }
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }
        });
    })

    .constant('config', {
        // 'domain': 'http://localhost:1337/localhost:8000',
        'domain': 'http://flock.coolcode.my',
    // 'domain': 'http://localhost:8100/api',
    // 'domain': 'http://ceo.myain.my',
    // 'domain': 'http://localhost:8000',
    })

    .config(['$stateProvider', '$urlRouterProvider', '$authProvider', 'config', function($stateProvider, $urlRouterProvider, $authProvider, config) {

        $authProvider.loginUrl = config.domain + '/api/login/post';

        $stateProvider

            .state('login', {
                url: '/login',
                templateUrl: 'templates/login.html',
                controller: 'AuthCtrl'
            })

            .state('register', {
                url: '/register',
                templateUrl: 'templates/register.html',
                controller: 'RegisterCtrl'
            })

            .state('menu', {
                url: '/menu',
                abstract: true,
                templateUrl: 'templates/menu.html',
                controller: 'AppCtrl'
            })

            .state('menu.home', {
                url: '/home',
                views: {
                    'menu-view': {
                        templateUrl: 'templates/home.html',
                        controller: 'HomeCtrl'
                    }
                }
            })

            .state('menu.profile', {
                url: '/profile',
                views: {
                    'menu-view': {
                        templateUrl: 'templates/profile.html',
                        controller: 'ProfileCtrl'
                    }
                }
            })

            .state('menu.social', {
                url: '/social',
                views: {
                    'menu-view': {
                        templateUrl: 'templates/social.html',
                        controller: 'SocialCtrl'
                    }
                }
            })

            .state('menu.flock', {
                url: '/flock',
                views: {
                    'menu-view': {
                        templateUrl: 'templates/flock.html',
                        controller: 'FlockCtrl'
                    }
                }
            });

        $urlRouterProvider.otherwise('login');


    }])

    .filter('timeago', function() {
        return function(timestamp) {
            // return Date.parse(timestamp) / 1000;
            // return new Date(timestamp).getTime() / 1000;
            var a = new Date(timestamp.replace(/-/g, "/"));
            return new Date(a).getTime() / 1000;
        };
    });
