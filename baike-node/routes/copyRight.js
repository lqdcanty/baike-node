/**
 * Created by EFIDA on 2017/6/14.
 */
var express = require('express');
var request= require('request');
var router = express.Router();
var url = require('url');
var logger = require('../app').logger('copyInfo');
var httpUrl=require('../config/config').url;
/*var app = express();*/
router.get('/bql/:id?', function(req, res, next) {
    var useInfo=req.body;
    var workSeqNo=req.params.id;
    var testUrl=httpUrl+'/work/essential/info?workSeqNo='+workSeqNo;
    request(testUrl,function (error, response, body) {
        if (!error && response.statusCode == 200) {
            data_=JSON.parse(body);
            logger.info('data-------------------'+body);
            //渲染模板
            if(data_.resultCode==200){
                res.render('banquanlian/banquanlian',
                    {useInfo:useInfo,workSeqNo:workSeqNo,data:data_.result,from:req.query.from}
                );
            }else{
                logger.info(data_);
                res.render('500')
            }
        }else{
            logger.info(error);
            res.render('500')
        }
    });
    if(!req.session.referer){
        req.session.referer=getReferer(req);
    }
    var userAgentInfo = req.headers['user-agent'];//获取user-agent
    var logData={
        ip:getClientIp(req),
        userAgent:userAgentInfo,
        referer: req.session.referer,
        cookie:JSON.stringify(req.cookies)
    };

    request.post({url:httpUrl+'/access/log/add', form:logData},function (error, response, body) {
        if (!error && response.statusCode == 200) {
            data_=JSON.parse(body);
            logger.info(body);
        }else{
            logger.info(error);
        }
    });
});

router.get('/detail/:id', function(req, res, next) {
    var useInfo = req.body;
    var workSeqNo = req.params.id;
    var testUrl = httpUrl + '/copyright/detail';
    var registerId='';
    if(req.body.islogin){
        registerId=req.body.loginUser.useid;
    }
    var requestData={id:workSeqNo,registerId:registerId}
    console.log(requestData);
    request.post({url:testUrl,form:requestData}, function (error, response, body) {
        console.log(body)
        if (!error && response.statusCode == 200) {
            var data = JSON.parse(body);
            logger.info(body);
            if (data.resultCode == 200) {
                console.log(data.result.copyrightDetail.category, "类型");
                logger.info(data.result, "租后")
                if (data.result.copyrightDetail.category == "yz") {
                    res.render('banquanlian/copyright_original',
                        {useInfo: useInfo, data: data, workSeqNo: workSeqNo}
                    );
                } else if (data.result.copyrightDetail.category == "zr") {
                    console.log("zr,copyright_transfer")
                    res.render('banquanlian/copyright_transfer',
                        {useInfo: useInfo, data: data, workSeqNo: workSeqNo}
                    );
                } else if (data.result.copyrightDetail.category == "zs") {
                    res.render('banquanlian/copyright_use',
                        {useInfo: useInfo, data: data, workSeqNo: workSeqNo}
                    );
                } else if (data.result.copyrightDetail.category == "zy") {
                    console.log("ok")
                    res.render('banquanlian/copyright_pledge',
                        {useInfo: useInfo, data: data, workSeqNo: workSeqNo}
                    );
                }
            } else {
                logger.info(data);
                res.render('500')
            }
        }else {
            logger.info(error);
            res.render('500')
        }
    });
});
    //声明id
router.get('/state/:id', function(req, res, next) {
            var useInfo = req.body;
            var workSeqNo = req.params.id
            var testUrl = httpUrl + '/copyright/detail';
            console.log(req.params.id,"canshu")
            requestData={id:workSeqNo,registerId:useInfo.loginUser.useid};
            console.log(requestData,"XIUGAS");
            console.log(useInfo,"dhskdsdkshkd")
            request.post({url:testUrl,form:requestData}, function (error, response, body) {
                console.log(body);
                if (!error && response.statusCode == 200){
                    var data=JSON.parse(body);
                    logger.info(body);
                    if(data.resultCode==200){
                      /*  console.log(data.result.copyrightDetail.category,"类型");*/
                        logger.info(data.result,"租后")
                        res.render('banquanlian/copyright_notice',
                            {useInfo: useInfo, data: data}
                        );
                    }else{
                        logger.info(data);
                        res.render('500')
                    }
                }else{
                    logger.info(error);
                    res.render('500')
                }
            })
    });

/*侵权申诉*/
router.get('/complain/:id', function(req, res, next) {
    // var useInfo = req.body;
    // var workSeqNo = req.params.id;
    // var testUrl = httpUrl + '/copyright/detail';
    // var registerId='';
    // if(req.body.islogin){
    //     registerId=req.body.loginUser.useid;
    // }
    // var requestData={id:workSeqNo,registerId:registerId}
    res.render('banquanlian/infringement_Complaint',
        {useInfo: useInfo, data: data, workSeqNo: workSeqNo}
    );
    // request.post({url:testUrl,form:requestData}, function (error, response, body) {
    //     console.log(body)
    //     if (!error && response.statusCode == 200) {
    //         var data = JSON.parse(body);
    //         logger.info(body);
    //         if (data.resultCode == 200) {
    //             logger.info(data.result, "租后")
    //
    //         } else {
    //             logger.info(data);
    //             res.render('500')
    //         }
    //     }else {
    //         logger.info(error);
    //         res.render('500')
    //     }
    // })
});
function getClientIp(req) {
    var ipAddress;
    var headers = req.headers;
    var forwardedIpsStr = headers['x-real-ip'] || headers['x-forwarded-for'];
    forwardedIpsStr ? ipAddress = forwardedIpsStr : ipAddress = null;
    if (!ipAddress) {
        ipAddress = req.connection.remoteAddress;
    }
    if (ipAddress.substr(0, 7) == "::ffff:") {
        ipAddress = ipAddress.substr(7)
    }
    return ipAddress;
};
function getReferer(req) {
    var refererAddress;
    if(req.headers.referer){
        refererAddress=req.headers.referer;
    }else{
        refererAddress='';
    }
    return refererAddress;
};
module.exports = router;
