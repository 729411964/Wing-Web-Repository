//handlebars的jQuery插件
// 用法如下：
// html内容：$('#content').handlebars($('#template'), { name: "Alan" }, 'html');
// append内容：$('#content').handlebars($('#template'), { name: "Alan" }, 'append');
// prepend内容：$('#content').handlebars($('#template'), { name: "Alan" }, 'prepend');
(function ($) {
    var compiled = {};
    $.fn.handlebars = function (template, data, domOperateMode) {
        if (template instanceof jQuery) {
            template = $(template).html();
        }
        compiled[template] = Handlebars.compile(template);
        switch (domOperateMode) {
            case 'html':
                this.html(compiled[template](data));
                break;
            case 'append':
                this.append(compiled[template](data));
                break;
            case 'prepend':
                this.prepend(compiled[template](data));
                break;
        }
    };
})(jQuery);

//handlebars的helper
$(function () {
    /**
     * handlebars分支判断Helper
     * {{#compare people.name '==' 'peter'}}
     * 他的名字是peter
     * {{else}}
     * 他的名字不是peter
     * {{/compare}}
     */
    Handlebars.registerHelper('compare', function (left, operator, right, options) {
        if (arguments.length < 3) {
            throw new Error('Handlerbars Helper "compare" needs 2 parameters');
        }
        var operators = {
            '==': function (l, r) {
                return l == r;
            },
            '===': function (l, r) {
                return l === r;
            },
            '!=': function (l, r) {
                return l != r;
            },
            '!==': function (l, r) {
                return l !== r;
            },
            '<': function (l, r) {
                return l < r;
            },
            '>': function (l, r) {
                return l > r;
            },
            '<=': function (l, r) {
                return l <= r;
            },
            '>=': function (l, r) {
                return l >= r;
            },
            'typeof': function (l, r) {
                return typeof l == r;
            }
        };

        if (!operators[operator]) {
            throw new Error('Handlerbars Helper "compare" doesn\'t know the operator ' + operator);
        }

        var result = operators[operator](left, right);

        if (result) {
            return options.fn(this);
        } else {
            return options.inverse(this);
        }
    });

    /**
     * 格式化日期Helper
     * {{formatDate createDate pattern="yyyy-MM-dd HH:mm:ss"}}</br>
     *{{formatDate createDate pattern="HH:mm"}}</br>
     *{{formatDate createDate pattern="E"}}</br>
     */
    Handlebars.registerHelper("formatDate", function (dtParam, options) {
        var dateArray;
        var timeArray;
        var dt;
        if(typeof dtParam == 'number'){
            dt = new Date(Number(dtParam));
        }else{
            if (dtParam.indexOf('T') >= 0) {
                dateArray = dtParam.split('T')[0].split('-');
                timeArray = dtParam.split('T')[1].split(':');
            } else {
                dateArray = dtParam.split(' ')[0].split('-');
                timeArray = dtParam.split(' ')[1].split(':');
            }
            dt = new Date(dateArray[0], dateArray[1] - 1, dateArray[2], timeArray[0], timeArray[1], timeArray[2]);
        }

        var pattern = options.hash.pattern;//获取规则参数

        var o = {
            "M+": dt.getMonth() + 1, //月份
            "d+": dt.getDate(), //日
            "h+": dt.getHours() % 12 == 0 ? 12 : dt.getHours() % 12, //小时
            "H+": dt.getHours(), //小时
            "m+": dt.getMinutes(), //分
            "s+": dt.getSeconds(), //秒
            "q+": Math.floor((dt.getMonth() + 3) / 3), //季度
            "S": dt.getMilliseconds() //毫秒
        };
        var week = {
            "0": "周日",
            "1": "周一",
            "2": "周二",
            "3": "周三",
            "4": "周四",
            "5": "周五",
            "6": "周六"
        };
        if (/(y+)/.test(pattern)) {
            pattern = pattern.replace(RegExp.$1, (dt.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        if (/(E+)/.test(pattern)) {
            pattern = pattern.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "\u661f\u671f" : "\u5468") : "") + week[dt.getDay() + ""]);
        }
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(pattern)) {
                pattern = pattern.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            }
        }

        return pattern;
    });
});
