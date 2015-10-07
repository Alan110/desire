	var slider = (function(window,undefined){
			return {
				init:function(config){
					this.setup(config);
					this.bindTimer();
				},
				setup:function(config){
					var _config = {
						self : null,
						timer : null,
						during: 400,
						len : 5,
						realIndex:0,
						scrollElements:''
					};
					for(var key in config){
						_config[key] = config[key] === "undefined" ?  _config[key] : config[key];
					}
					
					for(var key in _config){
						this[key] = _config[key];
					}

					this.index = this.len - 1;
					this.lis = Array.prototype.slice.call(document.querySelectorAll(this.scrollElements));
					this.next();
				},
				changeQueen:function(){
					this.realIndex = this.countRealIndex();
					if(this.realIndex === 0){
						var last = this.lis.pop();
						this.lis.unshift(last);
						this.index++;
						this.realIndex++;
					}
					if(this.realIndex == this.len - 1 ){
						var first = this.lis.shift();
						this.lis.push(first);
						this.index--;
						this.realIndex --;
					}
				},
				prev:function(){
					this.index--;	 
					this.changeQueen();
					this.changePosition();
				},
				next:function(){
					this.index++;
					this.changeQueen();
					this.changePosition();
				},
					
				changePosition:function(){
					var  self = this;
					Array.prototype.slice.call(this.lis).forEach(function(el,index){
						if(index == self.realIndex){
							el.style.cssText = 'z-index:10;transition-timing-function:cubic-bezier(0.1, 0.57, 0.1, 1);transition-duration:402ms; transform: translate(0, 0px) translateZ(0px);';
						}else if (index<self.realIndex){
							el.style.cssText = 'z-index:1;transition-timing-function:cubic-bezier(0.1, 0.57, 0.1, 1);transition-duration:402ms; transform: translate(-100%, 0px) translateZ(0px);';
						}else{
							el.style.cssText = 'z-index:1;transition-timing-function:cubic-bezier(0.1, 0.57, 0.1, 1);transition-duration:402ms;  transform: translate(100%, 0px) translateZ(0px);';
						}	
					});
				},
				timerHandle:function(){
					this.next();
				},
				bindTimer:function(){
					this.timer = setInterval(this.timerHandle.bind(this),this.during);
				},
				countRealIndex:function(){
					return  this.index % this.len;
				},
				changeDot:function(){
					var lis = document.querySelectorAll(".wa-tujie-dots li");
					Array.prototype.slice.call(lis).forEach(function(el,index){
						el.classList.remove("wa-tujie-dots-focus");	
					});
					lis[this.realIndex].classList.add("wa-tujie-dots-focus");
				}
			};
	})(window,undefined);

	slider.init({self:this,during:2000,len:5,scrollElements:'.wa-tujie-scrollor>ul>li'});
