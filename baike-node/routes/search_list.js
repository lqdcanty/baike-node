var express = require('express');
var request= require('request');
var router = express.Router();
var url = require('url');
var logger = require('../app').logger('search_list');
var httpUrl=require('../config/config').url;
var cookie = require('cookie-parser');

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
router.get('/', function(req, res, next) {
    var useInfo=req.body;
    var data_= {};
    var registerId='';
    if(req.body.islogin){
        registerId=req.body.loginUser.useid;
    }
    var yuming=req.host; //获取域名
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
    console.log('列表页请求地址-----------------'+testUrl);
    if(!req.session.referer){
        req.session.referer=getReferer(req);
    }
    var requestData={
        keyword:url.parse(req.url,true).query.keyword,
        currentPage:url.parse(req.url,true).query.currentPage?url.parse(req.url,true).query.currentPage:1,
        registerId:  registerId,
        ip:getClientIp(req),
        userAgent:userAgentInfo,
        referer:req.session.referer,
        cookie:JSON.stringify(req.cookies)
    };
    logger.info(useInfo);
    request.post({url:testUrl, form:requestData},function (error, response, body) {
        if(yuming.indexOf("m.banquanbaike.com.cn")>-1) {
            if (!error && response.statusCode == 200) {
                data_ = JSON.parse(body);
                if (data_.resultCode == 200) {
                    res.render('app/list_page',
                        {
                            data: JSON.parse(body),
                            useInfo: useInfo,
                            search_word: url.parse(req.url, true).query.keyword,
                            seqType: req.cookies.seqType
                        }
                    );
                }else{
                    res.render('app/500')
                }
            } else {
                logger.info(error);
                res.render('app/404')
            }
        }else{
            if (!error && response.statusCode == 200) {
                data_ = JSON.parse(body);
                logger.info(body);
                res.render('search_list',
                    {
                        data: JSON.parse(body),
                        useInfo: useInfo,
                        search_word: url.parse(req.url, true).query.keyword,
                        seqType: req.cookies.seqType
                    }
                );
            } else {
                logger.info(error);
                res.render('500')
            }
        }
    });
});

module.exports = router;
