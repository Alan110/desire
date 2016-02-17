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

	/*
	 *   构造函数
	 */
	function Constructor(opton){
		opton =	_extend({
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

	_extend(Constructor.prototype,{
		/*
		 *   播放
		 *	 second 指定当前的播放时间 
		 */
		play : function(second){
			second && (this.audio.currentTime = second);
			this.audio.play();		
		},

		/*
		 *   暂停
		 *   second 指定当前的播放时间
		 */
		pause : function(second){
			second && (this.audio.currentTime = second);
			this.audio.pause();	
		},


		/*
		 *   时间格式化
		 *	 00:00
		 */
		timeFormat : function timeFormat(number) {
			var minute = parseInt(number / 60);
			var second = parseInt(number % 60);
			minute = minute >= 10 ? minute : "0" + minute;
			second = second >= 10 ? second : "0" + second;
			return minute + ":" + second;
		}
	
	});


	//兼容amd,cmd,原生js接口
	if(typeof module !== 'undefined' && typeof exports === 'object' && define.cmd){
		module.exports = Constructor;	
	}else if(typeof define === 'function' && define.amd){
		define(function(){
			return Constructor;	
		});
	}else{
		window.APlayer = Constructor;	
	}

})();
