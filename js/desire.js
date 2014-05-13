/**j
 * Created by Alane on 2014/4/9.
 */

//对外接口
function $(vArg) {
	return new desire(vArg);
}

//*******************************************************
//辅助函数

//wheelDelta--ie chrome，detail-FF
//判断滑轮是否向下
$.isWheelDown = function(event) {
	return event.wheelDelta ? event.wheelDelta < 0 : event.detail > 0;
}

$.isArray = function(obj) {
	return Object.prototype.toString.call(obj) === '[object Array]';
}

$.getCookie = function(c_name) {
	if (document.cookie.length > 0) {
		c_start = document.cookie.indexOf(c_name + "=");
		if (c_start != -1) {
			c_start = c_start + c_name.length + 1;
			c_end = document.cookie.indexOf(";", c_start);
			if (c_end == -1)
				c_end = document.cookie.length;
			return unescape(document.cookie.substring(c_start, c_end));
		}
	}
	return "";
}

$.setCookie = function(c_name, value, expiredays) {
	var exdate = new Date();
	exdate.setDate(exdate.getDate() + expiredays);
	document.cookie = c_name + "=" + escape(value) + ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString()) + ";path=/";
}

$.getByClassName = function(obj, className) {
	var eles = [];
	var temps = obj.getElementsByTagName('*');
	for (var i = 0; i < temps.length; i++) {
		var obj1 = temps[i];
		var names = obj1.className.split(' ');
		for (var j = 0; j < names.length; j++) {
			if (names[j] == className) {//包括该class名的元素
				eles.push(obj1);
			}
		}

	}
	return eles;
}

$.addEvent = function(obj, type, handle) {
	if (obj.addEventListener) {
		obj.addEventListener(type, function() {
			if (false == handle.apply(obj, arguments)) {//由于使用了闭包，一定要传入所有的参数避免无法获取event对象
				event.stopPropagation()//取消事件冒泡
				event.preventDefault();
				//标准 移除默认操作
			}
		}, false);
	} else if (obj.attachEvent) {
		obj.attachEvent('on' + type, function() {
			if (false == handle.apply(obj, arguments)) {
				window.event.cancelable = true;
				return false;
				// ie下移除默认操作
			}
		});
	} else {
		obj['on' + type] = handle;
	}
}

$.getStyle = function(obj, arr) {
	if (obj.currentStyle) {
		return obj.currentStyle[arr];
	} else {
		return getComputedStyle(obj, false)[arr];
	}
}

//必须用在obj.style.attr 之后，否则obj.style.attr设置的属性无效
$.setCssText = function(obj,css){
	obj.style.cssText += ";"+css
}

$.addClass = function(obj, className) {
	obj.className += ' ' + className;
}

$.removeClass = function(obj, className) {
	obj.className = obj.className.replace(' ' + className, '');
}
//序列化json为查询字符串
$._serialize = function(obj) {
	var a = [];
	for (var k in obj) {
		var val = obj[k];
		if (val.constructor == {}) {//如果是对象，序列化对象,低版本浏览器有问题
			a.push(k + "=" + encodeURIComponent(JSON.stringify(val)));
		} else {
			a.push(k + "=" + encodeURIComponent(val));
		}
	}
	return a.join('&');
}
//将有lenght属性的对象转换成数组
$.toArray = function(s) {
	try {
		return Array.prototype.slice.call(s);
	} catch (e) {
		var arr = [];
		for (var i = 0, len = s.length; i < len; i++) {
			//arr.push(s[i]);
			arr[i] = s[i];
			//据说这样比push快
		}
		return arr;
	}
}
$.appendArr = function(arr1, arr2) {
	for (var i = 0; i < arr2.length; i++) {
		arr1.push(arr2[i]);
	}
}
//碰撞检测
$.isTouched = function(obj1, obj2) {
	var l = obj1.offsetLeft;
	var lr = obj1.offsetLeft + obj1.offsetWidth;
	var t = obj1.offsetTop;
	var tb = obj1.offsetTop + obj1.offsetHeight;

	var l2 = obj2.offsetLeft;
	var lr2 = obj2.offsetLeft + obj2.offsetWidth;
	var t2 = obj2.offsetTop;
	var tb2 = obj2.offsetTop + obj2.offsetHeight;

	if (lr < l2 || l > lr2 || t > tb2 || tb < t2) {
		return false;
	} else {
		return true;
	}
}

