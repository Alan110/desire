////普通拖拽
////核心思想距离不变
desire.fn['drag'] = function(dragObj){
		dragObj = dragObj || this[0];
        var obj = this[0];
        obj.onmousedown = function() {
            var event = event || window.event;
            var disX = event.clientX - dragObj.offsetLeft
            var disY = event.clientY - dragObj.offsetTop
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
                if (dragObj.setCaptuer) {
                    dragObj.setCaptuer();
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
                } else if (left > document.documentElement.clientWidth - dragObj.offsetWidth) {
                    left = document.documentElement.clientWidth - dragObj.offsetWidth;
                }

                if (top < 0) {
                    top = 0;
                } else if (top > document.documentElement.clientHeight - dragObj.offsetHeight) {
                    top = document.documentElement.clientHeight - dragObj.offsetHeight;
                }

                dragObj.style.left = left + "px";
                dragObj.style.top = top + "px";
            }

        }

}