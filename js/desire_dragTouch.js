//拖动元素，碰到另一个元素时，执行fun
desire.fn['dragTouch'] = function ($obj2, fun) {
    for (var i = 0; i < this.length; i++) {
        obj = this[i];
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

                obj.style.left = left + "px";
                obj.style.top = top + "px";

                if (true == $.isTouched(obj, $obj2[0])) {
                    if (fun) {
                        fun();
                        stop();
                    }
                }
            }

        }
    }
}