$.extend = function(fname, fn) {
	$[fname] = fn;
}
//*******************************************************
//选择器
//主体框架
function desire(vArg) {
	this.length = 0;
	switch (typeof vArg) {
		case 'function':
			$.addEvent(window, 'load', vArg);
			break;
		case 'string':
			switch (vArg.charAt(0)) {
				case '#':
					var temp = document.getElementById(vArg.substring(1));
					if (temp) {
						this.length++;
						this[0] = temp;
						break;
					}

				case '.':
					var temp = $.getByClassName(document, vArg.substring(1))
					if (temp.length > 0) {
						for (var i = 0; i < temp.length; i++) {
							this.length++;
							this[i] = temp[i];
						}
					}

					break;
				default:
					var temp = document.getElementsByTagName(vArg);
					if (temp.length > 0) {
						for (var i = 0; i < temp.length; i++) {
							this.length++;
							this[i] = temp[i];
						}
					}
			}
			break;
		case 'object':
			//可以是类数组
			if (!vArg)
				return;
			if (vArg.length > 0) {
				for (var i = 0; i < vArg.length; i++) {
					this.length++;
					this[i] = vArg[i];
				}
			} else {
				this.length++;
				this[0] = vArg;
			}
			break;
	}
}

desire.fn = desire.prototype;

//*******************************************************
//函数扩展
desire.fn.click = function(func) {
	for (var i = 0; i < this.length; i++) {
		$.addEvent(this[i], 'click', func);
	}
	return this;
}
desire.fn.hide = function() {
	for (var i = 0; i < this.length; i++) {
		this[i].style.display = 'none';
	}
	return this;
}
desire.fn.show = function() {
	for (var i = 0; i < this.length; i++) {
		this[i].style.display = 'block';
	}
	return this;
}
desire.fn.hover = function(fun1, fun2) {
	if (arguments.length == 2) {
		for (var i = 0; i < this.length; i++) {
			$.addEvent(this[i], 'mouseover', fun1);
			$.addEvent(this[i], 'mouseout', fun2);
		}
	} else {
		for (var i = 0; i < this.length; i++) {
			$.addEvent(this[i], 'mouseover', fun1);
		}
	}
	return this;
}
desire.fn.css = function(key, value) {
	//可以json设置css属性
	if ( typeof arguments[0] == 'object' && arguments.length == 1) {
		for (var i = 0; i < this.length; i++) {
			for (var j in arguments[0]) {
				this[i].style[j] = arguments[0][j];
			}
		}
		return this;
	}
	//cssText设置css属性
	else if (arguments[0].indexOf(':') != -1) {
		for (var i = 0; i < this.length; i++) {
			this[i].style.cssText += ";" + arguments[0];
		}
		return this;
	}

	//设置单一属性
	if (arguments.length == 2) {
		for (var i = 0; i < this.length; i++) {
			this[i].style[key] = value;
		}
	}
	//取单一属性
	else {
		var arr = $.getStyle(this[0], key);
		//取属性
		return arr;
	}
	return this;
}
//可作为切换点击事件 也可作为切换显隐
desire.fn.toggle = function() {
	var _args = arguments;
	if (_args.length == 0) {
		//切换所有元素状态
		for (var i = 0; i < this.length; i++) {
			var temp = $(this[i]);
			temp.css('display') == 'block' ? temp.css('display', 'none') : temp.css('display', 'block');
		}
		return;
	}
	for (var i = 0; i < this.length; i++) {
		inovke(this[i]);
	}

	function inovke(obj) {
		var count = 0;
		//闭包，为每个元素创建执行作用域
		$.addEvent(obj, 'click', function() {
			_args[count++ % _args.length].call(obj);
		});
	}

	return this;
}

desire.fn.eq = function(n) {
	return $(this[n]);
}

desire.fn.first = function() {
	return $(this[0]);
}

desire.fn.last = function() {
	return $(this[this.length - 1]);
}

desire.fn.siblings = function() {
	var result = [];
	var temp = this[0].parentNode.children;
	var flag = true;
	for (var i = 0; i < temp.length; i++) {
		flag = true;
		for (var j = 0; j < this.length; j++) {
			if (temp[i] == this[j]) {
				flag = false;
			}
		}

		if (flag) {
			result.push(temp[i]);
		}
	}
	return $(result);
}

