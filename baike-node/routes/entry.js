var express = require('express');
var request= require('request');
var router = express.Router();
var httpUrl=require('../config/config').url;
var logger = require('../app').logger('entry');

router.get('/', function(req, res, next) {
    if(!req.body.islogin){
        res.redirect('/');
        return false;
    }
    //数据
    var data;
    var requestData={registerId:req.body.loginUser.useid,type:"音乐"};
    var useInfo=req.body;
    console.log(requestData);
    request.post({url:httpUrl+'/query/entry',form:requestData},function(error, response, body){
        logger.info(response.statusCode);
        if (!error && response.statusCode == 200){
            console.log(body);
            data=JSON.parse(body);
            console.log(data);
            res.render('entry', {data:data,useInfo:useInfo});
        }else{
            res.render('404');
        }
    });
    //渲染模板
});

module.exports = router;
