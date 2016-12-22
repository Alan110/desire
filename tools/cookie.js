/**
* @desc cookie读写组件
* 来源 Zepto-Cookie（https://github.com/LiuJi-Jim/Zepto-Cookie/blob/master/zepto.cookie.js）
*/

define(function() {
    return {
        cookie: function(key, value, options) {
            var milliseconds, time, result, decode;
            if (arguments.length == 0) {
                return document.cookie;
            }
            // A key and value were given. Set cookie.
            if (arguments.length > 1 && String(value) !== "[object Object]") {
                // Enforce object
                options = options || {};
                if (value === null || value === undefined) options.expires = -1;
                if (typeof options.expires === 'number') {
                    milliseconds = options.expires;
                    time = options.expires = new Date();
                    time.setTime(time.getTime() + milliseconds);
                }
                value = String(value);
                return (document.cookie = [
                    encodeURIComponent(key), '=',
                    options.raw ? value : encodeURIComponent(value),
                    options.expires ? '; expires=' + options.expires.toUTCString() : '',
                    options.path ? '; path=' + options.path : '',
                    options.domain ? '; domain=' + options.domain : '',
                    options.secure ? '; secure' : ''
                ].join(''));
            }
            // Key and possibly options given, get cookie
            options = value || {};
            decode = options.raw ? function(s) {
                return s
            } : decodeURIComponent;
            return (result = new RegExp('(?:^|; )' + encodeURIComponent(key) + '=([^;]*)').exec(document.cookie)) ? decode(result[1]) : null;
        }
    };

});

