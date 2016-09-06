(function(angular){

    'use strict';

    angular.module('skein').factory('Twitter', ['$q', function ($q) {
        var authorizationResult = false;

        return {
            init: function () {
                OAuth.initialize('RsktgNy-9SyrBAlzBt0UICx3YlU', {
                    cache: true
                });
                authorizationResult = OAuth.create("twitter");
            },
            connectTwitter: function () {
                var deferred = $q.defer();
                OAuth.popup("twitter", {
                    cache: true
                }, function (error, result) {
                    if (!error) {
                        authorizationResult = result;
                        deferred.resolve();
                    } else {

                    }
                });
                return deferred.promise;
            },
            clearCache: function () {
                OAuth.clearCache('twitter');
                authorizationResult = false;
            },
            getHashtags: function (s) {
                var deferred = $q.defer();
                var ar = s.split(" ");

                angular.forEach(ar, function (val, i) {
                    ar[i] = '%23' + val;
                });

                var params = ar.join('+OR+');

                var url = '/1.1/search/tweets.json?q='+params+'&result_type=recent&count=50';

                authorizationResult.get(url).done(function (data) {
                    deferred.resolve(data);
                }).fail(function (err) {
                    deferred.reject(err);
                });

                return deferred.promise;
            }
        }
    }]);

}(angular));
