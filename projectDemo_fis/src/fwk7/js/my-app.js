// Initialize your app
var myApp = new Framework7({
    precompileTemplates: true
});

// Export selectors engine
var $$ = Dom7;
var mySite = 'http://127.0.0.1:8888/';

function getData(query, data) {
    return new Promise(function (resolve, reject) {
        $$.ajax({
            url: mySite + query,
            data: data,
            dataType: "json",
            crossDomain: true,
            success: function (res) {
                if (res.data) {
                    resolve(res);
                } else {
                    reject("no-data");
                }
            }
        })
    });
}

function getRole() {
    return new Promise(function (resolve, reject) {
        $$.ajax({
            url: mySite + "getRole",
            data: data,
            dataType: "json",
            crossDomain: true,
            success: function (res) {
                if (res.data) {
                    resolve(res);
                } else {
                    reject("no-data");
                }
            }
        })
    });
}

function toDo(query, data) {
    return new Promise(function (resolve, reject) {
        $$.ajax({
            url: mySite + query,
            data: data,
            dataType: "json",
            crossDomain: true,
            success: function (res) {
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
    var $index = $$(".view-main");
    var $linker = $$(".view-linkman");
    var $product = $$(".view-product");
    var $order = $$(".view-order");

    var $views = $$(".view");
    var $panel = $$(".panel-left");

    $panel.on("click", ".l-section", function () {
        myApp.closePanel();
        var page = $$(this).data("page");
        $views.hide();
        $$(".view[data-page=" + page + "]").show();
    });


}

(function init() {
    leftPanel();
})();

__inline('view-index.js');
__inline('view-linker.js');
__inline('view-product.js');
__inline('view-order.js');
__inline('view-user.js');