desire.fn.parent = function() {
	var temp = this[0].parentNode;
	return $(temp);
}

desire.fn.parents = function() {
	var temp = this[0].parentNode;
	return $(temp.parentNode.children);
	//可以是类数组
}

desire.fn.find = function(str) {
	var result = [];
	for (var i = 0; i < this.length; i++) {
		var obj = this[i];
		switch (str.charAt(0)) {
			case '.':
				var temp = $.getByClassName(obj, str.substring(1))
				$.appendArr(result, temp);
				break;
			default:
				var temp = obj.getElementsByTagName(str);
				$.appendArr(result, temp);
		}
	}
	return $(result);
}

desire.fn.index = function() {
	var temp = this[0].parentNode.children;
	for (var i = 0; i < temp.length; i++) {
		if (temp[i] == this[0]) {
			return i;
		}
	}
}

desire.fn.attr = function(key, value) {
	if (arguments.length == 2) {
		for (var i = 0; i < this.length; i++) {
			this[i].setAttribute(key, value);
			//用[]无法设置自定义的属性
		}
	} else {
		return this[0].getAttribute(key);
		//用[]无法访问自定义的属性
	}
}

desire.fn.each = function(fun) {
	for (var i = 0; i < this.length; i++) {
		fun.call(this[i], i);
	}
}

desire.fn.bind = function(type, fn) {
	for (var i = 0; i < this.length; i++) {
		$.addEvent(this[i], type, fn);
	}
	return this;
}

desire.fn.animate = function(json, time, func) {
	time = time || 20;
	for (var i = 0; i < this.length; i++) {
		var obj = this[i];
		//清除定时器
		clearInterval(obj.timer);
		//设置定时器
		obj.timer = setInterval(function() {
			//得到当前位置
			var isStop = true;
			for (var atrr in json) {
				var iNowPosition = null;
				if (atrr == 'opacity') {
					iNowPosition = parseInt(parseFloat($.getStyle(obj, atrr)) * 100);
					//避免浮点数
				} else {
					iNowPosition = parseInt($.getStyle(obj, atrr));
				}
				//计算速度
				var iSpeed = (json[atrr] - iNowPosition) / time;
				iSpeed = iSpeed > 0 ? Math.ceil(iSpeed) : Math.floor(iSpeed);

				//停止检查
				if (iNowPosition != json[atrr]) {//当所有的都到达才停止
					isStop = false;
				} else {
					isStop = true;
				}

				if (atrr == 'opacity') {
					obj.style.filter = 'alpha:opacity(' + (iNowPosition + iSpeed) + ')';
					obj.style.opacity = (iNowPosition + iSpeed) / 100;
				} else {
					obj.style[atrr] = iNowPosition + iSpeed + 'px';
				}
			}

			if (isStop) {
				clearInterval(obj.timer);
				if (func) {
					func();
				}
			}

		}, 10)
	}
	return this;
}
//清除定时器
desire.fn.stop = function(json, func) {
	clearInterval(this[0].timer);
	return this;
}

desire.fn.addClass = function(str) {
	for (var i = 0; i < this.length; i++) {
		$.addClass(this[i], str);
	}
	return this;
}

desire.fn.removeClass = function(str) {
	for (var i = 0; i < this.length; i++) {
		$.removeClass(this[i], str);
	}
	return this;
}

desire.fn.toggleClass = function(str) {
	for (var i = 0; i < this.length; i++) {
		if (this[i].className.indexOf(str) != -1) {
			$.removeClass(this[i], str);
		} else {
			$.addClass(this[i], str);
		}
	}
	return this;
}
//偶数个
desire.fn.even = function() {
	var result = [];
	for (var i = 0; i < this.length; i++) {
		if (i % 2 == 0) {
			result.push(this[i]);
		}
	}
	return $(result);
}
//奇数个
desire.fn.odd = function() {
	var result = [];
	for (var i = 0; i < this.length; i++) {
		if (i % 2 == 1) {
			result.push(this[i]);
		}
	}
	return $(result);
}

desire.fn.size = function() {
	return this.length;
}

desire.fn.width = function() {
	return this[0].offsetWidth;
}

desire.fn.height = function() {
	return this[0].offsetHeight;
}

