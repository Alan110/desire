var express = require('express');
var path = require('path');
var app = express();
var bodyParser = require('body-parser');


//业务路由
var logic = require('./src/logic');

//静态文件路径
app.use(express.static(path.join(__dirname, 'dist')));
//body中间件
app.use(bodyParser.urlencoded({ extended: false  }));  
app.use(bodyParser.json());

logic.router(app);
app.listen(8888);
