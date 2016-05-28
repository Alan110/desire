var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var dbUrl = 'mongodb://localhost:27017/liuqili';

function router (app){
    app.get('/allCustomers', function(req, res){
        MongoClient.connect(dbUrl, function(err, db) {
            var customer = db.collection('customer');
            customer.find().toArray(function(err,result){
                res.send({data:result});
            });
        });
    });

    app.get('/getCustomerInfo', function(req, res){
        MongoClient.connect(dbUrl, function(err, db) {
            var customer = db.collection('customer');
            //console.log(req.query);
            customer.find(ObjectID(req.query._id)).toArray(function(err,result){
                res.send({data:result});
            });
        });
    });

    app.post('/saveCustomer', function(req, res){
        MongoClient.connect(dbUrl, function(err, db) {
            var customer = db.collection('customer');
            var _id = req.body._id;
            var name = req.body.name;
            if(_id){
                customer.find({"_id": new ObjectID(_id)}).toArray(function(err,result){
                    if(result.length > 0  ){
                        if(result[0].name !== name){
                            customer.find({"name":name}).toArray(function(err,result2){
                                if(result2.length > 0){
                                    //更新的名字已存在
                                    res.send({state:"e"});
                                    return ;
                                }
                            });
                        }
                        delete req.body._id;
                        customer.update({"_id":new ObjectID(_id)},req.body);
                        res.send({state:"ok"});
                        
                    }else{
                        //没有找到这个人, 不能更新信息
                        res.send({state:"n"});
                    }

                });
                
            }else{
                //id 不存在添加用户
                req.body._id = new ObjectID();
                customer.insert(req.body);
                res.send({"_id":req.body._id});
            }
        });
    });

    app.get('/removeCustomer', function(req, res){
        MongoClient.connect(dbUrl, function(err, db) {
            var customer = db.collection('customer');
            var _id = req.query._id;
            _id && customer.remove({"_id": new ObjectID(_id) }) 
            res.send({status:"ok"});
        });
    });

    /************************************************************************* linkman*/ 
    app.get('/allLinkman', function(req, res){
        MongoClient.connect(dbUrl, function(err, db) {
            var customer = db.collection('linker');
            customer.find().toArray(function(err,result){
                res.send({data:result});
            });
        });
    });

    app.get('/getLinkmanInfo', function(req, res){
        MongoClient.connect(dbUrl, function(err, db) {
            var linker = db.collection('linker');
            var customer = db.collection('customer');
            //console.log(req.query);
            linker.find(ObjectID(req.query._id)).toArray(function(err,link){
                if(link.length > 0){
                    customer.find({},{name:true}).toArray(function(err,allCustomerNames){
                        //找到name,并放到第一位
                        for(var i=0;i<allCustomerNames.length;i++){
                            if(link[0].customerId && allCustomerNames[i]._id.id == link[0].customerId.id){
                                var temp = allCustomerNames[i];
                                temp.select = true;
                                allCustomerNames[i] = allCustomerNames[0];
                                allCustomerNames[0] = temp;
                            }
                        }
                        link[0]["allCustomerNames"] = allCustomerNames;
                        res.send({data:link});
                    });
                }
            });
        });
    });

    app.get('/getAllCustomerNames',function(req,res){
        MongoClient.connect(dbUrl, function(err, db) {
            var customer = db.collection('customer');
            customer.find({},{name:true}).toArray(function(err,allCustomerNames){
                //找到name,并放到第一位
                for(var i=0;i<allCustomerNames.length;i++){
                    if(allCustomerNames[i]._id.id == req.query._id){
                        var temp = allCustomerNames[i];
                        temp.select = true;
                        allCustomerNames[i] = allCustomerNames[0];
                        allCustomerNames[0] = temp;
                    }
                }
                //构造与获取info相同的数据结构, 因为是用的一套模板
                var result = [{}];
                result[0]["allCustomerNames"] = allCustomerNames;
                res.send({data:result});
            });
        });
        
    });

    app.post('/saveLinkman', function(req, res){
        MongoClient.connect(dbUrl, function(err, db) {
            var customer = db.collection('linker');
            var _id = req.body._id;
            var name = req.body.name;
            if(_id){
                customer.find({"_id": new ObjectID(_id)}).toArray(function(err,result){
                    if(result.length > 0  ){
                        if(result[0].name !== name){
                            customer.find({"name":name}).toArray(function(err,result2){
                                if(result2.length > 0){
                                    //更新的名字已存在
                                    res.send({state:"e"});
                                    return ;
                                }
                            });
                        }
                        delete req.body._id;
                        if(req.body.customerId){
                            req.body.customerId = ObjectID(req.body.customerId);
                        }
                        customer.update({"_id":new ObjectID(_id)},req.body);
                        res.send({state:"ok"});
                        
                    }else{
                        //没有找到这个人, 不能更新信息
                        res.send({state:"n"});
                    }

                });
                
            }else{
                //id 不存在添加用户
                req.body._id = new ObjectID();
                
                customer.insert(req.body);
                res.send({"_id":req.body._id});
            }
        });
    });

    app.get('/removeLinkman', function(req, res){
        MongoClient.connect(dbUrl, function(err, db) {
            var customer = db.collection('linker');
            var _id = req.query._id;
            _id && customer.remove({"_id": new ObjectID(_id) }) 
            res.send({status:"ok"});
        });
    });


}

module.exports = {
    router : router    
}
