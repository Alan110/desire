;(function(){

	var _init = function(){
		var audio = this.audio = document.createElement('audio');
		for( var prop in this.audioProp ){
			audio[prop]  = this.audioProp[prop];
		}
		document.body.appendChild(audio);
	};

	var _bindEvt = function(){
		var audio  = this.audio,
			audioEvt = this.audioEvt;
		for( var func in audioEvt ){
			audio.addEventListener(func,audioEvt[func].bind(this),false);
		}
	};

	var _extend = function(o1,o2){
		for(var attr in o2)	{
			o1[attr] = o2[attr];
		}
		return o1;
	};

	function constructor(opton){
		var opton =	_extend({
						audioProp : {

						},
						audioEvt : {
						
						},
						cssSelector : {
							
						}
		
					},opton);

		_extend(this,opton);
		_init.call(this);
		_bindEvt.call(this);
	}

	_extend(constructor.prototype,{
		play : function(second){
			second && (this.audio.currentTime = second);
			this.audio.play();		
		},

		pause : function(second){
			second && (this.audio.currentTime = second);
			this.audio.pause();	
		},

		timeFormat : function timeFormat(number) {
			var minute = parseInt(number / 60);
			var second = parseInt(number % 60);
			minute = minute >= 10 ? minute : "0" + minute;
			second = second >= 10 ? second : "0" + second;
			return minute + ":" + second;
		}
	
	});


	//兼容amd,cmd,原生js接口
	if(module && module.exports){
		module.exports = constructor;	
	}else if(typeof define === 'function'){
		define(function(){
			return constructor;	
		});
	}else{
		window.APlayer = constructor;	
	}

})();
