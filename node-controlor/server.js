var http = require('http');
var controlor = require("./controlor.js");

var server = http.createServer( (req,res) => {
   controlor.route(req,res);
}).listen(9090);

controlor.setRoutePath('/adduser',{
    method : 'adduser'
});

