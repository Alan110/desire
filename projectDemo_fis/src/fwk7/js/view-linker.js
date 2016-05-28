
var linkerView = myApp.addView('.view-linkman', {
    // Because we use fixed-through navbar we can enable dynamic navbar
    dynamicNavbar: true
});

myApp.onPageInit('link-index', function(page) {
    // run createContentPage func after link was clicked
    getData("allLinkman")
        .then(function(data) {
            //渲染customer-list页
            $$("#l-link-list").html(Template7.templates.tCustomerList(data));
            $$("#l-loading-wrapper").remove();
            //点击进入info页
            $$("#l-link-list").on("click", "li", function() {
                getData("getLinkmanInfo", {
                    _id: $$(this).data("id")
                }).then(function(data) {
                    console.log(data);
                    data.data[0]['title'] = '联系人详情';
                    linkerView.router.loadContent(Template7.templates.tLinkerInfo(data));
                }, function(res) {
                    if (res == "no-data") {
                        console.warn(res);
                    }
                });
            });

            // 点击删除,禁止冒泡,只用js api 删除,否则会触发li的点击
            $$("#l-link-list .swipeout-delete").on("click", function(e) {
                var li = $$(this).parent().parent();
                myApp.confirm('您确定删除吗?', '删除该用户',
                    function() {
                        toDo("removeLinkman", {
                            _id: li.data("id")
                        }).then(function() {
                            myApp.swipeoutDelete(li);
                        }, function() {
                            myApp.alert("删除失败");
                        })
                    },
                    function() {
                        myApp.swipeoutClose(li);
                    }
                );
                e.stopPropagation();
                e.preventDefault();
                return false;
            })

            //添加linker
            $$("#l-add-link").on("click", function() {
                var _id = $$("#customer-info").find("._id").val();
                getData("getAllCustomerNames", {_id : _id})
                .then(function(data) {
                    console.log(data);
                    data.data[0]['title'] = '添加联系人';
                    linkerView.router.loadContent(Template7.templates.tLinkerInfo(data));
                }, function(res) {
                    if (res == "no-data") {
                        console.warn(res);
                    }
                });
                
            });

        });
}).trigger();


myApp.onPageInit('linker-info', function(page) {
    $$('#l-add-saveLinker').on('click', function(e) {
        var $self = $$(this);
        setTimeout(function(){
            page.view.router.refreshPreviousPage()
            $self.val("提交中...").attr("disabled","disabled");
        },0);
        setTimeout(function(){
            $self.val("提交成功");
        },300);
        setTimeout(function(){
            page.view.router.back();
        },600);
    });

});


