//eventObj 绑定事件对象
//srollObj 滚动对象
//speed  滚动速度
//end    滚动结束位置
function wheelScroll(eventObj, srollObj, speed,end) {
	function func(event) {
		var event = event || window.event;
		if (isWheelDown(event)) {
			var top = (parseInt(getStyle(srollObj, 'top')) - speed);
			if (top < end) {
				top = end;
			}
			srollObj.style.top = top + "px";
		} else {
			var top = (parseInt(getStyle(srollObj, 'top')) + speed);
			if (top > 0) {
				top = 0;
			}
			srollObj.style.top = top + "px";
		}
		return false;
	}

	//ie chrome
	eventObj.onmousewheel = func;
	//FF
	addEvent(eventObj, 'DOMMouseScroll', func);
}
