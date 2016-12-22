var startTouch = {
    x: 0,
    y: 0
};

var TouchInfo = {
    x: 0,
    y: 9,
    touched: false
};

var sChange = {
    curY: 0,
    preY: 0,
    nxtY: 0,
    threhold: 50,
    pages: 5,
    isStart: true,
    nowPage: 1,
    getStep: function() {
        var t = this.nowPage,
            next = t + 1,
            pref = t - 1;

        return 1 == t ? pref = null : t == this.pages && (next = null), {
            step: t,
            nxStep: next,
            preStep: pref
        };
    },
    move: function(t) {
        if (!this.isStart) return false;
        if (this.isAnimate) return false;

        var e = this.getStep(),
            n = $(window).height();

        //手指向下滑动
        if (0 > t) {
            //手指向下滑动,当在第一页时退出
            if (null === e.preStep) return false;
            //滑动的距离大于屏幕高度退出
            if (this.curY = t, this.preY = -(n + t), Math.abs(t) > n) return false;

            //上一页的层级高于当前页
            $(".s" + e.preStep).css("z-index", 5);
            $(".s" + e.step).css("z-index", 4);

            //当前页变形
            //总共绕x轴旋转60度,乘以滑动距离与屏幕高度的比例
            $(".s" + e.step)[0].style.webkitTransform = "translateZ(" + this.curY + "px) translateY(" + -this.curY / 3 + "px) rotateX(" + 60 * (-this.curY / n) + "deg)";
            //上一页位移
            $(".s" + e.preStep)[0].style.webkitTransform = "translateY(" + this.preY + "px)";
        } else {
            //手指向上滑
            //手指向上滑动,当在第最后页时退出
            if (null === e.nxStep) return false;
            //滑动的距离大于屏幕高度退出
            if (this.curY = -t, this.nxtY = n - t, Math.abs(t) > n) return false;

            console.log(e.step);
            $(".s" + e.nxStep).css("z-index", 5);
            $(".s" + e.step).css("z-index", 4);
            $(".s" + e.step)[0].style.webkitTransform = "translateZ(" + this.curY + "px) translateY(" + this.curY / 3 + "px) rotateX(" + 60 * (this.curY / n) + "deg)";
            $(".s" + e.nxStep)[0].style.webkitTransform = "translateY(" + this.nxtY + "px)";
        }
    },
    goToEnd: function(t) {
        if (!this.isStart) return false;

        //放手后自动动画
        var s = this.getStep();
        this.dy = t;
        var e = this,
            n = this.getStep(),
            i = $(".stage").height();

        //内容动画
        if (0 > t) {
            if (this.threhold < -t && s.step > 1) {
                console.log("hold-start");
            }
        } else {
            if (this.threhold < t && s.step < this.pages) {
                console.log("hold-end");
            }
        }

        function down_back() {
            document.querySelector(".s" + n.step).style.cssText = "z-index:4;transition:all ease-in-out 350ms;transform:translate3d(0,0,0)";
            document.querySelector(".s" + n.preStep).style.cssText = "z-index:5;transition:all ease-in-out 350ms;transform:translate3d(0,-100%,0)";
            //清除动画属性
            setTimeout(function() {
                var temp = document.querySelector(".s" + n.step);
                temp.style.transition = "inherit";
                temp.style.zIndex = 4;

                document.querySelector(".s" + n.preStep).style.transition = "inherit";
            }, 355);
        }

        function down_fire() {
            if (null === n.preStep) return false;

            document.querySelector(".s" + n.step).style.cssText = "z-index:4;transition:all ease-in-out 350ms;transform:translate3d(0," + -e.curY / 1.5 + "px,-400px) rotate3d(1,0,0," + 80 * (-e.curY / i) + "deg);";
            document.querySelector(".s" + n.preStep).style.cssText = "z-index:5;transition:all ease-in-out 350ms;transform:translate3d(0,0,0)";
            e.nowPage--;
            //清除动画属性
            setTimeout(function() {
                var temp = document.querySelector(".s" + n.step);
                temp.style.transition = "inherit";
                temp.style.zIndex = 1;

                document.querySelector(".s" + n.preStep).style.transition = "inherit";
            }, 355);
        }

        function up_fire() {
            if (null === n.nxStep) return false;

            document.querySelector(".s" + n.step).style.cssText = "z-index:4;transition:all ease-in-out 350ms;transform:translate3d(0," + e.curY / 1.5 + "px,-400px) rotate3d(1,0,0," + 80 * (e.curY / i) + "deg);";
            document.querySelector(".s" + n.nxStep).style.cssText = "z-index:5;transition:all ease-in-out 350ms;transform:translate3d(0,0,0)";
            e.nowPage++;
            //清除动画属性
            setTimeout(function() {
                var temp = document.querySelector(".s" + n.step);
                temp.style.transition = "inherit";
                temp.style.zIndex = 1;

                document.querySelector(".s" + n.nxStep).style.transition = "inherit";
            }, 355);
        }

        function up_back() {
            document.querySelector(".s" + n.step).style.cssText = "z-index:4;transition:all ease-in-out 350ms;transform:translate3d(0,0,0)";
            document.querySelector(".s" + n.nxStep).style.cssText = "z-index:5;transition:all ease-in-out 350ms;transform:translate3d(0,100%,0)";
            //清除动画属性
            setTimeout(function() {
                var temp = document.querySelector(".s" + n.step);
                temp.style.transition = "inherit";
                temp.style.zIndex = 4;

                document.querySelector(".s" + n.nxStep).style.transition = "inherit";
            }, 355);
        }

        //判断方向
        if (0 > t) {
            //判断是否超过阀值
            if (-this.threhold > t) {
                down_fire();
            } else {
                down_back();
            }

        } else {
            if (t > this.threhold) {
                up_fire();
            } else {
                up_back();
            }
        }

    }
};

$(document).on("touchstart", function(t) {
var e = t.changedTouches[0];
    TouchInfo.touched = true,
        startTouch.x = e.clientX,
        startTouch.y = e.clientY;
});

$(document).on("touchmove", function(t) {
        t.preventDefault();
        var e = t.changedTouches[0];
        return TouchInfo.touched ? (TouchInfo.x = e.clientX, TouchInfo.y = e.clientY, sChange.move(startTouch.y - e.clientY), void 0) : !1;
    }),

    $(document).on("touchend", function(t) {
        var e = t.changedTouches[0];
        TouchInfo.touched = !1, sChange.goToEnd(startTouch.y - e.clientY);
    });
