/**
 * Created by EFIDA on 2017/5/31.
 */
var express = require('express');
var request= require('request');
var router = express.Router();
var url = require('url');
var logger = require('../app').logger('search_list');
var httpUrl=require('../config/config').url;

router.get('/', function(req, res, next) {
    var useInfo=req.body;
    var data_= {};
    var testUrl=httpUrl+'/work/chapter/history/list?'+url.parse(req.url).query;
    console.log(testUrl)
    request(testUrl,function (error, response, body) {
        if (!error && response.statusCode == 200) {
            data_=JSON.parse(body);
            logger.info(body);
            //渲染模板
            res.render('history',
                {data:JSON.parse(body).result,useInfo:useInfo,url:url.parse(req.url).query,workID:url.parse(req.url,true).query.workSeqNo}
            );
        }else{
            logger.info(error);
            res.render('500')
        }
    });
});

module.exports = router;