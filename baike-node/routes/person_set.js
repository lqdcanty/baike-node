var express = require('express');
var router = express.Router();
var request= require('request');
var httpUrl=require('../config/config').url;
var logger = require('../app').logger('person_set');


router.get('/', function(req, res, next){
    if(!req.body.islogin){
        res.redirect('/');
        return false;
    }
    var data;
    var requestData={registerId:req.body.loginUser.useid};
    var useInfo=req.body;
    request.post({url:httpUrl+'/user/detail',form:requestData},function(error, response, body){
        console.log(useInfo,"person_set的useInfo");
        if (!error && response.statusCode == 200){
            var data=JSON.parse(body);
            console.log(data);
            console.log(useInfo)
            res.render('person_set', {data:data,useInfo:useInfo});
        }else{
            logger.info(error);
            res.render('404');
        }
    });
});
module.exports = router;//所有的exports收集到的属性和方法，都赋值给了Module.exportss