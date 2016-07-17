const http = require('http');
const net = require('net');
const url = require('url');

var logs = [];

// Create an HTTP tunneling proxy
var proxy = http.createServer( (req, res) => {
    var path = req.url;
    if(path.indexOf('/addlog') > -1){
        logs.push(req.url)
        res.writeHead(200, {
            'Content-Type': 'application/json',
            "Access-Control-Allow-Origin" : "*"
        });
        res.end('ok');
    }else if(path.indexOf('/clear') > -1){
        logs = [];
        res.writeHead(200, {
            'Content-Type': 'application/json',
            "Access-Control-Allow-Origin" : "*"
        });
        res.end('ok');
    }else if(path.indexOf('getlog') > -1){
        res.writeHead(200, {
            'Content-Type': 'application/json',
            "Access-Control-Allow-Origin" : "*"
        });
        res.end(JSON.stringify(logs));
    }else{
        res.writeHead(200, {
            'Content-Type': 'text/html',
            "Access-Control-Allow-Origin" : "*"
        });
        res.end('ok');
    }
});


// 不写第二参数,默认使用ipv4
proxy.listen(9090);
