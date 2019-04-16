var express = require('express');
var request= require('request');
var router = express.Router();
var httpUrl=require('../config/config').url;
var logger = require('../app').logger('my_editor');

router.get('/', function(req, res, next) {
    if(!req.body.islogin){
        res.redirect('/');
        return false;
    }
    //数据
    var data;
    var requestData={registerId:req.body.loginUser.useid};
    var useInfo=req.body;
    request.post({url:httpUrl+'/query/editLog',form:requestData},function(error, response, body){
        if (!error && response.statusCode == 200){
            var data1;
            data1=JSON.parse(body);
            data=data1.result;
            console.log(data,"没有转之后 ");
            console.log(data.all+"总共"+data.reject+"拒绝"+data.adopt+"通过");
            res.render('my_editor', {data:data,useInfo:useInfo});
        }else{
            res.render("404");
        }
    });
    //渲染模板
});

module.exports = router;
