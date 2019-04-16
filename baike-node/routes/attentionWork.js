var express = require('express');
var request= require('request');
var router = express.Router();
var httpUrl=require('../config/config').url;
var logger = require('../app').logger('attentionWork');

router.get('/', function(req, res, next) {
    if(!req.body.islogin){
        res.redirect('/');
        return false;
    }
    //数据
    var data;
    var requestData={registerId:req.body.loginUser.useid};
    var useInfo=req.body;
    console.log(requestData);
    request.get({url:httpUrl+'/work/workFollow?registerId='+req.body.loginUser.useid+'&pagesize=10'},function(error, response, body){
        if (!error && response.statusCode == 200){
            logger.info(body);
            data=JSON.parse(body);
            console.log(data,"node");
            res.render('attentionWork', {data:data,useInfo:useInfo});
        }else{
            res.render('404');
        }
    });
    //渲染模板
});

module.exports = router;
