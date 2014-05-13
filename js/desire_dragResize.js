//拖动元素1，改变元素2的大小
desire.fn['dragResize'] = function($resizeObj) {
    var obj = this[0];
    var resizeObj = $resizeObj[0];
    obj.onmousedown = function() {
        var event = event || window.event;
        var disX = event.clientX - this.offsetLeft
        var disY = event.clientY - this.offsetTop
        //移动和弹起事件绑定到document对象上，避免移动太快出现脱节的现象，只有在点击之后才绑定事件，鼠标弹起则移除事件。
        document.onmouseup = stop;
        document.onmousemove = move;

        //拖动时，文字会被选中是浏览器的默认行为，要去掉
        if (window.event) {
            return false;
        } else {
            event.preventDefault();
        }

        function stop() {
            document.onmouseup = null;
            document.onmousemove = null;
            if (obj.setCaptuer) {
                obj.setCaptuer();
            }
        }

        function move() {
            var event = event || window.event;
            //移动的距离
            var left = event.clientX - disX;
            var top = event.clientY - disY;
            //边界检测
            if (left < 0) {
                left = 0;
            } else if (left > document.documentElement.clientWidth - obj.offsetWidth) {
                left = document.documentElement.clientWidth - obj.offsetWidth;
            }

            if (top < 0) {
                top = 0;
            } else if (top > document.documentElement.clientHeight - obj.offsetHeight) {
                top = document.documentElement.clientHeight - obj.offsetHeight;
            }

            //resize，width为移动的距离加上图标方块的距离
            resizeObj.style.width = (left + obj.offsetWidth) + "px";
            resizeObj.style.height = (top + obj.offsetHeight) + "px";
        }

    }
}