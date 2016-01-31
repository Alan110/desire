# 折线图组件
>lijialong01@baidu.com

>注:可能不一定能覆盖到你的case,此组件只提供画简单折线图,欢迎反馈问题或者需求,我会及时修改



## 使用方式

* 使用AMD引入模块

```
require(['uiamd/chart/zxt'],function(zxt){
	var z1 = new zxt(selector,option);
});

```

## 接口参数(`所有参数以css像素为准`)

* `selector`  


	```
	canvas容器div的选择器`(手白下有canvas标签元素会画2次bug,故动态插入)`  
	容器需要设置宽度,高度.如:width:100%;height:150px;
	```

* `option`   
	```
	xlen        : default:5,             // X轴点个数
	ylen        : default:3,             // Y轴点个数
	unitHeight  : default:38,            // css单元高度
	startX      : default:0,             // X轴0点到原点的偏移量
	tableXstr   : default:'',            // x轴表头字符串
	beforeDraw  : default:null,          // 画之前执行回调,this.ctx 获取ctx对象,this.canvas,获取canvas对象
	afterDraw   : default:null,          // 画完之后执行回调,this.ctx 获取ctx对象,this.canvas,获取canvas对象
	lines        : `必选`,               // 折线
		[
			{
				beforeDraw:  defalut:null, //画线之前回调
				points:[
					{
						x:3999,//点的x坐标
						y:2    //点得y坐标
					}
				]
			}
		]

	offsetX     : default:47,            // X轴偏移量                /  / 相对于正常坐标系
	offsetY     : default:23,            // Y轴偏移量
	offsetKeduX : default:10,            // 左侧刻度与Y轴的偏移量
	offsetKeduY : default:15,            // 下侧刻度与X轴的偏移量
	lineWidth   : default:1,             // 线条默认宽度
	keduHeight  : default:2,             // 刻度高度
	fontSize    : default:14,            // 刻度字体大小
	pointR      : default:3,             // 线条上点的半径
		
	```


## 接口API

*  `ctx`
	
	```
	返回context2d句柄
	```


* `canvas`

	```
	返回canvas,dom元素
	```
* `drawLine(points)`

	```
	//画一条线
	points:[
		{
			x:123,
			y:231	
		}
	]
	```


## 示例  

![](img/chart/chart-line1.png)
<textarea style="width:100%;height:150px;">
<pre>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="content-type" content="text/html; charset=utf-8">
<title></title>
<style>
	.wa-jiaoyu-canvas{
		width:100%;
		height: 150px;
	}
</style>
</head>
<body>
	<div class="wa-jiaoyu-canvas"></div>
	<script src="http://ws.baidu.com/content/wiki/grid/gridwiki/js/esl.js"></script>
	<script>
	require.config({
		paths:{
			'uiamd':'http://m.baidu.com/static/ala/uiamd/'
		}	
	
	});	
	</script>
	<script>
		require(['uiamd/chart/zxt'],function(zxt){
			var z1 = new zxt(".wa-jiaoyu-canvas",{
				xlen:5,
				ylen:3,
				unitHeight:38,
				startX:30,
				beforeDraw:function(){
					console.log("开始绘制");
				},
				afterDraw:function(){
					console.log("结束绘制");
				},
				tableXstr:"经验(年)",
				lines:[
					{
						beforeDraw:function(ctx){
							ctx.strokeStyle = "#ff6600";
							ctx.fillStyle = "#ff6600"; 
						},
						points:	[ { x:0, y:3999 }, { x:1, y:4782 }, { x:2, y:7000 }, { x:3, y:8888 }, { x:4, y:13239 }, { x:5, y:15000 } ]
					},
					{ 
						beforeDraw:function(ctx){
							ctx.strokeStyle = "#1f91ff";
							ctx.fillStyle = "#1f91ff"; 
						},
						points:[ { x:0, y:2999 }, { x:1, y:3782 }, { x:2, y:6000 }, { x:3, y:7888 }, { x:4, y:10239 }, { x:5, y:14000 } ]
					}	
				]
				
			});
		});
	
	
	</script>
</body>
</html>
</pre>
</textarea>

