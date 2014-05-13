/**
 * Created by Alan on 2014/4/26.
 * bgcolor  整体颜色风格			默认值（#336699）
 * isLock   是否锁屏                         默认值（false）
 * content  内容  可以是dom元素，  默认值（loding）
 * title    标题  				默认值(消息)
 * ok       确定回调函数			默认值（null）
 * cancel   取消回调函数  		默认值（null）
 * button   自定义按钮   [{name: '登录', callback: function () {},disabled:'false'}, {name: '取消'}]
 * width    内容区域宽度			默认值（auto）
 * height   内容区域高度			默认值（auto）
 * time     设置对话框几秒后关闭  默认值（null）
 * resize   是否可以调节大小          默认值（true）
 * drag		是否可拖动			默认值（true）
 */
$.extend('dialog', function(setting) {
	return new dialog(setting);

	function dialog(setting) {
		var self = this;
		//初始化参数
		setting = setting || {};
		this.bgcolor = setting.bgcolor || '#336699';
		this.lock = setting.lock || false;
		this.content = setting.content || 'loading...';
		this.title = setting.title || '消息';
		this.ok = setting.ok || null;
		this.cancel = setting.cancel || null;
		this.width = setting.width || '300';
		this.height = setting.height || '150';
		this.time = setting.time || null;
		this.drag = setting.drag || true;
		this.resize = setting.resize || true;
		this.isLock = setting.isLock || false;
		this.button = setting.button || null;
		this.close = function() {
			document.body.removeChild(msgObj)
			if (self.lock) {
				document.body.removeChild(bgObj)
			}
		}
		if (this.lock) {
			//蒙板层
			var sWidth, sHeight;
			sWidth = document.body.offsetWidth;
			sHeight = screen.height;
			var bgObj = document.createElement("div");
			bgObj.setAttribute('id', 'bgDiv');
			$.setCssText(bgObj, "position:absolute;top:0;left:0;background:#777;opacity:0.6;width:100%;height:100%;z-index:10000")
			document.body.appendChild(bgObj);
		}

		//弹出层
		var msgObj = document.createElement("div");
		msgObj.setAttribute("id", "msgDiv");
		msgObj.style.top = sHeight/3.5 - (this.height / 2) + "px"
		msgObj.style.left = sWidth/2 - (this.width / 2) + "px"
		$.setCssText(msgObj, "background:white;border:1px solid " + this.bgcolor + ";position:absolute; font:12px/1.6em Verdana, Geneva, Arial, Helvetica, sans-serif;line-height:25px;z-index:10002")

		//弹出层-title
		var titleObj = document.createElement("div");
		titleObj.setAttribute("id", "msgTitle");
		$.setCssText(titleObj, "padding-left:10px;background:" + this.bgcolor + ";opacity=0.75;border=1px solid #336699;height=28px;font:12px/28px Verdana, Geneva, Arial, Helvetica, sans-serif;color:white;font-weight:bold;cursor:move;")
		titleObj.innerHTML = this.title;
		//title-close
		var close = document.createElement("div");
		close.setAttribute("id", "desire_close");
		$.setCssText(close, 'margin:-1px -1px 0 0;width:30px;height:28px;line-height=28px;float:right;text-align:center;color:#fff;font-weight:bold;background:red;cursor:pointer;')
		close.innerHTML = 'X';
		titleObj.appendChild(close);
		close.onclick = function() {
			self.close();
		}
		//弹出层-button
		var buttonObj = document.createElement("div");
		$.setCssText(buttonObj, 'text-align:right;height:46px;width:100%;background:#F9F6F6;')
		buttonObj.setAttribute("id", "buttonDiv");

		var wrap = document.createElement("div");
		wrap.style.padding = '8px';
		buttonObj.appendChild(wrap);
		function addButton(button) {
			//buttons
			for (var i = 0; i < button.length; i++) {
				var btn = document.createElement("input");
				btn.type = 'button';
				btn.style.marginRight = '10px';
				btn.value = button[i].name;
				btn.onclick = button[i].callback;
				wrap.appendChild(btn);
			}
		}

		if (this.button) {
			addButton(this.button)
		} else {
			addButton([{
				name : '确定',
				callback : this.ok
			}, {
				name : '取消',
				callback : function() {
					self.cancel
					self.close();
				}
			}])
		}

		//弹出层-content
		var contentObj = document.createElement("div");
		contentObj.setAttribute("id", "content");
		$.setCssText(contentObj, "margin:1em 0;text-align:center;")
		contentObj.style.width = this.width + "px";
		contentObj.style.height = (this.height - 30 - 46 - 24) + "px";
		if ( typeof this.content == 'object') {
			this.content.style.display = 'block';
			contentObj.appendChild(this.content);
		} else {
			contentObj.innerHTML = this.content;
		}

		//拖拽
		if (this.drag && desire.fn.drag) {
			$(titleObj).drag(msgObj);
		}

		//加入文档
		msgObj.appendChild(titleObj);
		msgObj.appendChild(contentObj);
		msgObj.appendChild(buttonObj);
		document.body.appendChild(msgObj);

	}

})
