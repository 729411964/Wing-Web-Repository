
/*!
 
 @Name : layPage v1.3- 分页插件
 @Author: 贤心
 @Site：http://sentsin.com/layui/laypage
 @License：MIT
 
 */

;!function(){
"use strict";

function laypage(options){
    //var skin = 'laypagecss';
    //laypage.dir = 'dir' in laypage ? laypage.dir : Page.getpath + '/skin/laypage.css';
    new Page(options);
    //if(laypage.dir && !doc[id](skin)){
    //    Page.use(laypage.dir, skin);
    //}
}

laypage.v = '1.3';

var doc = document, id = 'getElementById', tag = 'getElementsByTagName';
var index = 0, Page = function(options){
    var that = this;
    var conf = that.config = options || {};
    conf.item = index++;
    that.render(true);
};

Page.on = function(elem, even, fn){
    elem.attachEvent ? elem.attachEvent('on'+ even, function(){
        fn.call(elem, window.even); //for ie, this指向为当前dom元素
    }) : elem.addEventListener(even, fn, false);
    return Page;
};

Page.getpath = (function(){
    var js = document.scripts, jsPath = js[js.length - 1].src;
    return jsPath.substring(0, jsPath.lastIndexOf("/") + 1);
}());

Page.use = function(lib, id){
    var link = doc.createElement('link');
    link.type = 'text/css';
    link.rel = 'stylesheet';
    link.href = laypage.dir;
    id && (link.id = id);
    doc[tag]('head')[0].appendChild(link);
    link = null;
};

//判断传入的容器类型
Page.prototype.type = function(){
    var conf = this.config;
    if(typeof conf.cont === 'object'){
        return conf.cont.length === undefined ? 2 : 3;
    }
};

//分页视图
Page.prototype.view = function(){
    var that = this, conf = that.config, view = [], dict = {};
    conf.pages = conf.pages|0;
    conf.curr = (conf.curr|0) || 1;
    conf.groups = 'groups' in conf ? (conf.groups|0) : 5;
    conf.first = 'first' in conf ? conf.first : '1';
    conf.last = 'last' in conf ? conf.last : conf.pages;
    conf.prev = 'prev' in conf ? conf.prev : '上一页';
    conf.next = 'next' in conf ? conf.next : '下一页';
    conf.totalRecords = conf.totalRecords||0;
    if(conf.showSearchResultHint && conf.totalRecords === 0){
        return '<div class="not-result-area"><div class="not-result">没有符合条件的条目，请重新输入条件，进行查询！</div></div>'
    }

    if(conf.pages <= 1){
        return '';
    }
    if(conf.groups > conf.pages){
        conf.groups = conf.pages;
    }


    //计算当前组
    dict.index = Math.ceil((conf.curr + ((conf.groups > 1 && conf.groups !== conf.pages) ? 1 : 0))/(conf.groups === 0 ? 1 : conf.groups));

   //当前页首页，则输出不可点击上一页
    if(conf.prev){
        if(conf.curr === 1){
            view.push('<span class="laypage_prev disabled">'+ conf.prev +'</span>');
        }else{
            view.push('<a href="javascript:;" class="laypage_prev" data-page="'+ (conf.curr - 1) +'">'+ conf.prev +'</a>');
        }
    }

    //当页码<=9页时，输出全部页码
    if(conf.pages <= 9){
        var totalPages = conf.pages;
        for(var i= 1;i<=totalPages;i++){
            if(conf.curr == i){
                view.push('<span class="laypage_curr" '+ (/^#/.test(conf.skin) ? 'style="background-color:'+ conf.skin +'"' : '') +'>'+ i +'</span>');
            } else {
                view.push('<a href="javascript:;" data-page="'+ i +'">'+ i +'</a>');
            }
        }
    }else{
        //当前组非首组，则输出首页
        if(dict.index > 1 && conf.first && conf.groups !== 0){
            if(conf.curr == 5){
                view.push('<a href="javascript:;" class="laypage_first" data-page="1"  title="首页">'+ conf.first +'</a><a href="javascript:;" data-page="2"  title="首页">2</a>');
            }else{
                view.push('<a href="javascript:;" class="laypage_first" data-page="1"  title="首页">'+ conf.first +'</a><span>...</span>');
                if(conf.curr === (conf.pages-3)){
                    view.push('<a href="javascript:;"  data-page="'+ (conf.pages-6) +'">'+ (conf.pages-6) +'</a>');
                }
            }
        }

        //当前页为大于>总页数-3时，添加conf.pages-6，conf.pages-5，为了在...后凑够9页
        if(conf.curr > (conf.pages -3)){
            view.push('<a href="javascript:;" data-page="'+ (conf.pages-6) +'">'+ (conf.pages-6) +'</a><a href="javascript:;" data-page="'+ (conf.pages-5) +'">'+ (conf.pages-5) +'</a>');
        }

        //输出当前页组
        dict.poor = Math.floor((conf.groups-1)/2);
        dict.start = dict.index > 1 ? conf.curr - dict.poor : 1;
        dict.end = dict.index > 1 ? (function(){
            var max = conf.curr + (conf.groups - dict.poor - 1);
            return max > conf.pages ? conf.pages : max;
        }()) : conf.groups;
        if(dict.end - dict.start < conf.groups - 1){ //最后一组状态
            dict.start = dict.end - conf.groups + 1;
        }
        for(; dict.start <= dict.end; dict.start++){
            if(dict.start === conf.curr){
                view.push('<span class="laypage_curr" '+ (/^#/.test(conf.skin) ? 'style="background-color:'+ conf.skin +'"' : '') +'>'+ dict.start +'</span>');
            } else {
                view.push('<a href="javascript:;" data-page="'+ dict.start +'">'+ dict.start +'</a>');
            }
        }

        //当前页为>3页时，添加6，7页，为了在...前凑够9页
        if(conf.curr <= 4){
            view.push('<a href="javascript:;" data-page="'+ 6 +'">'+ 6 +'</a><a href="javascript:;" data-page="'+ 7 +'">'+ 7 +'</a>');
        }

        //总页数大于连续分页数，且当前组最大页小于总页，输出尾页
        if(conf.pages > conf.groups && dict.end < conf.pages && conf.last && conf.groups !== 0){
            if(conf.curr === (conf.pages-3)){
                view.push('<a href="javascript:;" class="laypage_last" title="尾页"  data-page="'+ conf.pages +'">'+ conf.last +'</a>');
            }else if(conf.curr === (conf.pages-4)){
                view.push('<a href="javascript:;" data-page="'+ (conf.pages-1) +'">'+ (conf.pages-1) +'</a><a href="javascript:;" class="laypage_last" title="尾页"  data-page="'+ conf.pages +'">'+ conf.last +'</a>');
            }else{
                view.push('<span>...</span><a href="javascript:;" class="laypage_last" title="尾页"  data-page="'+ conf.pages +'">'+ conf.last +'</a>');
            }
        }
    }

    //当前页不为尾页时，输出下一页
    dict.flow = !conf.prev && conf.groups === 0;

    if(conf.next || dict.flow){
       if(conf.curr != conf.pages){
           view.push((function(){
               return (dict.flow && conf.curr === conf.pages)
                   ? '<span class="page_nomore" title="&#x5DF2;&#x6CA1;&#x6709;&#x66F4;&#x591A;">'+ conf.next +'</span>'
                   : '<a href="javascript:;" class="laypage_next" data-page="'+ (conf.curr + 1) +'">'+ conf.next +'</a>';
           }()));
       } else{
           view.push((function(){
               return (dict.flow && conf.curr === conf.pages)
                   ? '<span class="page_nomore" title="&#x5DF2;&#x6CA1;&#x6709;&#x66F4;&#x591A;">'+ conf.next +'</span>'
                   : '<span class="laypage_next disabled">'+ conf.next +'</span>';
           }()));
       }
    }

    return '<div name="laypage'+ laypage.v +'" class="laypage_main clearfix laypageskin_'+ (conf.skin ? (function(skin){
        return /^#/.test(skin) ? 'molv' : skin;
    }(conf.skin)) : 'default') +'" id="laypage_'+ that.config.item +'">'+ view.join('') + function(){
            var totalNumberStr = conf.showTotalRecords ? '<span class="total-branches">共'+conf.totalRecords+'条，</span>':'';
            return conf.skip ? totalNumberStr+'<span class="total-pages">'+conf.pages+'页</span><span class="laypage_total"><label>到</label><input type="text" min="1" onkeyup="this.value=this.value.replace(/\\D/, \'\');" class="laypage_skip"><label>页</label>' + '<button type="button" class="laypage_btn">确定</button></span>':'';
    }() +'</div>';
};

//跳页
Page.prototype.jump = function(elem){
    if(!elem) return;
    var that = this, conf = that.config, childs = elem.children;
    var btn = elem[tag]('button')[0];
    var input = elem[tag]('input')[0];
    for(var i = 0, len = childs.length; i < len; i++){
        if(childs[i].nodeName.toLowerCase() === 'a'){
            Page.on(childs[i], 'click', function(){
                var curr = this.getAttribute('data-page')|0;
                conf.curr = curr;
                that.render();
                
            });
        }
    }
    if(btn){
        Page.on(btn, 'click', function(){
            var curr = input.value.replace(/\s|\D/g, '')|0;
            if(curr){
                if(curr <= conf.pages){
                    conf.curr = curr;
                }else{
                    conf.curr = conf.pages;
                }
                that.render();
            }
        });
    }
    //被选中页回显
    input.value = conf.curr;
};

//渲染分页
Page.prototype.render = function(load){
    var that = this, conf = that.config, type = that.type();
    var view = that.view();
    if(type === 2){
        conf.cont.innerHTML = view;
    } else if(type === 3){
        conf.cont.html(view);
    } else {
        doc[id](conf.cont).innerHTML = view;
    }
    conf.jump && conf.jump(conf, load);
    that.jump(doc[id]('laypage_' + conf.item));
    if(conf.hash && !load){
        location.hash = '!'+ conf.hash +'='+ conf.curr;
    }
};

//for 页面模块加载、Node.js运用、页面普通应用
"function" === typeof define ? define(function() {
    return laypage;
}) : "undefined" != typeof exports ? module.exports = laypage : window.laypage = laypage;

}();