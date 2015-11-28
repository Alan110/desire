
/*
 * 目前只支持2d变换
 *
 * 连续变换，可能不生效，需要设置初始状态
 */
var t = (function(window,undefined){
	
	//对外包装接口
	var transition = function(selector){
		return new init(selector);
	};

	//包装对象
	var init = transition.prototype.init = function(selector){
		this.objs = [];
		this.activeObj = '';
		this.queue = [];
		this.duration = '';
		this.ease = '';

		this.regist(selector);
	};
	init.prototype = {
		constructor:init,
		regist:function(selector){
			this.objs[selector] = {
				obj:document.querySelector(selector),
				cssStr : [],
				attr : null,
				transform : ['','','','']//4参数字符串
			};
			this.activeObj = selector;
		},
		translate:function(x,y,z){
			var str = 'translate3d('+ x +'px,'+ y + 'px,' + z +'px)';
			this.objs[this.activeObj].transform[0] = str;
			return this;
		},
		
		//设置属性,动画执行时间,贝塞尔曲线,自动加上px
		set:function(attr,duration,ease){

			var obj = this.objs[this.activeObj];
				obj.attr = attr;
			//清空属性
			obj.cssStr = [];
			
			var sum = '';
			for(var i in attr){
				if( i === 'translate'){
					obj.transform[0] = 'translate3d('+ attr[i][0] +'px,'+ attr[i][1] + 'px,' + attr[i][2] +'px)';
				}else if( i === 'rotate'){
					obj.transform[1] = 'rotate('+ attr[i][0] +')'	;
				}else if( i === 'scale'){
					obj.transform[2] = 'scale3d(' + attr[i][0]+ ',' + attr[i][1] + ',' + attr[i][2] +')';
				}else if( i === 'skew'){
					obj.transform[3] = 'skew(' + attr[i][0] + ',' + attr[i][1] +')';
				}else{
					var temp = ( i === 'opacity' || i.indexOf('color') > -1  || ('' + attr[i]).indexOf('%') > -1 ) ? attr[i] : attr[i] + 'px';
					sum += i + ':' + temp +";";	
				}
			}

			obj.cssStr.push(sum);	
			this.duration = duration || '';
			this.ease = ease || '';
			return this;
		},

		//保留前面设置的所有属性
		//同时,transform属性,会在前面的值下增量改变,translate之外的属性可能会有点问题
		add:function(attr,duration,ease){

			var obj = this.objs[this.activeObj];
			var sum = '';
			for(var i in attr){
				if( i === 'translate'){
					obj.transform[0] = 'translate3d('+ (attr[i][0] + obj.attr[i][0]) +'px,'+ (attr[i][1] + obj.attr[i][1])+ 'px,' + (attr[i][2] + obj.attr[i][1])+'px)';
				}else if( i === 'rotate'){
					obj.transform[1] = 'rotate('+ (attr[i][0] + obj.attr[i][0]) +')'	;
				}else if( i === 'scale'){
					obj.transform[2] = 'scale3d(' + (attr[i][0]+ obj.attr[i][0] ) + ',' + (attr[i][1] + obj.attr[i][1]) + ',' + (attr[i][2] + obj.attr[i][2]) +')';
				}else if( i === 'skew'){
					obj.transform[3] = 'skew(' + (attr[i][0] + ',' + attr[i][0]) +')';
				}else{
					var temp = ( i === 'opacity' || i.indexOf('color') > -1  || ('' + attr[i]).indexOf('%') > -1 ) ? attr[i] : attr[i] + 'px';
					sum += i + ':' + temp +";";	
				}
			}

			obj.cssStr.push(sum);	
			this.duration = duration || '';
			this.ease = ease || '';
			return this;
		},

		//整理前面设定的各属性,生成action,
		//可设置切换当前活动对象,和延迟时间
		then:function(otherObj,waitting){
			if(this.duration === '') return;

			var waitting = ( arguments[1] && typeof arguments[1] == "number") ? arguments[1] : 0,
				activeObj = this.activeObj,
				obj = this.objs[activeObj],
				transform = obj.transform,
				cssText = 'transition-duration:' + this.duration + 'ms;';

			cssText =  this.ease !== '' ? cssText + 'transition-timing-function:' + this.ease + ';' : cssText;
			transform.length > 1 && obj.cssStr.push('transform:'+ transform.join(' ') +';');
			cssText += obj.cssStr.join(' ');

			//生成action放入队列
			this.queue.push({
				cssText: cssText,
				waitting: waitting,
				obj: obj.obj,
				during:this.duration
			});

			if(arguments[0] && typeof arguments[0] == "string"){
				activeObj = arguments[0];
				this.regist(activeObj);
			}
			this.duration = '';
			return this;

		},
		
		clear:function(){},


		//执行方法
		do:function(fn,during){
			this.queue.push(fn);
		},

		//如果fn存在,则插入一个函数action
		//取出一个action,是fn就执行,是object就插入css3动画
		end:function(fn){
			this.then();
			typeof fn === "function" && this.do(fn);

			var action = this.queue.shift(),
				self = this;
			if(!action) return;
			if(typeof action === "function"){
				action.call(this);
			}else if(typeof action === "object"){
				action.obj.style.cssText += action.cssText;
				setTimeout(function(){
					self.end();
				},action.during + action.waitting);
			}

		}
	};

	return transition;

})(window,undefined);
