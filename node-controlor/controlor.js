/**
 * Created by Administrator on 2015/5/31 0031.
 */
var url = require('url');
var path = require("path");
var fs = require("fs");

// 默认在当前目录寻找action文件
var actionDirPath = './';

//路由配置
var path2handle = {
    "/index":{"action":"action","method":"index"}
};

/**
 * 访问静态资源
 *
 * @param req
 * @param res
 * @returns {undefined}
 */
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


/**
 * 路由入口
 *
 * @param req
 * @param res
 * @returns {undefined}
 */
function route(req,res) {
        //没找到路由配置,则访问静态资源
        var path = url.parse(req.url).path;
        if(!path2handle[path]){
            resourceAccess(req,res);
        }else{
            //访问相应的action和method名
            var actionName = path2handle[path]["action"];
            var methodName = path2handle[path]["method"];
            var module =  require(actionDirPath + actionName + ".js" );
            module[methodName](req,res);
        }
}

/**
 * 配置路由
 *
 * @param path      访问路径 '/xxx'
 * @param option    .action action名默认'action', .method 方法名默认路径名
 * @returns {undefined}
 */
function setRoutePath(path,option){
    var defaultOption = {
        action : 'action',
        method : path.substring(1)
    };

    path2handle[path] = Object.assign(defaultOption,option);
}


/**
 * 设置action文件夹路径
 *
 * @param path
 * @returns {undefined}
 */
function setActionDirPath(path) {
    actionPath = path;
}

module.exports = {
    route,
    setRoutePath,
    setActionDirPath
};



