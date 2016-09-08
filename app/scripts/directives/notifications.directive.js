(function(){

    'use strict';

    angular.module('skein').directive('notifications', function() {
        return {
            restrict: 'A',
            templateUrl: '/views/notifications.html',
            controller: function ($scope, Notifications, $timeout) {
                $scope.notifications = [];

                Notifications.registerCallback(function(notification) {
                    $scope.notifications.push(notification);
                    $timeout(function() {
                        $scope.notifications.shift();
                    }, 3000);
                });

                $scope.close = function(index) {
                    $scope.notifications.splice(index, 1);
                };

            }
        };
    }).service('Notifications', function() {

        var cb;

        this.registerCallback = function(callback) {
            cb = callback;
        };

        this.notify = function(notification) {
            if (cb) {
                cb(notification);
            }
        };
    });

}());