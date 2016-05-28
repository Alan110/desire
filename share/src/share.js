(function(factory) {
    if (typeof define === "function" && define.amd) {
        define(["jquery"], factory);
    } else {
        factory(jQuery);
    }
})(function($) {

    var _shareLocation = {
        "qzone": "http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=ht\
				  tp%3A%2F%2Fv.yinyuetai.com%2Fvideo%2F2501173&title=%E8%BF%99%E9%8\
				  7%8C%E6%98%AF%E5%88%86%E4%BA%AB%E6%96%87%E6%A1%88&desc=&summary=&\
				  site=&pics=http%3A%2F%2Ft11.baidu.com%2Fit%2Fu%3D2779495171%2C298\
				  4385754%26fm%3D58",
        "weibo": "http://service.weibo.com/share/share.php?url=http%3A%2F%2Fv.yinyuetai.com%2Fvideo%2F2501173&title=%E8%BF%99%E9%87%8C%E6%98%AF%E5%88%86%E4%BA%AB%E6%96%87%E6%A1%88&appkey=1343713053&pic=http%3A%2F%2Ft11.baidu.com%2Fit%2Fu%3D2779495171%2C2984385754%26fm%3D58&searchPic=true#_loginLayer_1456747210472",
        "tieba": "http://tieba.baidu.com/f/commit/share/openShareApi?title=这里是分享文案&desc=&comment=&pic=&url=http://v.yinyuetai.com/video/2483944%2310006-tieba-1-3680-bf6461719a993b4683f4212b1604e413",
        "weixin": ""
    };
    var _shareAttr = ["title", "url", "pic", "desc", "summary", "site", "comment"]
    var $wrapper;
    var $qrwrap;
    var $close;

    /*qrcode配置对象*/
    var _qrcodeCfg = {
        /*渲染模式*/
        render: (navigator.userAgent.indexOf('MSIE') >= 0 && navigator.userAgent.indexOf('Opera') < 0) ?
            "table" : "canvas",
        width: 150,
        height: 150,
        text: '',
        myOffsetLeft : 0,
        myOffsetTop : 20
    };


    var _handle = function(){
        var $this = $(this);
        var type = $this.data("type");
        var url = _shareLocation[type];

        function share_link(){
            url = _shareAttr.reduce(function(url, now, index) {
                /*qq空间的图片字段是pics*/
                if (type == "qzone" && now == "pic") {
                    now += "s";
                }
                /*贴吧的url后面会带上一个戳*/
                if (type = "tieba" && now == "url") {
                    var reg = new RegExp(now + '=.*?(%2310006)', "g");
                    return url.replace(reg, now + "=" + encodeURIComponent($this.data(now) || "") + "$1");
                } else {
                    var reg = new RegExp(now + '=.*?(&|$)', "g");
                    return url.replace(reg, now + "=" + encodeURIComponent($this.data(now) || "") + "&");
                }
            }, url)

            $this.attr("href", url);
        }

        function share_qrcode(){
            var option = $.extend(_qrcodeCfg, {
                width: $this.data("width"),
                height: $this.data("height"),
                text: $this.data("url"),
                myOffsetLeft : $this.data("myoffsetleft"),
                myOffsetTop : $this.data("myoffsettop")
            });

            var offset = $this.offset();
            $('.s-qrcode').qrcode(option).parent().css({
                top : offset.top + option.myOffsetTop +  'px',
                left : offset.left + option.myOffsetLeft +  'px'
            });
            $qrwrap.show();
            return false;
        };

        if (type !== "weixin") {
            share_link();
        } else {
            share_qrcode();
        }

    };


    $.extend({
        share: function($wrapper,option) {
            $wrapper = $($wrapper);
            //创建微信容器html
            $qrwrap = $('<div class="s-qrcode-wrapper" style="display:none;position:absolute;"><div class="s-qrcode-close-wrap"></div><div class="s-qrcode"></div></div>');
            $close = $('<div class="s-qrcode-close">X</div>');
            $close.on("click", function() {
                $qrwrap.hide();
            });

            $qrwrap.find(".s-qrcode-close-wrap").append($close).end().appendTo("body");
            $wrapper.on("click", ".my-share", _handle);
        }
    });


});
