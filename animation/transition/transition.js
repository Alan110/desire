
/*
 * 目前只支持2d变换
 *
 * 连续变换，可能不生效，需要设置初始状态
 */
(function(window,undefined){
	
	//对外包装接口
	var transition = function(selector){
		return new init(selector);
	};
	window.t = transition;

	//包装对象
	var init = transition.prototype.init = function(selector){
		this.objs = Array.prototype.slice.call(document.querySelectorAll(selector));
		this.queue = [];
		this.cssStr = [];
		this.transform = ['','','',''];//4参数字符串
		this.duringtime = '';
	};
	init.prototype = {
		constructor:init,
		translate:function(x,y,z){
			var str = 'translate3d('+ x +','+ y + ',' + z +')';
			this.transform[0] = str;
			return this;
		},
		
		//2d顺时针旋转
		rotate : function(angle){
			var str = 'rotate('+ angle +')'	;
			this.transform[1] = str;
			return this;
		},

		//3d缩放
		scale :  function(sx,sy,sz){
			var str = 'scale3d(' + sx + ',' + sy + ',' + sz +')';
			this.transform[2] = str;
			return this;
		},

		//2d拉伸
		skew:function(x,y){
			var str = 'skew(' + x + ',' + y +')';
			this.transform[3] = str;
			return this;
			
		},

		//设置普通属性
		set:function(attr){
			var sum = '';
			for(var i in attr){
				sum += i + ':' + attr[i] +";";	
			}
			this.cssStr.push(sum);	
			return this;
		
		},
		
		//下一个过程
		then:function(waitting){
			if(this.duringtime === '') return;
			this.cssStr.push('transform:'+ this.transform.join(' ') +';');
			this.queue.push({
				cssText:'transition-duration:' + this.duringtime + 'ms;' + this.cssStr.join(';'),
				waitting: waitting || 0,
				during:this.duringtime
			});

			console.log(this.cssStr.join(';'));
			this.cssStr = [];
			this.duringtime = '';
			return this;

		},
		clear:function(){},

		//设定当前过程的持续时间
		during:function(duringtime){
			this.duringtime = duringtime;
			return this;
		},

		//开始动画
		fire:function(){
			this.then();
			var action = this.queue.shift(),
				self = this;
			if(!action) return;

			this.objs.forEach(function(el,index){
				el.style.cssText += action.cssText;

			});
			setTimeout(function(){
				self.fire();
			},action.during + action.waitting);
		},
		t:function(selector){
			this.objs = Array.prototype.slice.call(document.querySelectorAll(selector));
			return this;
		}
	};

})(window,undefined);
