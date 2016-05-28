/**
 * Created by Administrator on 2015/5/31 0031.
 */
var url = require('url');
var path = require("path");
var fs = require("fs");

//����·��
var path2handle = {
    "/index":{"action":"index","method":"index"},
    "/3dimg":{"action":"index","method":"img3d"},
    "/upload":{"action":"upload","method":"method"},
    "/login":{"action":"login","method":"login"}
};


function resourceAccess(req,res){
	//别用__dirname, 这是返回当前文件的目录
	//process.cwd()是返回node执行目录
    var pathname = process.cwd() + url.parse(req.url).pathname;
        fs.exists(pathname,function(exist){
            if(exist){
                switch (path.extname(pathname)){
                    case ".html":
                        res.writeHead(200,{"Content-Type":"text/html"});
                        break;
                    case ".js":
                        res.writeHead(200, {"Content-Type": "text/javascript"});
                        break;
                    case ".css":
                        res.writeHead(200, {"Content-Type": "text/css"});
                        break;
                    case ".gif":
                        res.writeHead(200, {"Content-Type": "image/gif"});
                        break;
                    case ".jpg":
                        res.writeHead(200, {"Content-Type": "image/jpeg"});
                        break;
                    case ".png":
                        res.writeHead(200, {"Content-Type": "image/png"});
                        break;
                    default:
                        //�ļ�����(Ҫ�������������е��ļ���������)
                        res.writeHead(200, {"Content-Type": "application/octet-stream"});
                }

                //�����ļ�������
                fs.readFile(pathname,function(err,data){
                    res.end(data);
                });
            }else{
                //�Ҳ���·��
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.end("404");
            }

        }) ;
}

function controlor(req,res) {
        //·�ɿ���
        var path = url.parse(req.url).path;
        if(!path2handle[path]){
           //���ʾ�̬��Դ
            resourceAccess(req,res);
        }else{
            //�������úõ�ӳ��
            var actionName = path2handle[path]["action"];
            var methodName = path2handle[path]["method"];
            var module =  require("./module/" + actionName + ".js" );
            module[methodName](req,res);
        }
}

module.exports = controlor;



