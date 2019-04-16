var express = require('express');
var request= require('request');
var router = express.Router();
var http = require('http');
var qs = require('querystring');
var logger = require('../app').logger('index');
var httpUrl=require('../config/config').url;
var url = require('url');

router.get('/', function(req, res, next){
    var useInfo=req.body;
    var data_= {};
    var yuming=req.host; //获取域名
    var testUrl=httpUrl+'/index/statistics';
    if(yuming.indexOf("m.banquanbaike.com.cn")>-1){
        //渲染模板
        res.render('app/index_new',{fromCode:req.query.from});
    }else{
        //渲染模板
        request(testUrl, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                data_=JSON.parse(body);
                logger.info(body);
                res.render('index_1',
                    {data:JSON.parse(body),useInfo:useInfo}
                );
            }else{
                logger.info(error);
                res.render('500')
            }
        });
    }
    if(!req.session.referer){
        req.session.referer=getReferer(req);
    }
    var userAgentInfo = req.headers['user-agent'];//获取user-agent
    var requestData={
        ip:getClientIp(req),
        userAgent:userAgentInfo,
        referer: req.session.referer,
        cookie:JSON.stringify(req.cookies)
    };
    console.log(req.session);
    request.post({url:httpUrl+'/access/log/add', form:requestData},function (error, response, body) {
        if (!error && response.statusCode == 200) {
            data_=JSON.parse(body);
            logger.info(body);
        }else{
            logger.info(error);
        }
    });

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
router.get('/app/*', function(req, res, next) {
    var useInfo=req.body;
    var data_= {};
    var registerId='';
    console.log(useInfo)
    if(req.body.islogin){
        registerId=req.body.loginUser.useid;
    }

    var seqType=0;
    if(!req.cookies.seqType){
        res.cookie("seqType", 2);
    }
    //数据
    var userAgentInfo = req.headers['user-agent'];//获取user-agent
    var Agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"];
    var mobile_pc = 'pc';//pc端返回pc，移动端返回mobile
    for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
            mobile_pc = 'mobile';
            break;
        }
    }
    var testUrl=httpUrl+'/work/search';
    var requestData={
        keyword:url.parse(req.url,true).query.keyword,
        currentPage:url.parse(req.url,true).query.currentPage?url.parse(req.url,true).query.currentPage:1,
        registerId:  registerId,
        ip:getClientIp(req),
        userAgent:userAgentInfo,
        referer:getReferer(req)
    };
    console.log('手机页面列表参数--------------------------------------');
    console.log(requestData);

    request.post({url:testUrl, form:requestData},function (error, response, body) {
        if (!error && response.statusCode == 200) {
            data_=JSON.parse(body);
            logger.info(body);
            res.json({
                status:true,
                data:data_
            })
        }else{
            logger.info(error);
            res.render('500')
        }
    });
});
module.exports = router;
