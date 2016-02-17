# APlayer
html5原生的audio其实已经非常强大和完善了,所以这个库尽可能的简洁,靠近原生api来操作audio

* 本库支持amd,cmd和原生全局js,直接引入就行了

## quick start

```javascript
	require(["APlayer"],function(APlayer){
		var music = new APlayer({
			audioProp : {
				title : '光辉岁月',
				loop : true,
				src : "https://ss1.baidu.com/8aQDcnSm2Q5IlBGlnYG/stat/ogg/xinsui.mp3",
			},
			audioEvt : {
				canplay : function(){
				},
				timeupdate : function(){
					$('.currentTime').html(this.timeFormat(this.audio.currentTime));  
				}
			}

		});

		$(".play").on("touchend",function(){
			music.play();	
		});

		$(".pause").on("touchend",function(){
			music.pause(5);	
		});
	});

```

## API

* var player = new APlayer(option);
>初始化一个音频对象

* option.audioProp 
>配置对象,支持所有原生audio的属性

* option.audioEvt
>配置对象,支持所有原生audio的事件,事件回调中的this指向APlayer对象.

____
* player.audio
>访问audio对象

* player.play(second)
>开始播放,可以指定当前的播放时间,单位秒

* player.pause(second)
>暂停播放,可以指定当前的播放时间,单位秒

* player.timeFormat(time);
>时间格式化为00:00的格式


