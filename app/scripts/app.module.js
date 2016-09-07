(function (angular) {

    'use strict';

    angular.module('skein', [])

    .run(['$rootScope', '$window', 'Twitter', function ($rootScope, $window, Twitter) {
        Twitter.init();

        if ($window.localStorage.oauthio_cache && $window.localStorage.oauthio_provider_twitter) {
            Twitter.getUserInfo().then(function (res) {
                $rootScope.userId = res.id_str;
                $rootScope.userSigned = true;
            });
        }
    }])

    .controller('appController', ['$scope', 'Twitter', 'Api', function ($scope, Twitter, Api) {

        $scope.user = {};
        $scope.userHashtags = [];

        $scope.signIn = function () {
            Twitter.connectTwitter().then(function () {
                Twitter.getUserInfo().then(function (res) {
                    $scope.userId = res.id_str;
                    $scope.userSigned = true;
                });
            });
        };

        $scope.searchHashtags = function () {
            var hashtags = [];

            if (!$scope.user.input) {
                $scope.noResults = false;
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

                $scope.noResults = !$scope.hashtags.length;
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

        var docId;
        $scope.saveHashtags = function () {
            // console.log($scope.userHashtags);
            if (docId) {

                Api.updateHashtags($scope.userId, docId, $scope.userHashtags).then(function (res) {
                    console.log(res);
                });
                return;
            }

            Api.saveHashtags($scope.userId, $scope.userHashtags).then(function (res) {
                docId = res.jsonDoc._id.$oid;
            })
        };

        $scope.loadHashtags = function () {

        };
        

    }]);


}(angular));