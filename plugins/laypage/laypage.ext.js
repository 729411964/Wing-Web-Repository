//$('.table').layPage({searchConds:'',dfeaultItem:dsfdsfsd});

(function ($) {
    var defaults = {
        pageSize: 10,  // 默认一页最多为10条。
        hasCheckBox:false  // 判断表格是否有checkbox，默认为无。
    };

    var LayPage = function (elem, options) {
        this.$datatable = $(elem);
        this.conds = options.conds || {};
        this.options = $.extend({}, defaults, options);
        this.scriptData = this.$datatable.children('tbody:first').html();
        this._init(1);
    };

    LayPage.prototype._init = function (pageNo,searchConds) {
        this.$datatable.children('tbody:first').html(this.scriptData);
        var self = this;
        this.conds = $.extend(this.conds, searchConds, {pageNo: pageNo, pageSize: this.options.pageSize});
        $.ajax({
            url: this.$datatable.data('url'),
            type: 'POST',
            data: this.conds,
            dataType: 'json'
        }).done(function (data) {
            if(data.success){
                //动态填充内容
                self.$datatable.children('tbody:first').handlebars(self.$datatable.children('tbody:first').children('script[type="text/x-handlebars-template"]'), data, 'html');
                if(self.options.hasCheckBox){
                    self.$datatable.find("thead:first>tr>th>input[class='check-all']").prop("checked",false); //将全选框的状态设为未选中
                    self.$datatable.siblings('.btn-area').find(".product-num>span.num-unit").text(self.$datatable.find(".unit:first").text());
                }

                laypage({
                    cont: self.$datatable.siblings('.pagination'), //容器。值支持id名、原生dom对象，jquery对象。【如该容器为】：<div id="page1"></div>
                    pages: Math.ceil(data.recordsTotal /self.conds.pageSize), //通过后台拿到的总页数
                    curr: pageNo, //当前页
                    skip: true,
                    showSearchResultHint: true,
                    showTotalRecords: true,
                    totalRecords: data.recordsTotal,
                    jump: function (obj, first) { //触发分页后的回调
                        if (!first) { //点击跳页触发函数自身，并传递当前页：obj.curr
                            if(self.options.hasCheckBox){
                                self.$datatable.siblings('.btn-area').find(".total-price>span").text(0.00);
                                self.$datatable.siblings('.btn-area').find(".product-num>span.num-text").text(0);
                            }
                            self._init(obj.curr);
                        }
                    }
                });
            } else{
                layer.msg(self.$datatable.data('msg-error'),{icon:'fail'});
            }
        }).fail(function() {
            layer.msg(self.$datatable.data('msg-fail'),{icon:'fail'});
            })
    };

    $.fn.layPage = function (options,param) {
        if (typeof options == 'string') return $.fn.layPage.methods[options](this, param);
        return this.each(function () {
            if (!$(this).data('plugin_laypage')) {
                $(this).data('plugin_laypage', new LayPage(this, options));
            }
        });
    };

    $.fn.layPage.methods = {
        //重新加载数据
        reload: function (table, searchConds) {
            return $(table).data('plugin_laypage')._init(1, searchConds);
        },
        //刷新当页数据
        refresh: function (table, searchConds) {
            var dataTable = $(table).data('plugin_laypage');
            return dataTable._init(dataTable.conds.pageNo, searchConds);
        }
    };
})(jQuery);

