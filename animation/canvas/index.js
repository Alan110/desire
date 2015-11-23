var canvas = document.querySelector('#myCanvas'),
	ctx = canvas.getContext('2d');

var sp1 = new Spirit({
	width:30,
	height:30,
	opacity:0,
	draw:function(canvas,ctx){
		ctx.fillStyle = "rgba(255,255,0,"+this.opacity +")";
		ctx.fillRect(this.left,this.top,this.width,this.height);
	}
	//img:'img/loading.png'
})

sp1.transition({
	top:100,
	left:300,
	opacity:1,
	width:100,
	height:100

},5000,'easeInOut')
.transition({
	top:200,
	left:200
},2000,'easeOut').fire();

Render.addSpirit(sp1);
Render.init(canvas,ctx).render();
ctx.translate(50,50);
