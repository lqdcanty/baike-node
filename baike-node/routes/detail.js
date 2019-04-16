/**
 * Created by EFIDA on 2017/4/27.
 */
var express = require('express');
var request= require('request');
var router = express.Router();
var url = require('url');
var logger = require('../app').logger('detail');
var httpUrl=require('../config/config').url;

router.get('/report', function(req, res, next) {
    var useInfo=req.body;
    res.render('valueReport',{useInfo:useInfo})
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
        refererAddress=req.headers.referer
    }else{
        refererAddress='';
    }
    return refererAddress;
};

router.get('/:id', function(req, res, next) {
    //数据
    var useInfo=req.body;
    var data_= {};
    var registerId='',formWeb='';
    if(req.body.islogin){
        registerId=req.body.loginUser.useid;
    }
    var yuming=req.host; //获取域名
    var wokrdID=req.params.id;
    var formWeb=url.parse(req.url,true).query.from=='cos' ? url.parse(req.url,true).query.from : 'web';
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

    if(mobile_pc=='mobile'){
        res.redirect('/item?id='+wokrdID);
        return;
    }
    if(!req.session.referer){
        req.session.referer=getReferer(req);
    }
    var testUrl=httpUrl+'/work/detail?'+'workSeqNo='+wokrdID+'&registerId='+registerId+'&ip='+getClientIp(req)+'&userAgent='+userAgentInfo+'&referer='+req.session.referer+'&cookie='+JSON.stringify(req.cookies);
    console.log('详情页请求地址-----------------'+testUrl)
    request(testUrl,function (error, response, body) {
        if(yuming.indexOf("m.banquanbaike.com.cn")>-1) {
            if (!error && response.statusCode == 200) {
                data_ = JSON.parse(body);
                logger.info(body);
                logger.info(useInfo);
                if (data_.resultCode == 200) {
                    res.render('app/detail',
                        {
                            data: JSON.parse(body).result,
                            useInfo: useInfo,
                            workID: wokrdID,
                            seqType: req.cookies.seqType,
                            from: req.query.from
                        }
                    );
                } else if (data_.resultCode != 200) {
                    res.render('app/404')
                }
            } else {
                logger.info(error);
                res.render('app/500')
            }
        }else{
            if (!error && response.statusCode == 200) {
                data_ = JSON.parse(body);
                logger.info(body);
                logger.info(useInfo);
                if (data_.resultCode == 200) {
                    if (data_.result.workDetail.isInit) {
                        res.render('detail_isInit',
                            {
                                data: JSON.parse(body).result,
                                useInfo: useInfo,
                                workID: wokrdID,
                                seqType: req.cookies.seqType
                            }
                        );
                    } else {
                        res.render('detail',
                            {
                                data: JSON.parse(body).result,
                                useInfo: useInfo,
                                workID: wokrdID,
                                seqType: req.cookies.seqType,
                                from: req.query.from,
                                formWeb:formWeb
                            }
                        );
                    }
                } else if (data_.resultCode != 200) {
                    res.render('500')
                }
            } else {
                logger.info(error);
                res.render('500')
            }
        }
    });
});

router.get('/', function(req, res, next) {
    //数据
    var useInfo=req.body;
    var data_= {};
    var registerId='',formWeb='';
    if(req.body.islogin){
        registerId=req.body.loginUser.useid;
    }
    var yuming=req.host; //获取域名
    var wokrdID=url.parse(req.url,true).query.id;
    logger.info('searchWorkId:'+wokrdID);
    formWeb=url.parse(req.url,true).query.from=='cos' ? url.parse(req.url,true).query.from : 'web';
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
    if(!req.session.referer){
        req.session.referer=getReferer(req);
    }
    var testUrl=httpUrl+'/work/detail?'+'workSeqNo='+wokrdID+'&registerId='+registerId+'&ip='+getClientIp(req)+'&userAgent='+userAgentInfo+'&referer='+req.session.referer+'&cookie='+JSON.stringify(req.cookies);
    console.log('详情页请求地址-----------------'+testUrl)
    request(testUrl,function (error, response, body) {
        if(yuming.indexOf("m.banquanbaike.com.cn")>-1) {
            if (!error && response.statusCode == 200) {
                data_ = JSON.parse(body);
                logger.info(body);
                logger.info(useInfo);
                if (data_.resultCode == 200) {
                    res.render('app/detail',
                        {
                            data: JSON.parse(body).result,
                            useInfo: useInfo,
                            workID: wokrdID,
                            seqType: req.cookies.seqType,
                            from: req.query.from
                        }
                    );
                } else if (data_.resultCode != 200) {
                    res.render('app/404')
                }
            } else {
                logger.info(error);
                res.render('app/500')
            }
        }else{
            if (!error && response.statusCode == 200) {
                data_ = JSON.parse(body);
                logger.info(body);
                logger.info(useInfo);
                if (data_.resultCode == 200) {
                    if (data_.result.workDetail.isInit) {
                        res.render('detail_isInit',
                            {
                                data: JSON.parse(body).result,
                                useInfo: useInfo,
                                workID: wokrdID,
                                seqType: req.cookies.seqType
                            }
                        );
                    } else {
                        res.render('detail',
                            {
                                data: JSON.parse(body).result,
                                useInfo: useInfo,
                                workID: wokrdID,
                                seqType: req.cookies.seqType,
                                from: req.query.from,
                                formWeb:formWeb
                            }
                        );
                    }
                } else if (data_.resultCode != 200) {
                    res.render('500')
                }
            } else {
                logger.info(error);
                res.render('500')
            }
        }
    });
});
module.exports = router;