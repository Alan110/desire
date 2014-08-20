(function(window,undefined) {
	var moduleMap = {};
	var config = { 
		paths:{}
	};
	var catchs = {};
	/*----------------------------------------------------------------------模块管理,加载系统*/
	var apple = {
		/*模块定义接口
		  可以返回函数或者对象*/
		define:function(name,dependencies,factory){
			if(!moduleMap[name]){
				var module = {
					name:name,
					dependencies : dependencies,
					factory : factory
				}
				moduleMap[name] = module;
			}
		},
		/*实例化模块*/
		use:function(name){

			if(!moduleMap[name].instance){
				var args = [],
					f = function(){},
					module = moduleMap[name];

				for(var i=0,len = module.dependencies.length;i<len;i++){
					var depModule = moduleMap[module.dependencies[i]];

					depModule.instance ?
						args.push(depModule.instance) :
						args.push(this.use(depModule.name));
				}

				module.instance = module.factory.apply(f,args);
			}

			return moduleMap[name].instance;
		},

		/*模块加载入口*/
		require:function(dependencies,main){
			var head = document.getElementsByTagName('head')[0],
				index = 0,
				length = config.paths.length || 0,
				init = function(){
					for(var i in moduleMap){
						apple.use(i);
					}

					var arr = [];
					for(var i=0,len = dependencies.length;i<len;i++){
						if(!moduleMap[dependencies[i]]){
							throw new Error('no find dependencies module '+ dependencies[i] +' definition ' );
							return;
						}
						arr.push(moduleMap[dependencies[i]].instance);
					}

					var fn = function(){};
					main.apply(fn,arr);

				};
/*L----*/
			length == 0 && init();

			for(var k in config.paths){
                if(k == 'length') return;
				var script = document.createElement('script');
				script.type = 'text/javascript';
				script.onload = script.onreadystatechange = function(){
					if( !this.readyState || this.readyState == 'complete' || this.readyState === "loaded" ){
						index++;
						index == length && init();

						/*解决 ie 内存泄漏*/
						script.onload = script.onreadystatechange = null;  
					}
				}

                script.src = config.paths[k];
                head.appendChild(script);
            }

		},

		/*模块加载配置接口
			path:[] */
		requireCfg:function(cfg){
			config.paths = cfg.paths;
            var length = 0;
            for(var i in cfg.paths){
                length++;
            }
            config.paths.length = length;
		}
	};
	window.require = apple.require;   /*对外接口*/
	window.define = apple.define;
	window.requireCfg = apple.requireCfg;

	/*----------------------------------------------------------------------核心模块定义*/
	apple.define('desire',['query','tools','catch'],function(query,tools,Catch){
		var desire = function(selector,context){
			return  new desire.fn.init(selector,context);
		}
		desire.fn = desire.prototype;
		desire.fn.init = function(selector,context){
			this.length = 0;
			var self = this;

			var els = query.find(selector,context);

			tools.each(els,function(el,index){
				self[index] = el;
			})
			this.length = els ? els.length : 0;
		}
		desire.fn.init.prototype = desire.fn;
		desire.extend = desire.fn.extend = function(){

			/*如果为true 则深拷贝*/
			if(typeof arguments[0] === 'boolean' && arguments[0] && arguments.length > 2)
			{
				var tag = arguments[1];
				tools.each( Array.prototype.slice.call(arguments,2),function(el,index){
					tools.clone(tag,el,true);
				})
				return tag;

			}else if(arguments.length === 1)
			{
				tools.clone(this,arguments[0],false);
				return this;

			}else
			{
				var tag = arguments[0];
				tools.each( Array.prototype.slice.call(arguments,1),function(el,index){
					tools.clone(tag,el,false);
				})
				return tag;
			}

		};

		/*静态方法*/
		desire.fn.extend({
			eq:function(){
				alert('a');
			},

			data:function(key,value){
				if(arguments.length == 2){
					tools.each(this,function(el,index){
						Catch.data(el,key,value);
					})
				}else if(arguments.length == 1){
					return 	Catch.data(this[0],key,value);
				}
			},

			
			/*  删除指定key 数据
			  	key为空 则删除该对象上的所有缓存数据 */
			removeData:function(key){
				if(key){
					tools.each(this,function(el,index){
						Catch.removeDate(el,key);
					})
				}else{
					tools.each(this,function(el,index){
						Catch.removeDate(el);
					})
				}
			},


			on:function(type,handle){

			}
		});

		return desire;
	})

	/*------------------------------------------------------------------------底层模块定义*/
	apple.define('navigator',[],function(){

		var clickFn,
			select = document.createElement("select"),
			opt = select.appendChild( document.createElement("option") );
			div = document.createElement('div');

		div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";
		div.test = 'ss';

		var support =  {
			leadingWhitespace:(div.firstChild.nodeType === 3),

			// IE678无法通过div.innerHTML = '<link />';来插入link
	        htmlSerialize: !!div.getElementsByTagName("link").length,

			// checkbox的默认值为'on'，chrome  23.0.1271.95 m测试
        	checkOn: ( div.getElementsByTagName('input')[0].value === "on" ),

        	// IE中，第一个option不被默认选中，包括IE9依然如此，其他则选中
        	optSelected: opt.selected,

        	// IE6在克隆HTML5的新标签元素时outerHTML有":"
        	html5Clone: document.createElement("nav").cloneNode( true ).outerHTML !== "<:nav></:nav>",

        	// 检测诡异模式，也就是IE6没有doctype时的模式
        	boxModel: ( document.compatMode === "CSS1Compat" ),

			isWin:(window.navigator.userAgent.indexOf("Win") != -1),
			isMac:(window.navigator.userAgent.indexOf("Mac") != -1),
			isUnix:(window.navigator.userAgent.indexOf("X11") != -1)
		}

		// IE678不能delete节点上的属性
	    try {
	        delete div.test;
	    } catch( e ) {
	        support.deleteExpando = false;
	    }

	    //IE会拷贝事件
    	if ( !div.addEventListener && div.attachEvent && div.fireEvent ) {
	        div.attachEvent( "onclick", clickFn = function() {
	            // Cloning a node shouldn't copy over any
	            // bound event handlers (IE does this)
	            support.CloneEvent = true;
	        });
	        div.cloneNode( true ).fireEvent("onclick");
	        div.detachEvent( "onclick", clickFn );
    	}

    	//防止ie内存泄漏
    	clickFn = select = opt = div = null;

	    return support;
	});

	apple.define('tools',['type'],function(type){
		return {

			/*遍历元素-------------数组，对象，类数组,字符串*/
			each:function(array,func){
				if(type.isArrayLike(array)){
					for(var i=0,len = array.length;i<len;i++){
						func.call(array[i],array[i],i);
					}
				}else if(type.isString(array)){
					var temp = function (){}
					for(var i = 0,len = array.length;i<len;i++){
						func.call(temp,array.charAt(i),i);
					}
				}else if(type.isObject(array)){
					var temp = function (){}
					for(var i in array){
						func.call(temp,array[i],i);
					}
				}else{
					throw new Error('each method no support the type');
				}

			},

			/*包含指定内容-------数组,类数组,字符串*/
			contains:function(data,target){
				if(type.isString(data)){
					return data.indexOf(target) > -1;
				}else if( type.isArrayLike(data) ){
					var b = false;
					this.each(data,function(el,index){
						if (el == target) b = true;
					})
					return b;
				}else{
					throw new Error('containes method no support the type');
				}

			},

			/*得到 对象 属性的个数*/
			getObjLength:function(obj){
				var len = 0;
				for(var i in obj){
					len++;
				}
				return len;
			},

			/*克隆*/
			clone:function(tag,src,deep){
				deep = deep === true || false;
				var self = this;

				if(!deep){
					this.each(src,function(el,index){
						tag[index] = el;
					})
				}else{
						/*深拷贝*/
						this.each(src,function(el,index){
							if( type.isArray(el)){
								tag[index] = [];
								self.clone(tag[index],el,deep);
							}else if(type.isObject(el)){
								tag[index] = {};
								self.clone(tag[index],el,deep);
							}else{
								tag[index] = el;
							}
						})
				}


			}
		}
	});

	apple.define('type',[],function(){
		return {
			isArray:function(arr){
				return Object.prototype.toString.call(arr) === '[object Array]'
			},
			isString:function(obj){
				return Object.prototype.toString.call(obj) === '[object String]'
			},
			isArrayLike : function(obj){
				return obj.hasOwnProperty('length');
			},
			isObject:function(obj){
				return typeof obj === 'object' ;
			}

		}

	});

	apple.define('event',['catch','tools'],function(Catch,tools){

		return {
			add:function(el,type,handle,name){
				var events ,  /*事件类型*/
					handles;  /*对应的综合处理函数*/
				try{
					events = Catch.data(el,'events') ;
					handles = Catch.data(el,'handles') ;
				}catch (e){
					Catch.data(el,'events',{}); 
					Catch.data(el,'handles',{}); 
					events = Catch.data(el,'events');
					handles = Catch.data(el,'handles');
				}

				events[type] ? events[type] : events[type] = [];

				name ? events[type][name] = handle : 
					events[type]['handle'+tools.getObjLength(events[type])];

				/*只执行1次，循环处理所有的函数*/
				if( !handles[type]){
					handles[type] = function(){
						for(var i in events[type]){
							events[type][i].apply(el,arguments);
						}
					}

					if(el.addEventListener){
						el.addEventListener(type,handles[type],false);
					}else if(el.attachEvent){
						el.attachEvent('on'+type,function(){
							handles[type].apply(el,arguments)
						});
					}else{
						el['on'+type] = handles[type];
					}

				}
				
			},
			remove:function(){

			}
		}
	});

	apple.define('catch',[],function(){

		return {
			data:function(el,key,value){
				if( value ){
					 var expando = el.getAttribute('expando') || 'expando '+ new Date().toString();
					 el.setAttribute('expando',expando);

					 catchs[expando] = catchs[expando] || {};
					 catchs[expando][key] = value;
				}else if( key && !value ){
					var expando = el.getAttribute('expando');
					if(!expando) throw new Error('the object no expando field , can not get data');
					if(!catchs[expando][key]) throw new Error('no field -- ' + key);

					return catchs[expando][key]

				}
			},
			removeDate:function(el,key){
				if( !key ){
					var expando = el.getAttribute('expando');
					if(!expando) return;
					el.removeAttribute('expando');
					delete catchs[expando];
				}else{
					var expando = el.getAttribute('expando');
					if(!expando) return;
					delete catchs[expando][key];
				}
			}
		}
	});

	apple.define('query',['tools'],function(tools){

		var regId = /^#\w+$/,
			regClass = /^\.\w+$/,
			regTag = /^\w+$/;

		var getByClass = function(selector,context){
			var selector = selector.substring(1),
				els = context.getElementsByTagName('*'),
				result = [];

			tools.each(els,function(el,index){
				var className = el.className.replace('\s+',' '),
					classList = className.split(' ');
				tools.contains(classList,selector) && result.push(el);
			})
			return result;
		}

		return{
			find:function(selector,context){
				var context = context ? 
					document.getElementById(context) :
					document,
					els = [];

				regId.test(selector) ?
					els.push(context.getElementById(selector.substring(1))) :
					regClass.test(selector) ?
						els = getByClass(selector,context) :
						regTag.test(selector) ?
							els = context.getElementsByTagName(selector) :
							( els = new Error('find method no support the selector'));

				if(els instanceof Error) throw Error;
				return els;
			}
		}
	});

	apple.define('dom',[],function(){

	})

	
})(window,undefined)