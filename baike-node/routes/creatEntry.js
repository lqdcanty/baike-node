
var express = require('express');
var request= require('request');
var router = express.Router();
var httpUrl=require('../config/config').url;
var logger = require('../app').logger('creatEntry');

router.get('/', function(req, res, next) {
    if(!req.body.islogin){
        res.redirect('/');
        return false;
    }
    var useInfo=req.body;
    //数据
    var useInfo=req.body;
    console.log(useInfo);

     res.render('./creatEntry', {useInfo:useInfo});
    });

module.exports = router;
