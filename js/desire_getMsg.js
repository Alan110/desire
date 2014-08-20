 /**
* 构造函数（利用window.name跨域访问,保证目标页面设置window.name）
* @class windowName    
* url 访问数据页面   需要设置window.name
* config  1.proxy = 本域代理页面
* 		  2.callback = 处理数据回调
*/
var getMsg = function(url,config){
    this.init.apply(this,arguments);
};
getMsg.prototype = {
    /**
     * 初始化
     * @param url{string} 目标域url地址
     * @param config{object} 配置项
     * @配置说明:proxy{string} 本域下的代理页面地址    
     *          callback(function) 处理数据的回调
     * @return void
     */
    init: function(url,config){
        var that = this;
        that.status = false;
        that.data = '';
        var config = that.checkInterface(config);
        that.getData(url,config);
    },
    /**
     * 验证接口,构建正确的参数形式
     * @param obj{object} 配置项 
     * @return object    
     */
    checkInterface: function(obj){
            obj.proxy = obj.proxy || 'proxy.html',
            obj.callback =  obj.callback || new Function
            return obj;
    },
    /**
     * 对iframe的onload实现事件监听
     * @param frame{dom} 对象
     * @param callback(function) 回调
     * @return void
     */
    frameLoad: function(frame,callback){
        if(frame.attachEvent){
            frame.attachEvent('onload',function(){
                callback();
            });
        }else{
            frame.onload = function(){
                callback();
            }
        }
    },


/* 获取跨域数据,并执行回调
     * @param url{string} 目标域url地址
     * @param config{object} 配置项
     * @配置说明:proxy{string} 本域下的代理页面地址
     *          callback(function) 处理数据的回调
     * @return void
     */
    getData: function(url,config){
        var that = this;
        var frame = that.frame = document.createElement('iframe');
        frame.style.display = 'none';
        document.body.insertBefore(frame,null);
        that.frameLoad(frame,function(){
            if(that.status){
                that.data = frame.contentWindow.name;
                that.clearFrame();
                config.callback(that.data);
            }else{
                that.status = true;
                frame.contentWindow.location.href = config.proxy;
            }
        });
        frame.src = url;
    },
    /**
     * 清除iframe
     * @param 
     */
    clearFrame: function(){
        var that = this;
        that.frame.parentNode.removeChild(that.frame);
    }
};
//$.extend('getMsg',function(url,config){
//	new getMsg(url,config);
//})
