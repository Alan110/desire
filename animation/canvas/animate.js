
/**
 * 运动对象父类
 * @param {[type]} cfg [description]
 */
var Spirit = function(cfg){
	var defult_cfg = {
		img:new Image(),
		top:0,
		left:0,
		width:0, 
		height:0,
		speed:{ x:0, y:0 },
		opacity:1,
		scale:{ x:1, y:1 },
		list:[],//动画队列
		finish:false,
		draw:null//画自己的方法
	}; 
	
	//extend
	for(var i in defult_cfg){
		defult_cfg[i] = cfg[i] === undefined ? defult_cfg[i]: cfg[i];
	}
	
	//init img
	if(cfg['img']){
		var img  = new Image();
		img.src = cfg['img'];
		defult_cfg['img'] = img;
	}else{
		defult_cfg['img'] = null;
	}
	
	//init draw
	defult_cfg.draw = function(canvas,ctx){
		if(this.img){
			ctx.drawImage(this.img,this.size.width,this.size.height);
		}
		cfg.draw &&	cfg.draw.call(this,canvas,ctx);
	}	
	
	//extend
	for(var i in defult_cfg){
		this[i] = defult_cfg[i];
	}

};
Spirit.prototype = {
	constructor:Spirit,

	//开始位置，变化量，当前时间，执行时间	
	linear:function (start,alter,curTime,dur) {
		return start+curTime/dur*alter;
	},
	easeIn:function (start,alter,curTime,dur) {
		return start+Math.pow(curTime/dur,2)*alter;
	},
	easeOut:function (start,alter,curTime,dur) {
		var progress =curTime/dur;
		return start-(Math.pow(progress,2)-2*progress)*alter;
	},
	easeInOut:function (start,alter,curTime,dur) {
		var progress =curTime/dur*2;
		return (progress<1?Math.pow(progress,2):-((--progress)*(progress-2) - 1))*alter/2+start;
	},

	//添加一个动画过程
	transition:function(cfg,durtime,func){
		this.list.push({
			cfg:cfg,
			durtime:durtime,
			func:func
		});
		return this;
	},

	//开始动画
	fire:function(){
		var list = this.list,
		action = list.shift(),
		self = this,
			nowtime = 0;

		if(!action){
			this.finish = true;
			return;
		}

		if(!action.durtime){//如果没有执行时间，则没有过度效果
			action.fn.call(self);
		}else{
			this.timer = setInterval(function(){
				self._animate(action.cfg,nowtime,action.durtime,action.func);
				nowtime += 15;
			},15)
		}
	},

	//底层动画方法
	_animate:function(cfg,nowtime,durtime,func){
		var flag = true,
		value = '';
		if(typeof func === 'string'){//自带插值函数
			for(var i in cfg){
				value = this[func](this[i],cfg[i] - this[i],nowtime,durtime);	
				this[i] = value;

				if(cfg[i] == this[i]){//如果所有属性都到达目标则为true，此处判断有问题
					flag = true;
				}else{
					flag = false;
				}
			}

			if(flag == true || nowtime >= durtime){
				clearInterval(this.timer);
				this.fire();
			}

		}else if(typeof func === 'function'){//三方插值函数
			for(var i in cfg){
				if( Math.abs(cfg[i] - value) < 1 ){ value = cfg[i] }
				this[i] = value;

				if(cfg[i] == this[i]){
					flag = true;
				}else{
					flag = false;
				}
			}

			if(flag = true){
				clearInterval(this.timer);
				this.fire();
			}
		}else{//无过渡动画
			for(var i in cfg){
				this[i] = cfg[i]
			}
			clearInterval(this.timer);
			this.fire();
		}

	}

}


/**
 * 重绘渲染引擎
 * @return {[type]} [description]
 */
var Render = (function(window,undefined){

		var _setup = function(selector){
			var cfg = {
				objs : [],
				SECOND : 15,
				canvas : document.querySelector(selector),
				ctx : canvas.getContext("2d")
			};	

			for(var i in cfg){
				this[i] = cfg[i];
			}	
		};

		//初始化渲染渲染引擎
		var init = function(selector){
			_setup.call(this,selector)	;
		};

		var fn = init.prototype;

		//添加精灵对象
		fn.addSpirit = function(obj){
			this.objs.push(obj);
			return this;
		};

		//开始渲染
		fn.render = function(){
			var self = this;
			this.timer = window.setInterval(function(){
				self.ctx.clearRect(0,0,canvas.width,canvas.height);
				self.objs.forEach(function(el,index){
					el.draw(self.canvas,self.ctx);
				});

			},SECOND);
		};

		fn.stop = function(){
			window.clearInterval(self.timer);
		};


	return init;
})(window,undefined);
