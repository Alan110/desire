var express = require('express');
var path = require('path');
var app = express();
var bodyParser = require('body-parser');


//业务路由
var logic = require('./service/logic');

//静态文件路径
app.use('/fwk7', express.static('fwk7'));

//body中间件
app.use(bodyParser.urlencoded({ extended: false  }));  
app.use(bodyParser.json());

logic.router(app);
app.listen(8888);
