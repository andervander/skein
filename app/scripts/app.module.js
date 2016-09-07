(function (angular) {

    'use strict';

    angular.module('skein', [])

    .run(['$rootScope', '$window', 'Twitter', 'Api', function ($rootScope, $window, Twitter, Api) {
        Twitter.init();

        $rootScope.userHashtags = [];

        function authentication() {
            if ($window.localStorage.hashtags) {
                $rootScope.userHashtags = $window.localStorage.hashtags.split(',');
            }
            Twitter.getUserInfo().then(function (res) {
                $rootScope.userId = res.id_str;
                $rootScope.userSigned = true;

                Api.findDocument($rootScope.userId).then(function (res) {
                    $rootScope.docId = res.docId;
                    if ($rootScope.userHashtags.length) {
                        if ($rootScope.userHashtags.join(',') !== res.arr.join(',')) {
                            Api.updateHashtags($rootScope.userId, $rootScope.docId, $rootScope.userHashtags).then(function (res) {
                            }, function (err) {
                                console.log(err);
                            })
                        }
                    } else {
                        $rootScope.userHashtags = res.arr;
                    }
                }, function (err) {

                });

            });
        }

        $rootScope.signIn = function () {
            Twitter.connectTwitter().then(function () {
                authentication();
            });
        };

        if ($window.localStorage.oauthio_cache && $window.localStorage.oauthio_provider_twitter) {
            $rootScope.userSigned = true;
            authentication();
        }
    }])

    .controller('appController', ['$scope', 'Twitter', 'Api', '$window', function ($scope, Twitter, Api, $window) {

        $scope.user = {};

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

        $scope.saveHashtags = function () {
            $window.localStorage.hashtags = $scope.userHashtags;

            if ($scope.docId) {

                Api.updateHashtags($scope.userId, $scope.docId, $scope.userHashtags).then(function (res) {
                    console.log(res);
                }, function (err) {
                    console.log(err);
                });
                return;
            }

            Api.saveHashtags($scope.userId, $scope.userHashtags).then(function (res) {
                $scope.docId = res.jsonDoc._id.$oid;
            }, function (err) {
                console.log(err);
            })
        };
        

    }]);


}(angular));