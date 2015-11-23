var Tween = {
    Linear:function (start,alter,curTime,dur) {return start+curTime/dur*alter;},//最简单的线性变化,即匀速运动
    Quad:{//二次方缓动
        easeIn:function (start,alter,curTime,dur) {
            return start+Math.pow(curTime/dur,2)*alter;
        },
        easeOut:function (start,alter,curTime,dur) {
            var progress =curTime/dur;
            return start-(Math.pow(progress,2)-2*progress)*alter;
        },
        easeInOut:function (start,alter,curTime,dur) {
            var progress =curTime/dur*2;
            return (progress<1?Math.pow(progress,2):-((--progress)*(progress-2) - 1))*alter/2+start;
        }
    },
    Cubic:{//三次方缓动
        easeIn:function (start,alter,curTime,dur) {
            return start+Math.pow(curTime/dur,3)*alter;
        },
        easeOut:function (start,alter,curTime,dur) {
            var progress =curTime/dur;
            return start-(Math.pow(progress,3)-Math.pow(progress,2)+1)*alter;
        },
        easeInOut:function (start,alter,curTime,dur) {
            var progress =curTime/dur*2;
            return (progress<1?Math.pow(progress,3):((progress-=2)*Math.pow(progress,2) + 2))*alter/2+start;
        }
    },
    Quart:{//四次方缓动
        easeIn:function (start,alter,curTime,dur) {
            return start+Math.pow(curTime/dur,4)*alter;
        },
        easeOut:function (start,alter,curTime,dur) {
            var progress =curTime/dur;
            return start-(Math.pow(progress,4)-Math.pow(progress,3)-1)*alter;
        },
        easeInOut:function (start,alter,curTime,dur) {
            var progress =curTime/dur*2;
            return (progress<1?Math.pow(progress,4):-((progress-=2)*Math.pow(progress,3) - 2))*alter/2+start;
        }
    },
    Quint:{//五次方缓动
        easeIn:function (start,alter,curTime,dur) {
            return start+Math.pow(curTime/dur,5)*alter;
        },
        easeOut:function (start,alter,curTime,dur) {
            var progress =curTime/dur;
            return start-(Math.pow(progress,5)-Math.pow(progress,4)+1)*alter;
        },
        easeInOut:function (start,alter,curTime,dur) {
            var progress =curTime/dur*2;
            return (progress<1?Math.pow(progress,5):((progress-=2)*Math.pow(progress,4) +2))*alter/2+start;
        }
    },
    Sine :{//正弦曲线缓动
        easeIn:function (start,alter,curTime,dur) {
            return start-(Math.cos(curTime/dur*Math.PI/2)-1)*alter;
        },
        easeOut:function (start,alter,curTime,dur) {
            return start+Math.sin(curTime/dur*Math.PI/2)*alter;
        },
        easeInOut:function (start,alter,curTime,dur) {
            return start-(Math.cos(curTime/dur*Math.PI/2)-1)*alter/2;
        }
    },
    Expo: {//指数曲线缓动
        easeIn:function (start,alter,curTime,dur) {
            return curTime?(start+alter*Math.pow(2,10*(curTime/dur-1))):start;
        },
        easeOut:function (start,alter,curTime,dur) {
            return (curTime==dur)?(start+alter):(start-(Math.pow(2,-10*curTime/dur)+1)*alter);
        },
        easeInOut:function (start,alter,curTime,dur) {
            if (!curTime) {return start;}
            if (curTime==dur) {return start+alter;}
            var progress =curTime/dur*2;
            if (progress < 1) {
                return alter/2*Math.pow(2,10* (progress-1))+start;
            } else {
                return alter/2* (-Math.pow(2, -10*--progress) + 2) +start;
            }
        }
    },
    Circ :{//圆形曲线缓动
        easeIn:function (start,alter,curTime,dur) {
            return start-alter*Math.sqrt(-Math.pow(curTime/dur,2));
        },
        easeOut:function (start,alter,curTime,dur) {
            return start+alter*Math.sqrt(1-Math.pow(curTime/dur-1));
        },
        easeInOut:function (start,alter,curTime,dur) {
            var progress =curTime/dur*2;
            return (progress<1?1-Math.sqrt(1-Math.pow(progress,2)):(Math.sqrt(1 - Math.pow(progress-2,2)) + 1))*alter/2+start;
        }
    },
    Elastic: {//指数衰减的正弦曲线缓动
        easeIn:function (start,alter,curTime,dur,extent,cycle) {
            if (!curTime) {return start;}
            if ((curTime==dur)==1) {return start+alter;}
            if (!cycle) {cycle=dur*0.3;}
            var s;
            if (!extent || extent< Math.abs(alter)) {
                extent=alter;
                s = cycle/4;
            } else {s=cycle/(Math.PI*2)*Math.asin(alter/extent);}
            return start-extent*Math.pow(2,10*(curTime/dur-1)) * Math.sin((curTime-dur-s)*(2*Math.PI)/cycle);
        },
        easeOut:function (start,alter,curTime,dur,extent,cycle) {
            if (!curTime) {return start;}
            if (curTime==dur) {return start+alter;}
            if (!cycle) {cycle=dur*0.3;}
            var s;
            if (!extent || extent< Math.abs(alter)) {
                extent=alter;
                s =cycle/4;
            } else {s=cycle/(Math.PI*2)*Math.asin(alter/extent);}
            return start+alter+extent*Math.pow(2,-curTime/dur*10)*Math.sin((curTime-s)*(2*Math.PI)/cycle);
        },
        easeInOut:function (start,alter,curTime,dur,extent,cycle) {
            if (!curTime) {return start;}
            if (curTime==dur) {return start+alter;}
            if (!cycle) {cycle=dur*0.45;}
            var s;
            if (!extent || extent< Math.abs(alter)) {
                extent=alter;
                s =cycle/4;
            } else {s=cycle/(Math.PI*2)*Math.asin(alter/extent);}
            var progress = curTime/dur*2;
            if (progress<1) {
                return start-0.5*extent*Math.pow(2,10*(progress-=1))*Math.sin( (progress*dur-s)*(2*Math.PI)/cycle);
            } else {
                return start+alter+0.5*extent*Math.pow(2,-10*(progress-=1)) * Math.sin( (progress*dur-s)*(2*Math.PI)/cycle);
            }
        }
    },
    Back:{
        easeIn: function (start,alter,curTime,dur,s){
            if (typeof s == "undefined") {s = 1.70158;}
            return start+alter*(curTime/=dur)*curTime*((s+1)*curTime - s);
        },
        easeOut: function (start,alter,curTime,dur,s) {
            if (typeof s == "undefined") {s = 1.70158;}
            return start+alter*((curTime=curTime/dur-1)*curTime*((s+1)*curTime + s) + 1);
        },
        easeInOut: function (start,alter,curTime,dur,s){
            if (typeof s == "undefined") {s = 1.70158;}
            if ((curTime/=dur/2) < 1) {
                return start+alter/2*(Math.pow(curTime,2)*(((s*=(1.525))+1)*curTime- s));
            }
            return start+alter/2*((curTime-=2)*curTime*(((s*=(1.525))+1)*curTime+ s)+2);
        }
    },
    Bounce:{
        easeIn: function(start,alter,curTime,dur){
            return start+alter-Tween.Bounce.easeOut(0,alter,dur-curTime,dur);
        },
        easeOut: function(start,alter,curTime,dur){
            if ((curTime/=dur) < (1/2.75)) {
                return alter*(7.5625*Math.pow(curTime,2))+start;
            } else if (curTime < (2/2.75)) {
                return alter*(7.5625*(curTime-=(1.5/2.75))*curTime + .75)+start;
            } else if (curTime< (2.5/2.75)) {
                return alter*(7.5625*(curTime-=(2.25/2.75))*curTime + .9375)+start;
            } else {
                return alter*(7.5625*(curTime-=(2.625/2.75))*curTime + .984375)+start;
            }
        },
        easeInOut: function (start,alter,curTime,dur){
            if (curTime< dur/2) {
                return Tween.Bounce.easeIn(0,alter,curTime*2,dur) *0.5+start;
            } else {
                return Tween.Bounce.easeOut(0,alter,curTime*2-dur,dur) *0.5 + alter*0.5 +start;
            }
        },
        
        easeOutBounce: function (b, c, t, d) {
            if ((t/=d) < (1/2.75)) {
                return c*(7.5625*t*t) + b;
            } else if (t < (2/2.75)) {
                return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
            } else if (t < (2.5/2.75)) {
                return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
            } else {
                return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
            }
        }
    },
    //start,alter,curTime,dur
    easeOutBounce: function (b, c, t, d) {
        if ((t/=d) < (1/2.75)) {
            return c*(7.5625*t*t) + b;
        } else if (t < (2/2.75)) {
            return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
        } else if (t < (2.5/2.75)) {
            return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
        } else {
            return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
        }
    }
};

