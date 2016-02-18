;(function(){

	var _extend = function(o1,o2){
		for(var attr in o2)	{
			o1[attr] = o2[attr];
		}
		return o1;
	};

	var _analysis = function(){
		switch (this.lrcType ){
			case "LRC" :  _analysisLrc.call(this);break;
		}
	};

	var _analysisLrc = function(){

		var lrcObj = {},
			lrcArray = this.lrcStr.split("\\n");

		for(var i=0;i<lrcArray.length;i++){
			var lyric = decodeURIComponent(lrcArray[i]);
			var timeReg = /\[\d*:\d*((\.|\:)\d*)*\]/g;
			var timeRegExpArr = lyric.match(timeReg);
			if(!timeRegExpArr)continue;

			//保存标准歌词数组
			var clause = lyric.replace(timeReg,'');
			this.lrcArray.push(clause);

			for(var k = 0,h = timeRegExpArr.length;k < h;k++) {
				var t = timeRegExpArr[k];
				var min = Number(String(t.match(/\[\d*/i)).slice(1)),
					sec = Number(String(t.match(/\:\d*/i)).slice(1));
				var time = min * 60 + sec;

				//保存解析后的歌词信息对象
				lrcObj[time] = {
					txt : clause,
					index : this.lrcArray.length - 1 
				}
			}
		}
		this.lrc = lrcObj;
	};

	/*
	 * 构造函数
	 * lrcStr - 原始歌词字符串
	 * */
	function Constructor (lrcStr,type){
		this.lrcStr = lrcStr;	
		this.lrcType = type;
		this.lrcArray = [];
		_analysis.call(this);
	}

	_extend(Constructor.prototype,{
		findLrc : function(second){
			//找到比当前时间小,且离得最近的时间
			//因为歌词都是在时间之后的
			var min = 1000;
			for( var i in this.lrc){
				if ( i < second &&   Math.abs(second - i) < Math.abs(second - min) ){
					min = i;
				}
			}
			return this.lrc[min]["index"];
		},

		getLrc : function(index){
			return this.lrcArray[index];
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
		window.LrcS = Constructor;	
	}

})();
