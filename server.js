var express = require('express');
var app = express();
var Twitter = require('twitter');

app.use(express.static('app'));
app.use(express.static('.'));

app.listen(3000, function () {
    console.log('run');
});


var client = new Twitter({
    consumer_key: 'CVXH0SngrJSy4vaRPQkFDnZB6',
    consumer_secret: 'JYdLva5YcbAoqWkMEHeuRiSxQLkVtYYEBYasQRId1KxJ3uh5Lj',
    access_token_key: '719428719958454272-ZmtIxMPMO5fbtziiZUvD7e8yIJkakH9',
    access_token_secret: 'eu1aUqrB16wcuAJxnuqnxo0irz9MyWQaudJlTLNglWBEK'
});

var params = {screen_name: 'nodejs'};

client.get('statuses/user_timeline', params, function(error, tweets, response) {
    if (!error) {
        console.log(tweets);
    }
});