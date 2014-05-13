/**
 * Created by fengkai on 2014/4/26.
 */
$.extend('Ajax',function(url, setting){
    //初始化参数
    function fn() {
    }
    var async = setting.async !== false,
        method = setting.method || 'post',
        encode = setting.encode || 'utf-8',
        data = setting.data || null,
        success = setting.success || fn,
        failure = setting.failure || fn;
    //get初始化
    method = method.toUpperCase();
    if (data && typeof  data == 'object') {//for json
        data = $._serialize(data);//序列化
    }
    if (method == 'GET' && data) {
        url += (url.indexOf('?') == -1 ? '?' : '&') + data;
        data = null;
    }
    //xhr初始化
    var xhr = XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if (xhr.status >= 200 && xhr.status < 300) {
                success(xhr.responseText);
            } else {
                failure(xhr.responseText);
            }
        }
    }

    //发送请求
    xhr.open(method, url, async);
    if (method == 'POST') {
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded;charset=' + encode);
    }
    xhr.send(data);
    return xhr;
});

$.extend('get',function(url,callback){
    $.Ajax(url,{'success':callback,'mehtod':'get'});
})

$.extend('post',function(url,data,callback){
    $.Ajax(url,{'success':callback,'data':data,'mehtod':'post'});
})

$.extend('jsonp',function(url,callback){
	if(url.indexOf('callback') == -1){
		throw '没有指明callback参数';
		return;
	}

	var temp = url.substring(url.indexOf('?')+1).split('&');
	for(var i=0;i<temp.length;i++){
		if(temp[i].indexOf('callback') != -1){
			var star = url.indexOf('callback=')+9;
			var name = url.substring(star);
			window[name] = callback;
		}
	}
	
	var script = document.createElement('script');  
	script.setAttribute('src', url);  
	//load javascript  
	document.getElementsByTagName('head')[0].appendChild(script);  
})
