/**
 * Created by EFIDA on 2017/7/13.
 */
var express = require('express');
var request= require('request');
var router = express.Router();
var url = require('url');
var logger = require('../app').logger('copyInfo');
var httpUrl=require('../config/config').url;
/*var app = express();*/
router.get('/biaoju', function(req, res, next) {
    var useInfo=req.body;
    var data_= {};
    var testUrl=httpUrl+'/registration/total';
    request(testUrl, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            data_=JSON.parse(body);
            logger.info(data_);
            res.render('copyright/biaoju',
                {data:data_,useInfo:useInfo,dataId:url.parse(req.url,true).query.id}
            );
        }else{
            logger.info(error);
            res.render('500')
        }
    });
});
router.get('/biaoju_1', function(req, res, next) {
    var useInfo=req.body;
    res.render('copyright/biaoju',
        {useInfo:useInfo}
    );
});
router.get('/search', function(req, res, next) {
    var useInfo=req.body;
    console.log(url.parse(req.url,true).query.title)
    console.log(url.parse(req.url,true).query.type)
    res.render('copyright/search',
        {useInfo:useInfo,bigType:url.parse(req.url,true).query.title,sType:url.parse(req.url,true).query.type,workSeq:url.parse(req.url,true).query.id,word:url.parse(req.url,true).query.word}
    );
});
module.exports = router;