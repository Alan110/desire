var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');
var db = mongoose.connection;
var User = require('./model/user.js')

db.on('error', console.error.bind(console, 'connection error:'));


function addUser() {
    db.once('open', function (callback) {

        var u1 = new User({
            name: "my test",
            age : 232
        });
        u1.save(function (err) {
             if (err) return handleError(err);
        });
    });
}


function updateUser(id) {
    User.update({name:'my test'},{$set:{age : 999 , size : 'large'}},function(err){
        if(err) return handleError(err);
    });    
}

updateUser();
