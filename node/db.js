var mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1/new_profile', { useNewUrlParser: true });

mongoose.connection.on('connected', function() {
    console.log('db default connection open');
})

mongoose.connection.on('error', function(err) {
    console.log('db default connection error: ' + err);
})

mongoose.connection.on('disconected', function() {
    console.log('db default connection disconected');
})

process.on('SIGINT', function() {
    mongoose.connection.close(function() {
        console.log('db default connection disconected though app terminate');
        process.exit(0);
    })
})