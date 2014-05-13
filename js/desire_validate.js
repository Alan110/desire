//name  验证对象的name属性
//checkType  验证对象的验证类型
//blurCheck  失去焦点时验证
//callback   处理结果回调，this指向当前验证元素，默认传入验证结果result
$.extend('validate', function(formObj, data, setting) {
	var ruleRegex = {};
	ruleRegex['number'] = /^[0-9]+$/;
	ruleRegex['email'] = /^[a-zA-Z0-9.!#$%&amp;'*+\-\/=?\^_`{|}~\-]+@[a-zA-Z0-9\-]+(?:\.[a-zA-Z0-9\-]+)*$/;
	ruleRegex['ip'] = /^((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){3}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})$/i;
	ruleRegex['base64'] = /[^a-zA-Z0-9\/\+=]/i;
	ruleRegex['url'] = /^((http|https):\/\/(\w+:{0,1}\w*@)?(\S+)|)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/;

	//初始化参数
	if (!formObj)
		return;
	data = data || [];
	setting = setting || {};
	setting.blurCheck = setting.blurCheck === false ? setting.blurCheck : true;
	//失去焦点时验证
	if (setting.blurCheck) {
		for (var i = 0; i < data.length; i++) {
			//为每个验证对象绑定blur事件
			formObj.elements[data[i].name].onblur = (function(i) {
				return function() {
					//获取验证类型
					var checkType = data[i].checkType;
					//根据指定类型验证数据
					var reslult = ruleRegex[checkType].test(formObj.elements[data[i].name].value);
					if (setting.callback) {
						setting.callback.call(this, reslult);
					}
					//					//将错误码写入该验证对象属性
					//					formObj.elements[data[i].name].setAttribute('checkResult', reslult);
				}
			})(i)
		}
	}

	//防止验证欺骗，提交时再进行一次验证
	for (var i = 0; i < formObj.elements.length; i++) {
		if (formObj.elements[i].type == 'submit') {
			$.addEvent(formObj.elements[i], 'click', function() {
				var prevent = false;
				for (var j = 0; j < data.length; j++) {
					var checkType = data[j].checkType;
					var reslult = ruleRegex[checkType].test(formObj.elements[data[j].name].value);
					prevent = reslult ? false : true;
					if (setting.callback) {
						setting.callback.call(formObj.elements[data[j].name], reslult);
					}
					//					formObj.elements[data[j].name].setAttribute('checkResult', reslult);
				}
				//是否阻止默认提交
				if (prevent) {
					return false;
				}
			})
		}
	}
});
