var mainView = myApp.addView('.view-main', {
    // Because we use fixed-through navbar we can enable dynamic navbar
    dynamicNavbar: true
});


// Callbacks to run specific code for specific pages, for example for About page:
myApp.onPageInit('index', function(page) {
    // run createContentPage func after link was clicked
    getData("allCustomers")
        .then(function(data) {
            //渲染customer-list页
            $$("#l-customer-list").html(Template7.templates.tCustomerList(data));
            $$("#l-loading-wrapper").remove();
            //点击进入info页
            $$("#l-customer-list").on("click", "li", function() {
                getData("getCustomerInfo", {
                    _id: $$(this).data("id")
                }).then(function(data) {
                    console.log(data);
                    data.data[0]['title'] = '客户详情';
                    mainView.router.loadContent(Template7.templates.tCustomerInfo(data));
                }, function(res) {
                    if (res == "no-data") {
                        console.warn(res);
                    }
                });
            });

            // 点击删除,禁止冒泡,只用js api 删除,否则会触发li的点击
            $$("#l-customer-list .swipeout-delete").on("click", function(e) {
                var li = $$(this).parent().parent();
                myApp.confirm('您确定删除吗?', '删除该用户',
                    function() {
                        toDo("removeCustomer", {
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

            //添加用户
            $$("#l-add-customer").on("click", function() {
                getData("getAllLinkerNames").then(function(data){
                    data.data[0] = {title:"添加用户"};
                    mainView.router.loadContent(Template7.templates.tCustomerInfo(data));
                });
            });

        });
}).trigger();

myApp.onPageInit('customer-info', function(page) {

    $$('#l-add-saveCustomer').on('click', function(e) {
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

    //添加linker
    $$("#l-add-link").on("click", function() {
        var _id = $$("#customer-info ._id").val();
        var name = $$("#customer-info .name").val();
        if( !_id  && !name){
            myApp.alert('请先创建客户名' , "warn");
            return ;
        }
        var data = { 
            data : [
                {
                    allCustomerNames : [ {_id : _id ,name :name ,select : true} ]
                }
            ] 
        };
        mainView.router.loadContent(Template7.templates.tLinkerInfo(data));
    });

});
