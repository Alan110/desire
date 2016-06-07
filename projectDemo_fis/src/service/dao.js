var mongoose = require('mongoose');
    mongoose.connect('mongodb://localhost/test');
var User = require('./model/user.js')
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));


function addUser() {
    db.once('open', function (callback) {
        var u1 = new User({
            "name" : "my test"
        });
        u1.save(function(err){
            if (err) return handleError(err);
        });
    });
}

addUser();
