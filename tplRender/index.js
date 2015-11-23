	var tplRender = (function(window,undefined){

		var obj = {};

		obj.getCode = function(data,selector){
			var code = document.querySelector(selector);
			var str = code.innerHTML.split('\n').join('');
			/*自动删除标签*/
			code.parentNode.removeChild(code);
			return 	this.render(data,str);
		};

		/*模板字符串, 分界符与代码要分开,避免和别的模板语言冲突*/
		/*统一用双引号*/
		obj.render = function(data,tplStr){
			var str = tplStr.replace(/<%=(.*?)%>/g,"';p+=$1;p+='")
					.replace(/<%/g,"';")
					.replace(/%>/g,"p+='");

			str = "var p = '';p += '" + str + "';return p;";
			var code  = " try{" + str + "}catch(e){console.log(e,data,str)}" ;
			var fn =  new  Function("data","str",code);
			return fn(data,str);
		};

		return obj;

	})(window,undefined);


