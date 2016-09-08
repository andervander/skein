(function (angular) {

    'use strict';

    angular.module('skein', [])

    .run(['$rootScope', '$window', 'Twitter', 'Api', 'Notifications', function ($rootScope, $window, Twitter, Api, Notifications) {
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
                                Notifications.notify({type: 'error'});
                            })
                        }
                    } else {
                        $rootScope.userHashtags = res.arr;
                    }
                });

            }, function (err) {
                Notifications.notify({type: 'error'});
            });
        }

        $rootScope.signIn = function () {
            Twitter.connectTwitter().then(function () {
                authentication();
            });
        };

        $rootScope.signOut = function () {
            Twitter.clearCache();
            $rootScope.userSigned = false;
            delete $window.localStorage.hashtags;
        };

        if ($window.localStorage.oauthio_cache && $window.localStorage.oauthio_provider_twitter) {
            $rootScope.userSigned = true;
            authentication();
        }
    }])

    .controller('appController', ['$scope', 'Twitter', 'Api', '$window', 'Notifications', function ($scope, Twitter, Api, $window, Notifications) {

        $scope.user = {};

        $scope.searchHashtags = function () {
            var hashtags = [];
            $scope.loading = true;

            if (!$scope.user.input) {
                $scope.noResults = false;
                $scope.loading = false;
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
                $scope.loading = false;
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

                Api.updateHashtags($scope.userId, $scope.docId, $scope.userHashtags).then(function () {
                    Notifications.notify({type: 'saved'});
                }, function (err) {
                    Notifications.notify({type: 'error'});
                });
                return;
            }

            Api.saveHashtags($scope.userId, $scope.userHashtags).then(function (res) {
                $scope.docId = res.jsonDoc._id.$oid;
                Notifications.notify({type: 'saved'});
            }, function (err) {
                Notifications.notify({type: 'error'});
            })
        };
        

    }]);


}(angular));