var express = require('express');
var request= require('request');
var router = express.Router();
var url = require('url');
var httpUrl=require('../config/config').url;
var logger = require('../app').logger('copyrightStory');

router.get('/', function(req, res, next) {
    //数据
    var useInfo=req.body;
    var currentPage=url.parse(req.url,true).query.currentPage?url.parse(req.url,true).query.currentPage:1;
    request.get({url:httpUrl+'/copyright/story/list?currentPage='+currentPage+'&pageSize=10'},function(error, response, body){
        if (!error && response.statusCode == 200){
            logger.info(body);
            var data=JSON.parse(body);
            res.render('copyrightStory', {data:data,useInfo:useInfo});
        }else{
            res.render('500');
        }
    });
    //渲染模板
});

module.exports = router;
