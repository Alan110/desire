var toggle = (function(window,undefined){

		/* 初始化配置参数 */
		var _setup = function(target,fns){
				this.target = arguments.length === 2 ? arguments[0] : null;
				this.fns = arguments.length === 2 ? fns : arguments[0];
				this.index = 0;
			};

		/* 构造函数*/
		var init = function(target,fns){
			_setup.apply(this,arguments);
			if(this.target){
				document.querySelector(this.target).addEventListener("click",this.trigger.bind(this),false);
				
			}
		};

		var fn = init.prototype;
		fn.trigger = function(){
			this.fns[++this.index % this.fns.length].call();
		};
		return init;
})(window,undefined);
