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
	apple.define('desire',['query','tools','catch','event'],function(query,tools,Catch,Event){
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

			
			/*  删除指定key 缓存数据
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
				tools.each(this,function(el,index){
					Event.add(el,type,handle);
				})

				return this;
			},


			off:function(type,handleName){
				tools.each(this,function(el,index){
					Event.remove(el,type,handleName);
				})
			},

			trigger:function(type){
				tools.each(this,function(el,index){
					var evt = Event.createEvent('HTMLEvents',{
								bubbles:true,
								type:type,
								cancelable:true
								});

					if(this.dispatchEvent){
						this.dispatchEvent(evt);
					}else if(this.fireEvent){
						this.fireEvent(type,evt);
					}
				})
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
			},

			/*类数组转换成数组*/
			toArray:function(obj){
				return Array.prototype.slice.call(obj);
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
					events[type]['handle'+tools.getObjLength(events[type])] = handle;

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
			remove:function(el,type,handleName){
				try{
					var events = Catch.data(el,'events'),
					handles = Catch.data(el,'handles');
				}catch(e){
					console.log(e);
				}

				if(handleName){
					delete events[type][handleName]; return;	
				}

				el.removeEventListener ?
					el.removeEventListener(type,handles[type],false) :
				 	el.detachEvent ?
						el.detachEvent('on'+type,handles[type]) :
						el['on'+type] = null;

				/*删除数据缓存*/
				delete events[type];

			},

			/*evtType:dom标准事件类型
				UIEvents：通用的UI 事件，鼠标事件键盘事件都是继承自UI事件，在DOM 3 级上使用的是 UIEvent。 
			　　MouseEvents：通用的鼠标事件，在DOM 3 级上使用的是 MouseEvent。 
			　　MutationEvents：通用的突变事件，在DOM 3 级上使用的是 MutationEvent。 
			　　HTMLEvents：通用的HTML事件，在DOM3级上还没有等效的
			  evtCfg:event参数
			  	type,bubbles,cancelable 必填
			*/
			createEvent:function(evtType,evtCfg){
				evtCfg = evtCfg || {};
				var evt;

				if(document.createEvent){
					evt = document.createEvent(evtType);
					evt.initEvent(evtCfg.type,evtCfg.bubbles,evtCfg.cancelable);
/*?---event属性兼容*/
					if(evtCfg['data']) evt['data'] = evtCfg['data'];

				}else if(document.createEventObject){
					evt = document.createEventObject();

					if(evtCfg['data']) evt['data'] = data;
				}

				if(!evtCfg['type'] || !evtCfg['bubbles']  || !evtCfg['cancelable']){
					throw new Error('event must have type,bubbles,cancelable field');
				}else{
					evt['type'] = evtCfg['type'];
					evt['bubbles'] = evtCfg['bubbles'];
					evt['cancelable'] = evtCfg['cancelable'];
				}

				return evt;
			}
		}
	});

	apple.define('catch',['navigator'],function(navigator){

		return {
			data:function(el,key,value){
				if( value ){
					 var expando = el['expando'] || 'expando '+ new Date().toString();
					 el['expando'] = expando;

					 catchs[expando] = catchs[expando] || {};
					 catchs[expando][key] = value;
				}else if( key && !value ){
					var expando = el['expando'] ;
					if(!expando) throw new Error('the object no expando field , can not get data');
					if(!catchs[expando][key]) throw new Error('no field -- ' + key);

					return catchs[expando][key]

				}
			},
			removeDate:function(el,key){
				if( !key ){
					var expando = el['expando'] ;
					if(!expando) return;

					delete el['expando'] ;

					/*ie 678 无法删除dom上的属性*/
					!navigator.deleteExpando && el.removeAttribute('expando');
					
					delete catchs[expando];
				}else{
					var expando = el['expando'] ;
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

	});

	apple.define('Deferred',[],function(){
		var Queue = function(){
			this.list = [];
		}

		Queue.prototype = {
			constructor:Queue,
			then:function(fn){
				this.list.push(fn);
				return this;
			},
			wait:function(ms){
				this.list.push(ms);
				return this;
			},
			fire:function(){
				var self = this,list = self.list;
				var el = list.shift() || function(){};
				if(typeof el == 'number'){
					setTimeout(function(){
						self.fire();
					},el)
				}else if(typeof el == 'function'){
					el.call(this);
					if(list.length){
						self.fire();/*递归调用执行方法*/
					}
				}
			}
		}



		return Queue;

	})

	
})(window,undefined)