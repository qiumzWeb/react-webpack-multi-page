
const Tools =  {
    //获取url参数
    queryBom:function (n) {
        var m = window.location.search.match(new RegExp("(\\?|&)" + n + "=([^&]*)(&|$)"));
        return !m ? "" : decodeURIComponent(m[2]);
    },
	  //money格式化
    formatMoney: function (mVal, iAccuracy) {
        var fTmp = 0.00;//临时变量
        var iFra = 0;//小数部分
        var iInt = 0;//整数部分
        var aBuf = new Array(); //输出缓存
        var bPositive = true; //保存正负值标记(true:正数)
        function funZero(iVal, iLen) {
            var sTmp = iVal.toString();
            var sBuf = new Array();
            for (var i = 0, iLoop = iLen - sTmp.length; i < iLoop; i++)
                sBuf.push('0');
            sBuf.push(sTmp);
            return sBuf.join('');
        };
        if (typeof (iAccuracy) === 'undefined')
            iAccuracy = 2;
        bPositive = (mVal >= 0);//取出正负号
        fTmp = (isNaN(fTmp = parseFloat(mVal))) ? 0 : Math.abs(fTmp);//强制转换为绝对值数浮点
        //所有内容用正数规则处理
        iInt = parseInt(fTmp); //分离整数部分
        iFra = parseInt((fTmp - iInt) * Math.pow(10, iAccuracy) + 0.5); //分离小数部分(四舍五入)
        do {
            aBuf.unshift(funZero(iInt % 1000, 3));
        } while ((iInt = parseInt(iInt / 1000)));
        aBuf[0] = parseInt(aBuf[0]).toString();//最高段区去掉前导0
        if (0 === iFra) {
            return ((bPositive) ? '' : '-') + aBuf.join(',')
        } else {
            return ((bPositive) ? '' : '-') + aBuf.join(',') + '.' + ((0 === iFra) ? '00' : funZero(iFra, iAccuracy));
        }
    },
    //解析money格式
    unformatMoney: function (sVal) {
        var fTmp = parseFloat(sVal.replace(/,/g, ''));
        return (isNaN(fTmp) ? 0 : fTmp);
    },
    //手机号码正则
    rephone :/^1[3|4|5|8|7][0-9]{9}$/,
    //rephone:/^1110[0-9]{7}$/,   //====测试环境=====
    //验证码正则
    capt:/^[0-9]{6}$/,
    //登录密码正则
    rePwd:/^(?![\d]+$)(?![a-z]+$)(?![A-Z]+$)(?![^\da-zA-Z]+$)/,
    //姓名正则
    reName:/^[\w\u3E00-\u9FA5]+$/,
    //身份证号正则
    reIdCard:/(^\d{15,18}$)|(^\d{17}(\d|X|x)$)/,
    //银行卡号正则
    reBankCard:/^(\d{16,19})$/,
    //金额正则（最少1，最多带两位小数）
    reMoneyGt1:/^[1-9][0-9]*([.][0-9]{1,2}){0,1}$/
}

Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1,          //月份
        "d+": this.getDate(),                    //日
        "[Hh]+": this.getHours(),                   //小时
        "m+": this.getMinutes(),              //分
        "s+": this.getSeconds(),                //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds()             //毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
Tools.formatDate = function(pattern,seconds){
    if(seconds){
        var newTime = new Date(Number(seconds)*1000);
    }else{
        var newTime = new Date();
    }
    return newTime.Format(pattern);
}
Tools.numberFormat = function(_number){
    if(_number && !isNaN(parseFloat(_number))){
        _number = parseFloat(_number);
        return _number.toFixed(2);
    }else{
        return _number;
    }
}
Tools.trim = function(str){
    var result;
    result = str.replace(/(^\s+)|(\s+$)/g,"");
    result = result.replace(/\s/g,"");
    return result;
}
module.exports = {
    Tools
}
