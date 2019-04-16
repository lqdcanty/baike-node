/**
 * Created by EFIDA on 2017/6/14.
 */
var express = require('express');
var request= require('request');
var router = express.Router();
var url = require('url');
var logger = require('../app').logger('copyInfo');
var httpUrl=require('../config/config').url;

router.get('/:id', function(req, res, next) {
    var useInfo = req.body;
    var workSeqNo = req.params.id;
    var testUrl = httpUrl + '/copyright/detail';
    var requestData={id:workSeqNo}
    console.log(requestData);
    request.post({url:testUrl,form:requestData}, function (error, response, body) {
        console.log(body)
        if (!error && response.statusCode == 200) {
            var data = JSON.parse(body);
            logger.info(body);
            if (data.resultCode == 200) {
                res.render('app/copyrightInfo',
                    {useInfo: useInfo, data: data, workSeqNo: workSeqNo}
                );
            } else {
                logger.info(data);
                res.render('app/500')
            }
        }else {
            logger.info(error);
            res.render('app/404')
        }
    })
});

module.exports = router;
