define(function(){

	var _init = function(){
		var audio = this.audio = document.createElement('audio');
		audio.src = this.src;
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
						src : '',
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
		play : function(){
			this.audio.play();		
		},

		pause : function(){
			this.audio.pause();	
		}
	
	});

	return constructor;

});


