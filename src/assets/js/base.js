import React, { Component } from 'react';
import ReactDOM from 'react-dom';
const Common = {
    domain: document.domain.substring(document.domain.indexOf(".")),
    //cookie封装
    cookie: {
        get: function(n) {
            var m = document.cookie.match(new RegExp("(^| )" + n + "=([^;]*)(;|$)"));
            return !m ? "" : m[2];
        },
        set: function(name, value, domain, path, hour, expireTime) {
            var cookie = [
                name + "=" + value + ";"
            ];
            if (domain && domain != "/") {
                cookie.push("domain =" + domain);
            } else {
                cookie.push("domain =" + Common.domain);
            }
            if (path) {
                cookie.push("path =" + path);
            }
            if (hour) {
                var expire = new Date();
                expire.setTime(expire.getTime() + (hour ? 3600000 * hour : 30 * 24 * 60 * 60 * 1000));
                cookie.push("expires=" + expire.toGMTString());
            }
            if (expireTime) {
                var expire = new Date(expireTime);
                cookie.push("expires=" + expire.toGMTString());
            }
            document.cookie = cookie.join(";");
        },
        del: function(name, domain, path) {
            document.cookie = name + "=; expires=Mon, 26 Jul 1997 05:00:00 GMT; path=" + (path ? path : "/") + "; " + (domain && domain != '/' ? ("domain=" + domain + ";") : "domain=" + Common.domain);
            //旧数据清理
            document.cookie = name + "=; expires=Mon, 26 Jul 1997 05:00:00 GMT; path=" + (path ? path : "/") + "; " + "domain=";
        }
    },
    tempStore: {
        get: function(key) {
            return sessionStorage && sessionStorage.getItem(key);
        },
        /*赋值*/
        set: function(key, data) {
            return sessionStorage && sessionStorage.setItem(key, data);
        },
        /*删除*/
        remove: function(key) {
            return sessionStorage && sessionStorage.removeItem(key);
        },
        /* [慎用] 清除所有的key/value*/
        clear: function() {
            return sessionStorage && sessionStorage.clear();
        }
    },
    queryBom: function(n) {
        var m = window.location.search.match(new RegExp("(\\?|&)" + n + "=([^&]*)(&|$)"));
        return !m ? "" : decodeURIComponent(m[2]);
    },
    loadingState:{},
    HOSTNAME: location.protocol + "//" + location.host,
}
Common.localStore = {
        get: function(key) {
            if (localStorage) {
                return localStorage && localStorage[key];
            } else {
                Common.cookie.get(key);
            }
        },
        /*赋值*/
        set: function(key, data) {
            try { //隐私模式异常
                if (localStorage) {
                    localStorage && localStorage.setItem(key, data);
                } else {
                    Common.cookie.set(key, data);
                }
            } catch (e) {
                console.log(e);
            }
        },
        /*删除*/
        remove: function(key) {
            if (localStorage) {
                return localStorage && localStorage.removeItem(key);
            } else {
                Common.cookie.del(key);
            }
        },
        /* [慎用] 清除所有的key/value*/
        clear: function() {
            return localStorage && localStorage.clear();
        }
    }
    //判断是否app
Common.deviceType = (Common.cookie.get("source") || "wap").toLowerCase();

//浏览器内核
Common.browser = {
    versions: function() {
        var u = navigator.userAgent,
            app = navigator.appVersion;
        return { //移动终端浏览器版本信息
            trident: u.indexOf('Trident') > -1, //IE内核
            presto: u.indexOf('Presto') > -1, //opera内核
            webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
            gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
            mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
            ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
            android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或uc浏览器
            iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
            iPad: u.indexOf('iPad') > -1, //是否iPad
            webApp: u.indexOf('Safari') == -1, //是否web应该程序，没有头部与底部
            weixin: u.indexOf("MicroMessenger") > -1 //是否是微信环境
        };
    }(),
    language: (navigator.browserLanguage || navigator.language).toLowerCase()
}

var Hub = {
    _events: {},
    $emit: function (event,data) {
        if (!this._events[event]) { // 没有监听事件
          return;
        }
        for (var i = 0; i < this._events[event].length; i++) {
            this._events[event][i](data,arguments);
        }
    },
    $on: function (event, callback) {
      // 创建一个新事件数组
      if (!this._events[event]) {
        this._events[event] = [];
      }
      this._events[event].push(callback);
    }
};
module.exports = {
    React,
    Component,
    ReactDOM,
    Common,
    Hub
}