var express = require('express');
var request= require('request');
var router = express.Router();
var url = require('url');
var logger = require('../app').logger('search_list');
var httpUrl=require('../config/config').url;
var cookie = require('cookie-parser');

router.get('/get', function(req, res, next) {
        //数据
    var wokrdID=url.parse(req.url,true).query.id;
    var workName=url.parse(req.url,true).query.workName;
        //渲染模板
    res.render('app/getCopy',  {wokrdID:wokrdID,workName:workName});
});

router.get('/sm', function(req, res, next) {
    //数据
    var wokrdID=url.parse(req.url,true).query.id;
    var workName=url.parse(req.url,true).query.workName;
    //渲染模板
    res.render('app/smCopy',  {wokrdID:wokrdID,workName:workName});
});

module.exports = router;