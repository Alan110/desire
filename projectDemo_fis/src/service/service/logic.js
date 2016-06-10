var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var dbUrl = 'mongodb://localhost:27017/liuqili';

function getTime(){
    var date = new Date();
    return '' + date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate() ;
}

function router(app) {
    
    app.get("/getRole",function(req,res){
        if(req.session.uid ) {
            MongoClient.connect(dbUrl, function (err, db) {
                var user = db.collection('user');
                user.find({_id:ObjectID(req.session.uid)}).toArray(function (err, result) {
                    if (result.length > 0 ) {
                        res.send({
                            status:"login",
                            "user":result[0]
                        });
                    }else{
                        res.send({status : "error"});
                    }
                });

            });
        }else{
            res.send({status : "redirect"});
        }
        
    });

    app.post("/login",function(req,res){
            MongoClient.connect(dbUrl, function (err, db) {
                var user = db.collection('user');
                var userName = req.body.name || null;
                var userPswd = req.body.pswd;
                if(!userName || !userPswd){
                    res.send({status : "error"});
                    return;
                }
                user.find({name:userName}).toArray(function (err, result) {
                    if (result.length > 0 && result[0].pswd == userPswd) {
                        req.session.uid = result[0]._id;
                        res.send({status:"login"});
                    }else{
                        res.send({status : "error"});
                    }
                });
            });
            
    });
    
    app.get('/allCustomers', function (req, res) {
        MongoClient.connect(dbUrl, function (err, db) {
            var customer = db.collection('customer');
            customer.find().toArray(function (err, result) {
                res.send({
                    data: result
                });
            });
        });
    });

    app.get('/getCustomerInfo', function (req, res) {
        MongoClient.connect(dbUrl, function (err, db) {
            var customer = db.collection('customer');
            var linker = db.collection('linker');
            var resData = {};
            //console.log(req.query);
            var t1 = new Promise(function (resolve, reject) {
                customer.find(ObjectID(req.query._id)).toArray(function (err, result) {
                    if (result.length < 1) {
                        resolve({
                            state: "none"
                        });
                    } else {
                        resData.data = result;
                        resolve();
                    }
                });
            });

            var t2 = new Promise(function (resolve, reject) {
                linker.find().toArray(function (err, result) {
                    result.forEach(function (el, index) {
                        if (resData.data && resData.data[0]["linker[]"]) {
                            if ( typeof resData.data[0]["linker[]"] == "string") {
                                resData.data[0]["linker[]"] = [resData.data[0]["linker[]"]];
                            }
                            resData.data[0]["linker[]"].forEach(function (jl, jndex) {
                                if (jl == el._id) {
                                    result[index].select = true;
                                }
                            });
                        }
                    })
                    resData.allLinkerNames = result;
                    resolve();
                });
            });

            Promise.all([t1, t2]).then(function () {
                res.send(resData);
            });
        });
    });

    app.get('/getAllLinkerNames', function (req, res) {
        MongoClient.connect(dbUrl, function (err, db) {
            var linker = db.collection('linker');
            var resData = {
                data: []
            };

            linker.find().toArray(function (err, result) {
                resData.allLinkerNames = result;
                res.send(resData);
            });

        });
    });



    app.post('/saveCustomer', function (req, res) {
        MongoClient.connect(dbUrl, function (err, db) {
            var customer = db.collection('customer');
            var _id = req.body._id;
            var name = req.body.name;
            if (_id) {
                customer.find({
                    "_id": new ObjectID(_id)
                }).toArray(function (err, result) {
                    if (result.length > 0) {
                        if (result[0].name !== name) {
                            customer.find({
                                "name": name
                            }).toArray(function (err, result2) {
                                if (result2.length > 0) {
                                    //更新的名字已存在
                                    res.send({
                                        state: "e"
                                    });
                                    return;
                                }
                            });
                        }
                        delete req.body._id;
                        customer.update({
                            "_id": new ObjectID(_id)
                        }, req.body);
                        res.send({
                            state: "ok"
                        });

                    } else {
                        //没有找到这个人, 不能更新信息
                        res.send({
                            state: "n"
                        });
                    }

                });

            } else {
                //id 不存在添加用户
                req.body._id = new ObjectID();
                customer.insert(req.body);
                res.send({
                    "_id": req.body._id
                });
            }
        });
    });

    app.get('/removeCustomer', function (req, res) {
        MongoClient.connect(dbUrl, function (err, db) {
            var customer = db.collection('customer');
            var _id = req.query._id;
            _id && customer.remove({
                "_id": new ObjectID(_id)
            })
            res.send({
                status: "ok"
            });
        });
    });

    /************************************************************************* linkman*/
    app.get('/allLinkman', function (req, res) {
        MongoClient.connect(dbUrl, function (err, db) {
            var customer = db.collection('linker');
            customer.find().toArray(function (err, result) {
                res.send({
                    data: result
                });
            });
        });
    });

    app.get('/getLinkmanInfo', function (req, res) {
        MongoClient.connect(dbUrl, function (err, db) {
            var linker = db.collection('linker');
            var customer = db.collection('customer');
            //console.log(req.query);
            linker.find(ObjectID(req.query._id)).toArray(function (err, link) {
                if (link.length > 0) {
                    customer.find({}, {
                        name: true
                    }).toArray(function (err, allCustomerNames) {
                        //找到name,并放到第一位
                        for (var i = 0; i < allCustomerNames.length; i++) {
                            if (allCustomerNames[i]._id.id == link[0].customerId.id) {
                                var temp = allCustomerNames[i];
                                temp.select = true;
                                allCustomerNames[i] = allCustomerNames[0];
                                allCustomerNames[0] = temp;
                            }
                        }
                        link[0]["allCustomerNames"] = allCustomerNames;
                        res.send({
                            data: link
                        });
                    });
                }
            });
        });
    });

    app.get('/getAllCustomerNames', function (req, res) {
        MongoClient.connect(dbUrl, function (err, db) {
            var customer = db.collection('customer');
            customer.find({}, {
                name: true
            }).toArray(function (err, allCustomerNames) {
                //构造与获取info相同的数据结构, 因为是用的一套模板
                var result = [{}];
                result[0]["allCustomerNames"] = allCustomerNames;
                res.send({
                    data: result
                });
            });
        });

    });

    app.post('/saveLinkman', function (req, res) {
        MongoClient.connect(dbUrl, function (err, db) {
            var customer = db.collection('linker');
            var _id = req.body._id;
            var name = req.body.name;
            if (_id) {
                customer.find({
                    "_id": new ObjectID(_id)
                }).toArray(function (err, result) {
                    if (result.length > 0) {
                        if (result[0].name !== name) {
                            customer.find({
                                "name": name
                            }).toArray(function (err, result2) {
                                if (result2.length > 0) {
                                    //更新的名字已存在
                                    res.send({
                                        state: "e"
                                    });
                                    return;
                                }
                            });
                        }
                        delete req.body._id;
                        if (req.body.customerId) {
                            req.body.customerId = ObjectID(req.body.customerId);
                        }
                        customer.update({
                            "_id": new ObjectID(_id)
                        }, req.body);
                        res.send({
                            state: "ok"
                        });

                    } else {
                        //没有找到这个人, 不能更新信息
                        res.send({
                            state: "n"
                        });
                    }

                });

            } else {
                //id 不存在添加用户
                req.body._id = new ObjectID();

                customer.insert(req.body);
                res.send({
                    "_id": req.body._id
                });
            }
        });
    });

    app.get('/removeLinkman', function (req, res) {
        MongoClient.connect(dbUrl, function (err, db) {
            var customer = db.collection('linker');
            var _id = req.query._id;
            _id && customer.remove({
                "_id": new ObjectID(_id)
            })
            res.send({
                status: "ok"
            });
        });
    });

   /************************************************************************* user*/
    app.get('/allUser', function (req, res) {
        MongoClient.connect(dbUrl, function (err, db) {
            var user = db.collection('user');
            user.find({_id:ObjectID(req.session.uid)}).toArray(function(err,result){
                //管理员查找所有用户
                if (result[0] && result[0].role == '1') {
                    user.find().toArray(function(err,result2){
                        res.send({
                            data: result2
                        });
                    });
                }else{
                    res.send({
                        data: result
                    });
                }
            });
        });
    });

    app.get('/getUserInfo', function (req, res) {
        MongoClient.connect(dbUrl, function (err, db) {
            var user = db.collection('user');
            var customer = db.collection('customer');
            //console.log(req.query);
            user.find(ObjectID(req.query._id)).toArray(function (err, result) {
                if (result.length > 0) {
                    res.send({
                        data: result
                    });
                }
            });
        });
    });

    app.post('/saveUser', function (req, res) {
        MongoClient.connect(dbUrl, function (err, db) {
            var customer = db.collection('user');
            var _id = req.body._id;
            var name = req.body.name;
            if (_id) {
                customer.find({
                    "_id": new ObjectID(_id)
                }).toArray(function (err, result) {
                    if (result.length > 0) {
                        if (result[0].name !== name) {
                            customer.find({
                                "name": name
                            }).toArray(function (err, result2) {
                                if (result2.length > 0) {
                                    //更新的名字已存在
                                    res.send({
                                        state: "e"
                                    });
                                    return;
                                }
                            });
                        }
                        delete req.body._id;
                        if (req.body.customerId) {
                            req.body.customerId = ObjectID(req.body.customerId);
                        }
                        customer.update({
                            "_id": new ObjectID(_id)
                        }, req.body);
                        res.send({
                            state: "ok"
                        });

                    } else {
                        //没有找到这个人, 不能更新信息
                        res.send({
                            state: "n"
                        });
                    }

                });

            } else {
                //id 不存在添加用户
                req.body._id = new ObjectID();

                customer.insert(req.body);
                res.send({
                    "_id": req.body._id
                });
            }
        });
    });

    app.get('/removeUser', function (req, res) {
        MongoClient.connect(dbUrl, function (err, db) {
            var customer = db.collection('user');
            var _id = req.query._id;
            _id && customer.remove({
                "_id": new ObjectID(_id)
            })
            res.send({
                status: "ok"
            });
        });
    });

    //############################################################################# product

    app.get('/allProducts', function (req, res) {
        MongoClient.connect(dbUrl, function (err, db) {
            var product = db.collection('product');
            product.find().toArray(function (err, result) {
                res.send({
                    data: result
                });
            });
        });
    });

    app.get('/getProductInfo', function (req, res) {
        MongoClient.connect(dbUrl, function (err, db) {
            var product = db.collection('product');
            //console.log(req.query);
            product.find(ObjectID(req.query._id)).toArray(function (err, result) {
                res.send({
                    data: result
                });
            });
        });
    });

    app.post('/saveProduct', function (req, res) {
        MongoClient.connect(dbUrl, function (err, db) {
            var product = db.collection('product');
            var _id = req.body._id;
            var name = req.body.name;
            if (_id) {
                product.find({
                    "_id": new ObjectID(_id)
                }).toArray(function (err, result) {
                    if (result.length > 0) {
                        if (result[0].name !== name) {
                            product.find({
                                "name": name
                            }).toArray(function (err, result2) {
                                if (result2.length > 0) {
                                    //更新的名字已存在
                                    res.send({
                                        state: "e"
                                    });
                                    return;
                                }
                            });
                        }
                        delete req.body._id;
                        product.update({
                            "_id": new ObjectID(_id)
                        }, req.body);
                        res.send({
                            state: "ok"
                        });

                    } else {
                        //没有找到这个人, 不能更新信息
                        res.send({
                            state: "n"
                        });
                    }

                });

            } else {
                //id 不存在添加用户
                req.body._id = new ObjectID();
                product.insert(req.body);
                res.send({
                    "_id": req.body._id
                });
            }
        });
    });

    app.get('/removeProduct', function (req, res) {
        MongoClient.connect(dbUrl, function (err, db) {
            var product = db.collection('product');
            var _id = req.query._id;
            _id && product.remove({
                "_id": new ObjectID(_id)
            })
            res.send({
                status: "ok"
            });
        });
    });

    //############################################################################# product

    app.get('/allOrders', function (req, res) {
        MongoClient.connect(dbUrl, function (err, db) {
            var order = db.collection('order');
            var customer = db.collection('customer');
            order.find().toArray(function (err, result) {
                result.forEach(function (el, index) {
                    customer.find(new ObjectID(el.customerId)).toArray(function (err, result2) {
                        el.customer = result2[0] || {};
                        // 最后一个时,返回数据
                        if (index == result.length - 1) {
                            res.send({
                                data: result
                            });
                        }
                    });

                });

                if (result.length < 1) {
                    res.send({
                        data: []
                    });
                }


            });

        });
    });

    app.get('/getOrderInfo', function (req, res) {
        MongoClient.connect(dbUrl, function (err, db) {
            var product = db.collection('product');
            var order = db.collection('order');
            var customer = db.collection('customer');
            var resData = {};

            var t1 = new Promise(function (resolve, reject) {
                order.find(ObjectID(req.query._id)).toArray(function (err, result) {
                    resData.data = result;
                    resolve();
                });
            });

            var t2 = new Promise(function (resolve, reject) {
                product.find().toArray(function (err, allProductNames) {
                    allProductNames.forEach(function (el, index) {
                        if (resData.data && resData.data[0] && resData.data[0]["productId[]"]) {
                            //不是数组
                            if (typeof resData.data[0]["productId[]"] != "object") {
                                resData.data[0]["productId[]"] = [resData.data[0]["productId[]"]];
                            }
                            resData.data[0]["productId[]"].forEach(function (jl, jndex) {
                                if (jl == el._id) {
                                    allProductNames[index].select = true;
                                }
                            });
                        }
                    });
                    resData.data[0]["allProductNames"] = allProductNames;
                    resolve();
                });
            });

            var t3 = new Promise(function (resolve, reject) {
                customer.find({}, {
                    name: true
                }).toArray(function (err, allCustomerNames) {
                    //构造与获取info相同的数据结构, 因为是用的一套模板
                    allCustomerNames.forEach(function (el, index) {
                        if (resData.data && resData.data[0] && resData.data[0]["customerId[]"]) {
                            resData.data[0]["customerId[]"].forEach(function (jl, jndex) {
                                if (jl == el._id) {
                                    allProductNames[index].select = true;
                                }
                            });
                        }
                    });
                    resData.data[0]["allCustomerNames"] = allCustomerNames;
                    resolve();
                });
            });

            Promise.all([t1, t2, t3]).then(function () {
                res.send(resData);
            });
        });
    });

    app.post('/saveOrder', function (req, res) {
        MongoClient.connect(dbUrl, function (err, db) {
            var order = db.collection('order');
            var _id = req.body._id;
            var name = req.body.name;
            if (_id) {
                order.find({
                    "_id": new ObjectID(_id)
                }).toArray(function (err, result) {
                    if (result.length > 0) {
                        if (result[0].name !== name) {
                            order.find({
                                "name": name
                            }).toArray(function (err, result2) {
                                if (result2.length > 0) {
                                    //更新的名字已存在
                                    res.send({
                                        state: "e"
                                    });
                                    return;
                                }
                            });
                        }
                        delete req.body._id;
                        if (req.body.select_products_json) {
                            req.body.select_products = JSON.parse(req.body.select_products_json);
                        }
                        order.update({
                            "_id": new ObjectID(_id)
                        }, req.body);
                        res.send({
                            state: "ok"
                        });

                    } else {
                        //没有找到这个人, 不能更新信息
                        res.send({
                            state: "n"
                        });
                    }

                });
            } else {
                //id 不存在添加用户
                req.body._id = new ObjectID();
                if (req.body.select_products_json) {
                    req.body.select_products = JSON.parse(req.body.select_products_json);
                }
                req.body.createTime = getTime();
                order.insert(req.body);
                res.send({
                    "_id": req.body._id
                });
            }
        });
    });

    app.get('/removeOrder', function (req, res) {
        MongoClient.connect(dbUrl, function (err, db) {
            var order = db.collection('order');
            var _id = req.query._id;
            _id && order.remove({
                "_id": new ObjectID(_id)
            })
            res.send({
                status: "ok"
            });
        });
    });

    app.get('/getAllInfo', function (req, res) {
        MongoClient.connect(dbUrl, function (err, db) {
            var customer = db.collection('customer');
            var product = db.collection('product');
            var result = [{}];

            var t1 = new Promise(function (resolve, reject) {
                product.find().toArray(function (err, allProductNames) {
                    result[0]["allProductNames"] = allProductNames;
                    resolve();
                });
            });

            var t2 = new Promise(function (resolve, reject) {
                customer.find({}, {
                    name: true
                }).toArray(function (err, allCustomerNames) {
                    //构造与获取info相同的数据结构, 因为是用的一套模板
                    result[0]["allCustomerNames"] = allCustomerNames;
                    resolve();
                });
            });

            Promise.all([t1, t2]).then(function () {
                res.send({
                    data: result
                });
            });

        });
    });
};

module.exports = {
    router: router
}
