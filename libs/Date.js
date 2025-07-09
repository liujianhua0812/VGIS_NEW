module.exports = function () {
    Date.prototype.format = function(fmt) { //author: meizz
        var o = {
            "M+" : this.getMonth()+1,                 //月份
            "d+" : this.getDate(),                    //日
            "h+" : this.getHours(),                   //小时
            "m+" : this.getMinutes(),                 //分
            "s+" : this.getSeconds(),                 //秒
            "q+" : Math.floor((this.getMonth()+3)/3), //季度
            "S"  : this.getMilliseconds()             //毫秒
        };
        if(/(y+)/.test(fmt))
            fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
        for(var k in o)
            if(new RegExp("("+ k +")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length===1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        return fmt;
    };

    Date.processMonthRange = (start, end) => {
        if (isNaN(start.getTime())) {
            start = null;
        }
        else {
            start.setDate(1);
            start.setHours(0);
            start.setMinutes(0);
            start.setSeconds(0);
            start.setMilliseconds(0);
        }
        if (isNaN(end.getTime())) {
            end = null;
        }
        else {
            end.setDate(1);
            end.setHours(0);
            end.setMinutes(0);
            end.setSeconds(0);
            end.setMilliseconds(0);
            end.setMonth(end.getMonth() + 1);
        }
        return [start, end];
    };
};