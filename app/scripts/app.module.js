(function (angular) {

    'use strict';

    angular.module('skein', [])

    .run(['$rootScope', '$window', 'Twitter', function ($rootScope, $window, Twitter) {
        Twitter.init();

        if ($window.localStorage.oauthio_cache && $window.localStorage.oauthio_provider_twitter) {
            $rootScope.userSigned = true;
        }
    }])

    .controller('appController', ['$scope', 'Twitter', function ($scope, Twitter) {

        $scope.user = {};
        $scope.userHashtags = [];

        $scope.signIn = function () {
            Twitter.connectTwitter().then(function () {
                $scope.userSigned = true;
            });
        };

        $scope.searchHashtags = function () {
            var hashtags = [];

            if (!$scope.user.input) {
                $scope.hashtags = [];
                return;
            }

            Twitter.getHashtags($scope.user.input).then(function (res) {
                var ar = $scope.user.input.split(' ');
                var regValue = ar.join('|');
                var reg = new RegExp('^'+regValue, 'i');

                angular.forEach(res.statuses, function (value) {
                    angular.forEach(value.entities.hashtags, function (value) {
                        if (reg.test(value.text)) {
                            var hashtag = value.text.toLowerCase();
                            if (!hashtags.length || hashtags.indexOf(hashtag) === -1) {
                                hashtags.push(hashtag);
                            }
                        }
                    });
                });

                $scope.hashtags = hashtags;
            })
        };
        
        $scope.setHashtag = function (hashtag) {
            if ($scope.userHashtags.indexOf(hashtag) === -1) {
                $scope.userHashtags.push(hashtag);
            }
            $scope.hashtags = [];
            delete $scope.user.input;
        };

        $scope.removeHashtag = function (hashtag) {
            $scope.userHashtags.splice($scope.userHashtags.indexOf(hashtag), 1);
        };

        $scope.saveHashtags = function () {
            console.log($scope.userHashtags);
        };
        

    }]);


}(angular));