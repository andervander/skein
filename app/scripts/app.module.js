(function (angular) {

    'use strict';

    angular.module('skein', [
        'ngSanitize',
        'ngResource'
    ])
    .run(['$rootScope', 'Api', '$window', function ($rootScope, Api, $window) {


    }])

    .controller('appController', ['$scope', 'Api', 'Twitter', function ($scope, Api, Twitter) {


        


        $scope.getTw = function () {
            Api.test().then(function (s) {
                console.log(s);
            });
        }

    }]);


}(angular));