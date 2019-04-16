var express = require('express');
var request= require('request');
var router = express.Router();
var http = require('http');
var qs = require('querystring');
var logger = require('../app').logger('baiduzhishu');
var httpUrl=require('../config/config').url;
var fs = require('fs');

router.get('/:seqNo/:id', function(req, res, next){
    var seqNo=req.params.seqNo;
    var seqid=req.params.id;
    var opts={
        url:httpUrl+'/work/baiduzhishu/'+seqNo+'/'+seqid,
        encoding: null
    }
    console.log(opts.url)
    request.get(opts, function (err, response, body) {
        logger.info(body);
        var contentType = response.headers['content-type'];
        response.setEncoding('binary');
        res.set('Content-Type', contentType);
        res.send(body);
    })

});

module.exports = router;