
var orderView = myApp.addView('.view-order', {
    // Because we use fixed-through navbar we can enable dynamic navbar
    dynamicNavbar: true
});

myApp.onPageInit('order-index', function(page) {
    // run createContentPage func after link was clicked
    getData("allOrders")
        .then(function(data) {
            //渲染customer-list页
            if (role == 1) {
               data.data.forEach(function(el,index){
                   el["admin"] = 1;
               });
            }
            $$("#l-order-list").html(Template7.templates.tOrderList(data));
            $$("#l-loading-wrapper-order").remove();
            //点击进入info页
            $$("#l-order-list").on("click", "li", function() {
                getData("getOrderInfo", {
                    _id: $$(this).data("id")
                }).then(function(data) {
                    console.log(data);
                    data.data[0]['title'] = '订单详情';
                    orderView.router.load({
                        template :Template7.templates.tOrderInfo,
                        context : data
                    });
                }, function(res) {
                    if (res == "no-data") {
                        console.warn(res);
                    }
                });
            });

            // 点击删除,禁止冒泡,只用js api 删除,否则会触发li的点击
            $$("#l-order-list .swipeout-delete").on("click", function(e) {
                var li = $$(this).parent().parent();
                myApp.confirm('您确定删除吗?', '删除该用户',
                    function() {
                        toDo("removeOrder", {
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

            //添加order
            $$("#l-add-order").on("click", function() {
                getData("getAllInfo",{})
                .then(function(data) {
                    console.log(data);
                    data.data[0]['title'] = '创建订单';
                    orderView.router.load({
                        template :Template7.templates.tOrderInfo,
                        context : data
                    });
                }, function(res) {
                    if (res == "no-data") {
                        console.warn(res);
                    }
                });
                
            });

        });
}).trigger();


myApp.onPageInit('order-info', function(page) {
    var contextData = page.context.data[0];
    var plist = contextData.select_products;
    var list = $$("#t-order-selectProductList li");

    $$('#l-add-saveOrder').on('click', function(e) {
        var $self = $$(this);
        setTimeout(function(){
            page.view.router.refreshPreviousPage()
            $self.val("提交中...").attr("disabled","disabled");
        },0);
        setTimeout(function(){
            $self.val("创建成功");
        },300);
        setTimeout(function(){
            page.view.router.back();
        },600);
    });

    $$(".t-order-plist").on("DOMNodeInserted",function(){
        plist = [];
        var formData = myApp.formToJSON('#t-order-form');
        for(var i = 0 , len = contextData.allProductNames.length ; i < len ; i++ ){
            for( var j = 0, lenj = formData.productId.length ; j < lenj ; j++){
                if (contextData.allProductNames[i]._id == formData.productId[j]){
                    plist.push(contextData.allProductNames[i]);
                }
            }
        }
        $$("#t-order-selectProductList").html(Template7.templates.tProductOrderList({data:plist,json_data:JSON.stringify(plist)}));
        
        setTimeout(function(){
            list = $$("#t-order-selectProductList li");
            $$("#t-order-selectProductList input").off("change",count).on("change",count);
        },0);
        console.log(plist);
    });


    function count(){
        var sum = 0;
        for(var i = 0 ; i< list.length ; i++){
            var price = $$(list[i]).find("input[data-use=real_price]").val() || 0;
            var size  = $$(list[i]).find("input[data-use=size]").val() || 0;
            plist[i]["real_price"] = price;
            plist[i]["size"] = size;
            sum += parseInt(price) * parseInt(size);
        }
        $$("#select_products_json").val(JSON.stringify(plist));
        $$("#select_products_allPrice").val(sum);
    }


    $$("#t-order-selectProductList input").on("input",count);

    $$("#l-add-saveOrder").on("click",function(e){
        e.preventDefault();

        count();
        console.log(plist);

        $$.ajax({
            url : mySite + "saveOrder",
            dataType : "json",
            data :  myApp.formToJSON('#t-order-form'),
            method : "POST",
            success : function(res){
               console.log(res) ;
            }
        });
        return false;
        
    });
 
});
