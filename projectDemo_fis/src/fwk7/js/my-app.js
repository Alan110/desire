// Initialize your app
var myApp = new Framework7({
    precompileTemplates: true
});

// Export selectors engine
var $$ = Dom7;
var mySite = 'http://127.0.0.1:8888/';

function getData(query, data) {
    return new Promise(function(resolve, reject) {
        $$.ajax({
            url: mySite + query,
            data: data,
            dataType: "json",
            crossDomain: true,
            success: function(res) {
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
    var $index = $$(".view-main");
    var $linker = $$(".view-linkman");
    var $product = $$(".view-product");
    var $order = $$(".view-order");

    $$("#l-linkman").on("click", function() {
        myApp.closePanel();
        $linker.show();
        $index.hide();
        $product.hide();
        $order.hide();
    });

    $$("#l-customer").on("click", function() {
        myApp.closePanel();
        $index.show();
        $linker.hide();
        $product.hide();
        $order.hide();
    });

    $$("#l-product").on("click", function() {
        myApp.closePanel();
        $product.show();
        $index.hide();
        $linker.hide();
        $order.hide();
    });

    $$("#l-order").on("click", function() {
        myApp.closePanel();
        $order.show();
        $product.hide();
        $index.hide();
        $linker.hide();
    });
}

(function init() {
    leftPanel();
})();

__inline('view-index.js');
__inline('view-linker.js');
__inline('view-product.js');
__inline('view-order.js');
