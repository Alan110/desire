define(function(){
	/*默认配置
	 *配置参数以css像素为准,会统一根据比例转换为物理像素
	 * */
	var cfg = {
		xUnit:1,//逻辑单元宽度 ,动态计算
		yUnit:5000,//逻辑单元高度 ,动态计算
		xlen:5,//X轴点个数
		ylen:3,//Y轴点个数
		unitHeight:38,//css单元高度,写死
		unitWidth:50,//css单元宽度,动态计算
		startX:0,//X轴0点到原点的偏移量
		tableXstr:'',//x轴表头字符串

		beforeDraw:null,//画之前执行回调,this.ctx 获取ctx对象,this.canvas,获取canvas对象
		afterDraw:null,//画完之后执行回调,this.ctx 获取ctx对象,this.canvas,获取canvas对象

		lines:[],//折线

		//相对于正常坐标系
		offsetX:47,//X轴偏移量
		offsetY:23,//Y轴偏移量

		tScale: window.devicePixelRatio,//物理像素与css的比例
		offsetKeduX:10,//左侧刻度与Y轴的偏移量
		offsetKeduY:15,//下侧刻度与X轴的偏移量

		lineWidth:1,//线条默认宽度
		keduHeight:2,//刻度高度
		fontSize:14,//刻度字体大小
		pointR : 3,//线条上点的半径
	};

	/*
	 * 平移坐标系后,坐标是相对于平移之后的坐标系,可能坐标不在画布中了,需要一个变换函数,来生成新的物理坐标,所有的坐标,和坐标轴变换都要通过变换函数处理
	 * */
	function _translateY(x){
		return 	(-1) * (x + 1);
	}

	var _setup = function(config){
		var _config = cfg;
		for(var key in config){
			_config[key] = config[key] === "undefined" ?  _config[key] : config[key];
		}
		
		return _config;
	};

/*****************************************************************私有方法,依赖对象*/

	/*根据物理像素与css像素比例缩放*/
	function _scale(value){
		return value * this.cfg.tScale;	
	}

	/*计算根据逻辑坐标,css坐标计算物理坐标*/
	function _getPosition(item){
		var cfg = this.cfg;
		var x = item.x * cfg.unitWidth + cfg.startX;
		var y = _translateY(item.y * cfg.unitHeight / cfg.yUnit) ;
		return {
			x:x,
			y:y
		};
	}

	/*计算逻辑坐标单位x,y*/
	function _countUnitxy(points){
		var cfg = this.cfg;

		var max = points.reduce(function(max,item){
			max.y =  item.y > max.y ? item.y : max.y;	
			max.x =  item.x > max.x ? item.x : max.x;	
			return max;
		},{x:0,y:0});


		var avgx = max.x / cfg.xlen,
			avgy = max.y / cfg.ylen;

		var mix = Math.pow( 10 , parseInt( avgx ).toString().length - 1 ),
			miy = Math.pow( 10 , parseInt( avgy ).toString().length - 1 );

		return {
			x: Math.ceil( avgx / mix ) * mix,
			y: Math.ceil( avgy / miy ) * miy
		};
	}

	function _canvasSetup(){
		var canvas = this.canvas,
			canvasWraper = this.canvasWraper,
			ctx = this.ctx,
			temp = _scale.bind(this);
			cfg = this.cfg,
			self = this,
			_scale = temp;

		this.canvas.width = _scale(canvasWraper.offsetWidth);
		this.canvas.height = _scale(canvasWraper.offsetHeight);
		this.canvas.style.cssText = "width:100%;height:100%;";

		["offsetKeduY","keduHeight","offsetX","offsetY","pointR","unitHeight","startX","fontSize","offsetKeduX"].forEach(function(el,index){
			self.cfg[el] = _scale(cfg[el]);
		});
		this.cfg.unitWidth = ( canvas.width - 2 * cfg.startX ) / cfg.xlen;
		
		var points = cfg.lines.reduce(function(sum,el){
			return sum.concat(el.points);
		},[]);

		var unit  = _countUnitxy.call(this,points);
		this.cfg.xUnit = unit.x;
		this.cfg.yUnit = unit.y;

		/*平移到常规坐标系*/
		ctx.translate(cfg.offsetX,canvas.height + _translateY(cfg.offsetY));		

		/*默认画笔样式*/
		ctx.textAlign = "end";
		ctx.textBaseline = "middle";
		ctx.font = cfg.fontSize + "px" + " Arial, Helvetica, sans-serif lighter";
		ctx.lineWidth = _scale(cfg.lineWidth);

	} 

	function _drawTable(){
		/*画表格线*/
		var ctx = this.ctx,
			canvas = this.canvas;

		ctx.strokeStyle = "#f1f1f1";
		ctx.fillStyle = "#666666";
		for(var i = 0;i < cfg.ylen + 1;i++){
			ctx.beginPath();
			var y = _translateY( i * cfg.unitHeight);
			ctx.moveTo(0,y);
			ctx.lineTo(canvas.width,y);

			if(i !== 0){
				ctx.fillText(i * cfg.yUnit,(-1) * cfg.offsetKeduX,y);
			}
			ctx.closePath();
			ctx.stroke();
		}

		/*画表头*/
		if(cfg.tableXstr !== ''){
			ctx.beginPath();
			ctx.moveTo(0,0);
			ctx.fillText(cfg.tableXstr,13,cfg.offsetKeduY);
			ctx.stroke();
		}

		/*画刻度*/
		ctx.textAlign = "center";
		for(var i = 0;i<cfg.xlen;i++){
			ctx.beginPath();
			var x = i * cfg.unitWidth + cfg.startX; 
			ctx.moveTo(x,_translateY(cfg.keduHeight + 2));
			ctx.lineTo(x,cfg.keduHeight);	

			ctx.moveTo(x,0);
			ctx.fillText(i * cfg.xUnit,x,cfg.offsetKeduY);
			ctx.stroke();
		}
	}


	/*构造函数*/
	var init = function(objstr,option){
		this.canvasWraper = document.querySelector(objstr);
		this.canvas = document.createElement("canvas");
		this.ctx = this.canvas.getContext("2d");

		var user_cfg = _setup(option),
			self = this;

		this.cfg = user_cfg;

		_canvasSetup.call(this);
		_drawTable.call(this);


		typeof this.cfg.beforeDraw === "function" && this.cfg.beforeDraw.call(this);

		//drawLine
		this.cfg.lines.forEach(function(el,index){
			el.beforeDraw.call(null,self.ctx);
			self.drawLine(el.points);
		});


		this.canvasWraper.appendChild(this.canvas);

		typeof this.cfg.afterDraw === "function" && this.cfg.afterDraw.call(this);

	};

	/*公共方法*/
	var fn = init.prototype;
	fn.drawLine = function(points){
		var ctx = this.ctx,
			self = this;

		ctx.beginPath();
		points.forEach(function(el,index){
			var pos = _getPosition.call(self,el);
			ctx.lineTo(pos.x,pos.y);	
		});
		ctx.stroke();

		points.forEach(function(el,index){
			ctx.beginPath();
			var pos = _getPosition.call(self,el);
			ctx.arc(pos.x, pos.y, cfg.pointR, 0, Math.PI*2, true); 
			ctx.closePath();
			ctx.fill();
		});

	};

	return init;

});


