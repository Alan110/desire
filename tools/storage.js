/**
* @desc 封装localStorage和sessionStorage
*/

define(function() {
    var storage = function(name) {
        var obj = {};
        try {
            window[name].setItem('_t', 1);
            window[name].removeItem('_t');
            obj.enabled = true;
        } catch (ex) {
            obj.enabled = false;
        }
        if (!obj.enabled) {
            // 不支持localStorage的情况下，mock一堆接口，兼容一下有的人不检测支持情况直接调用的
            obj.getObj = obj.getObjItem = obj.setObj = obj.setObjItem = obj.getItem = obj.get = obj.key = function() {
                return null;
            };
            obj.updateObj = obj.updateObjItem = obj.setItem = obj.set = obj.removeItem = obj.remove = obj.clear = function() {};
            obj.length = function() {
                return 0;
            };
            obj.keys = function() {
                return [];
            };
            return obj;
        }

        var st = window[name];

        /**
         * 简单的对st.getItem的封装
         * @param  {String} key
         * @return {String} 不存在时返回null
         */
        obj.getItem = function(key) {
            return st.getItem(key);
        };

        /**
         * 简单地对st.setItem的封装
         * @param {String} key
         * @param {String} value
         */
        obj.setItem = function(key, value) {
            st.setItem(key, value);
        };

        obj.removeItem = function(key) {
            st.removeItem(key);
        };

        /**
         * value为json串，获取json对象或者其中的某个key的值
         * @param {String} key
         * @param {String} objKey
         * @return {String || Object} 不存在时返回null
         */
        obj.getObjItem = function(key, objKey) {
            var str = this.getItem(key),
                obj = null;

            try {
                obj = JSON.parse(str);
                objKey && (obj = obj[objKey])
            } catch (e) {
                //TODO
            } finally {
                if (obj === undefined) {
                    obj = null;
                }
            }

            return obj;
        };

        /**
         * 存储值为Object
         * @param {String} key
         * @param {Object} obj
         */
        obj.setObjItem = function(key, obj) {
            this.setItem(key, JSON.stringify(obj));
        };

        /**
         * 更新Object中某个key的存储值
         * @param {String} key
         * @param {String} objKey
         * @param {String} objValue
         */
        obj.updateObjItem = function(key, objKey, objValue) {
            var obj = this.getObjItem(key);
            obj[objKey] = objValue;
            this.setObjItem(key, obj);
        };

        /**
         * 获取值
         * @param  {String} product 产品段
         * @param  {String} feature 功能段
         * @param  {String} custom  自定义段
         */
        obj.get = function(product, feature, custom) {
            var key = [product, feature, custom].join('_');
            return obj.getItem(key);
        };

        obj.set = function(product, feature, custom, value) {
            var key = [product, feature, custom].join('_');
            obj.setItem(key, value);
        };

        obj.remove = function(product, feature, custom) {
            var key = [product, feature, custom].join('_');
            obj.removeItem(key);
        };

        obj.getObj = function(product, feature, custom, objKey) {
            var key = [product, feature, custom].join('_');

            return this.getObjItem(key, objKey);
        };

        obj.setObj = function(product, feature, custom, obj) {
            this.setObjItem([product, feature, custom].join('_'), obj);
        };

        obj.updateObj = function(product, feature, custom, objKey, objValue) {
            this.updateObjItem([product, feature, custom].join('_'), objKey, objValue);
        };

        /**
         * 获取满足该命名规范的所有key的数组，不指定参数时，返回所有key的数组
         * @param  {String} product 产品段
         * @param  {String} feature 功能段
         * @return {Array}
         */
        obj.keys = function(product, feature) {
            var RE = false,
                key;
            if (arguments.length == 2) {
                key = [product, feature].join('_');
                RE = new RegExp('^' + key);
            }
            var keys = [];
            for (var i = 0, len = st.length; i < len; ++i) {
                key = st.key(i);
                if (!RE || key.match(RE)) {
                    keys.push(key);
                }
            }
            return keys;
        };

        /**
         * 简单地封装st.clear()
         */
        obj.clear = function() {
            st.clear();
        };

        /**
         * 简单地返回st.length
         * @return {Number}
         */
        obj.length = function() {
            return st.length;
        };

        /**
         * 简单地封装st.key(i)
         * @param  {Number} i
         * @return {String}
         */
        obj.key = function(i) {
            return st.key(i);
        };
        return obj;
    };

    return {
        ls: storage('localStorage'),
        ss: storage('sessionStorage')
    };
});

require(['utils/storage'], function(Storage) {
    page.utils = page.utils || {};
    page.utils.ls = Storage.ls;
    page.utils.ss = Storage.ss;

    // 兼容之前的代码
    B.ls = Storage.ls; // B.ls做成localStorage组件
    B.ss = Storage.ss; // B.ss做成sessionStorage组件
});