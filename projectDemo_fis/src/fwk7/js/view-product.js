
var productView = myApp.addView('.view-product', {
    // Because we use fixed-through navbar we can enable dynamic navbar
    dynamicNavbar: true
});

myApp.onPageInit('product-index', function(page) {
    // run createContentPage func after link was clicked
    getData("allProducts")
        .then(function(data) {
            //渲染customer-list页
            $$("#l-product-list").html(Template7.templates.tCustomerList(data));
            $$("#l-loading-wrapper").remove();
            //点击进入info页
            $$("#l-product-list").on("click", "li", function() {
                getData("getProductInfo", {
                    _id: $$(this).data("id")
                }).then(function(data) {
                    console.log(data);
                    data.data[0]['title'] = '产品详情';
                    productView.router.loadContent(Template7.templates.tProductInfo(data));
                }, function(res) {
                    if (res == "no-data") {
                        console.warn(res);
                    }
                });
            });

            // 点击删除,禁止冒泡,只用js api 删除,否则会触发li的点击
            $$("#l-product-list .swipeout-delete").on("click", function(e) {
                var li = $$(this).parent().parent();
                myApp.confirm('您确定删除吗?', '删除该用户',
                    function() {
                        toDo("removeProduct", {
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

            //添加product
            $$("#l-add-product").on("click", function() {
                productView.router.loadContent(Template7.templates.tProductInfo({
                    data: [{title:"添加产品"}],
                    type: "add"
                }));
            });


        });
}).trigger();


myApp.onPageInit('product-info', function(page) {
    $$('#l-add-saveProduct').on('click', function(e) {
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
