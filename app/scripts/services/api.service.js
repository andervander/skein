(function(angular){

    'use strict';

    angular.module('skein').factory('Api', ['$q', '$resource', function($q, $resource) {
        var authorizationResult = false;

        return {
            init: function() {
                OAuth.initialize('RsktgNy-9SyrBAlzBt0UICx3YlU', {
                    cache: true
                });
                authorizationResult = OAuth.create("twitter");

                console.log(authorizationResult);
            },
            isReady: function() {
                return (authorizationResult);
            },
            connectTwitter: function() {
                var deferred = $q.defer();
                OAuth.popup("twitter", {
                    "oauth_token": "719428719958454272-ZmtIxMPMO5fbtziiZUvD7e8yIJkakH9",
                    "oauth_token_secret": "eu1aUqrB16wcuAJxnuqnxo0irz9MyWQaudJlTLNglWBEK",
                    "provider": "twitter"
                }, function(error, result) {
                    // cache means to execute the callback if the tokens are already present
                    if (!error) {
                        authorizationResult = result;
                        console.log(authorizationResult);
                        deferred.resolve();
                    } else {
                        //do something if there's an error

                    }
                });
                return deferred.promise;
            },
            clearCache: function() {
                OAuth.clearCache('twitter');
                authorizationResult = false;
            },
            getLatestTweets: function(maxId) {
                //create a deferred object using Angular's $q service
                var deferred = $q.defer();
                var url = '/1.1/statuses/home_timeline.json';
                if (maxId) {
                    url += '?max_id=' + maxId;
                }
                var promise = authorizationResult.get(url).done(function(data) {
                    // https://dev.twitter.com/docs/api/1.1/get/statuses/home_timeline
                    // when the data is retrieved resolve the deferred object
                    deferred.resolve(data);
                }).fail(function(err) {
                    deferred.reject(err);
                });
                //return the promise of the deferred object
                return deferred.promise;
            },

            test: function () {
                var deferred = $q.defer();
                var url = '/1.1/search/tweets.json?q=%23superbowl&result_type=recent';

                var promise = authorizationResult.get(url).done(function(data) {
                    deferred.resolve(data);
                }).fail(function(err) {
                    deferred.reject(err);
                });

                return deferred.promise;


            }
        }

    }]).factory('Twitter', function ($resource, $http) {
        var consumerKey = encodeURIComponent('CVXH0SngrJSy4vaRPQkFDnZB6');
        var consumerSecret = encodeURIComponent('JYdLva5YcbAoqWkMEHeuRiSxQLkVtYYEBYasQRId1KxJ3uh5Lj');
        var credentials = Base64.encode(consumerKey + ':' + consumerSecret);

        var twitterOauthEndpoint = $http.post(
            'https://api.twitter.com/oauth/request_token',
            // 'grant_type=client_credentials',
            {
                headers: {
                    'Authorization': 'OAuth oauth_consumer_key="VshAvsn9hM70llcNkBd0AEtoG", oauth_nonce="babde0df02243087691ff953b5dccfec", oauth_signature="3iPaxYFbhODAdTXEj3dhoJBQCfw%3D", oauth_signature_method="HMAC-SHA1", oauth_timestamp="1433665312", oauth_token="348340406-gqIe02ZD5aPSfvauvpgcRlwYfcHVF0OovvbCv2hB", oauth_version="1.0", oauth_callback="http://www.google.com"',
                }
            }
        );



        twitterOauthEndpoint.success(function (response) {
            // a successful response will return
            // the "bearer" token which is registered
            // to the $httpProvider
            console.log(response);
            // serviceModule.$httpProvider.defaults.headers.common['Authorization'] = "Bearer " + response.access_token
        }).error(function (response) {
            // error handling to some meaningful extent
        });


        var r = $resource('https://api.twitter.com/1.1/search/:action',
            {action: 'tweets.json',
                count: 10,
            })

        return r;
    });

}(angular));
