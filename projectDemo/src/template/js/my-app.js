// Initialize your app
var myApp = new Framework7();

// Export selectors engine
var $$ = Dom7;
var mySite = 'http://127.0.0.1:8888/';

// 异步模板解析
var tpl = $$('#t-customer-list').html();
var customerListTplCompile = Template7.compile(tpl);
var tpl = $$('#t-customer-info').html();
var customerInfoTplCompile = Template7.compile(tpl);
var tpl = $$('#t-linker-info').html();
var linkerInfoTplCompile = Template7.compile(tpl);

function getData(query, data) {
    return new Promise(function(resolve, reject) {
        $$.ajax({
            url: mySite + query,
            data: data,
            dataType: "json",
            crossDomain: true,
            success: function(res) {
                if (res.data.length > 0) {
                    resolve(res);
                } else {
                    reject("no-data");
                }
            }
        })
    });
}

function toDo(query, data) {
    return new Promise(function(resolve, reject) {
        $$.ajax({
            url: mySite + query,
            data: data,
            dataType: "json",
            crossDomain: true,
            success: function(res) {
                if (res.status === "ok") {
                    resolve(res);
                } else {
                    reject("fail");
                }
            }
        })
    });
}

function leftPanel() {
    $$("#l-linkman").on("click", function() {
        myApp.closePanel();
        $$(".view-linkman").show();
        $$(".view-main").hide();

        //mainView.router.load({
        //content :  customerInfoTplCompile({ data : [{}],type:"add"}),
        //pushState : true,
        //reload : true
        //});
    });

    $$("#l-customer").on("click", function() {
        myApp.closePanel();
        $$(".view-main").show();
        $$(".view-linkman").hide();

        //mainView.router.load({
        //content :  customerInfoTplCompile({ data : [{}],type:"add"}),
        //pushState : true,
        //reload : true
        //});
    });
}

(function init() {
    leftPanel();
})();


// Add view
var mainView = myApp.addView('.view-main', {
    // Because we use fixed-through navbar we can enable dynamic navbar
    dynamicNavbar: true
});

var linkerView = myApp.addView('.view-linkman', {
    // Because we use fixed-through navbar we can enable dynamic navbar
    dynamicNavbar: true
});


// Callbacks to run specific code for specific pages, for example for About page:
myApp.onPageInit('index', function(page) {
    // run createContentPage func after link was clicked
    getData("allCustomers")
        .then(function(data) {
            //渲染customer-list页
            $$("#l-customer-list").html(customerListTplCompile(data));
            $$("#l-loading-wrapper").remove();
            //点击进入info页
            $$("#l-customer-list").on("click", "li", function() {
                getData("getCustomerInfo", {
                    _id: $$(this).data("id")
                }).then(function(data) {
                    console.log(data);
                    mainView.router.loadContent(customerInfoTplCompile(data));
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
                mainView.router.loadContent(customerInfoTplCompile({
                    data: [{}],
                    type: "add"
                }));
            });

        });
}).trigger();

myApp.onPageInit('customer-info', function(page) {
    $$('#customer-info form.ajax-submit').on('submitted', function(e) {
        var xhr = e.detail.xhr; // actual XHR object
        var data = e.detail.data; // Ajax response from action file
        data && (data = JSON.parse(data));
        console.log(data);
        if (data._id) {
            $$("#customer-info ._id").val(data._id);
        }
    });

    $$(".t-customer-back").on("click",function(){
         mainView.router.refreshPreviousPage();
         setTimeout(function(){
            mainView.router.back();
         },100);
    });
});


/**************************************************************************** linker*/

myApp.onPageInit('link-index', function(page) {
    // run createContentPage func after link was clicked
    getData("allLinkman")
        .then(function(data) {
            //渲染customer-list页
            $$("#l-link-list").html(customerListTplCompile(data));
            $$("#l-loading-wrapper").remove();
            //点击进入info页
            $$("#l-link-list").on("click", "li", function() {
                getData("getLinkmanInfo", {
                    _id: $$(this).data("id")
                }).then(function(data) {
                    console.log(data);
                    linkerView.router.loadContent(linkerInfoTplCompile(data));
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
                getData("getAllCustomerNames", { })
                .then(function(data) {
                    console.log(data);
                    linkerView.router.loadContent(linkerInfoTplCompile(data));
                }, function(res) {
                    if (res == "no-data") {
                        console.warn(res);
                    }
                });
                
            });

        });
}).trigger();


myApp.onPageInit('linker-info', function(page) {
    $$('#linker-info form.ajax-submit').on('submitted', function(e) {
        var xhr = e.detail.xhr; // actual XHR object
        var data = e.detail.data; // Ajax response from action file
        data && (data = JSON.parse(data));
        console.log(data);
        if (data._id) {
            $$("#linker-info ._id").val(data._id);
        }
    });

    $$(".t-linker-back").on("click",function(){
         linkerView.router.refreshPreviousPage();
         setTimeout(function(){
            linkerView.router.back();
         },100);
    });
});
