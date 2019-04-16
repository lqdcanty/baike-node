var express = require('express');
var request= require('request');
var router = express.Router();
var httpUrl=require('../config/config').url;
var logger = require('../app').logger('all_news');

router.get('/', function(req, res, next) {
    if(!req.body.islogin){
        res.redirect('/');
        return false;
    }
    //数据
    var data;
    var requestData={registerId:req.body.loginUser.useid,type:0};
    var useInfo=req.body;
    request.post({url:httpUrl+'/message/query',form:requestData},function(error, response, body){
        if (!error && response.statusCode == 200){
            logger.info(body);
            data=JSON.parse(body);
            console.log(data,"node");
            res.render('all_news', {data:data,useInfo:useInfo});
        }else{
            res.render('404');
        }
    })
    //渲染模板
});

module.exports = router;