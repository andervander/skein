(function(angular){

    'use strict';

    angular.module('skein').factory('Api', ['$q', function ($q) {

        App42.initialize("5d00244e0b2d0e797652aaa1ecb666bf7b5dbd36ba1fbfb4bf0298d1756d2962","d91dac866defa58356548ff36e69eda2d858a058adb1d8e94206b3c27081d955");

        var storageService  = new App42Storage();
        var dbName = "HASHTAGS";

        function toObject(arr) {
            var rv = {};
            for (var i = 0; i < arr.length; ++i)
                rv[i] = arr[i];
            return rv;
        }

        return {

            saveHashtags: function (userId, arr) {
                var deferred = $q.defer();
                var response;

                storageService.insertJSONDocument(dbName, userId, toObject(arr), {
                    success: function (object) {
                        var storageObj = JSON.parse(object);
                        response = storageObj.app42.response.storage;
                        deferred.resolve(response);
                    },

                    error: function (error) {
                        deferred.reject(error);
                    }
                });

                return deferred.promise;
            },

            updateHashtags: function (userId, docId, arr) {
                var deferred = $q.defer(), response;

                storageService.updateDocumentByDocId(dbName, userId, docId, toObject(arr), {
                    success: function(object)  {
                        var storageObj = JSON.parse(object);
                        response = storageObj.app42.response.storage;
                        deferred.resolve(response);
                    },
                    error: function(error) {
                        deferred.reject(error);
                    }
                });

                return deferred.promise;
            },

            findDocument: function (userId) {
                var deferred = $q.defer(), response;

                storageService.findAllDocuments(dbName, userId, {
                    success: function(object) {
                        var storageObj = JSON.parse(object);
                        response = storageObj.app42.response.storage.jsonDoc[0];
                        var arr = [];

                        for (var key in response) {
                            if (isFinite(+key)) {
                                arr.push(response[key]);
                            }
                        }

                        deferred.resolve({arr: arr, docId: response._id.$oid});
                    },
                    error: function(error) {
                        deferred.reject(error);
                    }
                });

                return deferred.promise;
            }
        }
    }]);

}(angular));
