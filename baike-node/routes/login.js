var express = require('express');
var router = express.Router();

var CryptoJS = require("crypto-js");
var Hex = require("crypto-js/format-hex");
var AES_KEY = "1234567891000000";   
var request= require('request');
var cookie = require('cookie-parser');
var http = require('http');
var url = require('url');
var querystring = require('querystring');
var httpUrl=require('../config/config').url;
var logger = require('../app').logger('login');
global.test="";

router.post('/login', function(req, res, next){
    var requestData={account:req.body.account,password:req.body.password};
    request.post({url:httpUrl+'/user/login', formData:requestData}, function (error, response, body) {
        logger.info(response.statusCode);
        if (!error && response.statusCode == 200){ //连接成功
            var data=JSON.parse(body);
            console.log(data.resultCode)
            if(data.resultCode==200){ //登陆成功
                try {
                    console.log('登陆成功——----------');
                    console.log(body,"登录")
                    req.session.sign = true;
                    req.session.usename = data.result.nickName;
                    req.session.isCommunity = data.result.isCommunity;
                    req.session.account = data.result.account;
                    req.session.telephone = data.result.telephone;
                    req.session.name = data.result.name;
                    req.session.useid = data.result.id;
                    req.session.usephoto = data.result.photo;
                    res.json({
                        status:true
                    })
                }catch(e){
                    console.log("error:"+e);
                    res.json({
                        err:data
                    })
                }
            }else {
                res.json({
                    status:false,
                    resultMsg:data.result.msg
                })
            }
        }else {
            logger.info(error);
            res.json({
                status:false,
                resultMsg:"对不起，网络错误，请稍后再试！"
            })
        }
    });
});
router.post('/register', function(req, res, next){
    var userAgentInfo = req.headers['user-agent'];//获取user-agent
    var Agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"];
    var mobile_pc = 'pc';//pc端返回pc，移动端返回mobile
    for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
            mobile_pc = Agents[v];
            break;
        }
    }
    var requestData=req.body;
    requestData["regTerminal"]=mobile_pc;
    console.log(requestData);
    request.post({url:httpUrl+'/user/register', form:requestData}, function (error, response, body) {
        logger.info( response.statusCode);
        if (!error && response.statusCode == 200) { //连接成功
            var data=JSON.parse(body);
            if(data.resultCode==200){
                res.json({
                    status:true,
                    resultMsg:data.resultMsg
                })
            }else{
                res.json({
                    status:false,
                    resultMsg:data.resultMsg
                })
            }
        }else {
            logger.info(error);
            res.json({
                status:false,
                resultMsg:"对不起，网络连接错误，请稍后再试！"
            })
        }
    });
});
router.post('/findPassword', function(req, res, next){
    var userAgentInfo = req.headers['user-agent'];//获取user-agent
    var Agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"];
    var mobile_pc = 'pc';//pc端返回pc，移动端返回mobile
    for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
            mobile_pc = Agents[v];
            break;
        }
    }
    var requestData=req.body;
    requestData["regTerminal"]=mobile_pc;
    request.post({url:httpUrl+'/user/findPassword', form:requestData}, function (error, response, body) {
        logger.info( response.statusCode);
        if (!error && response.statusCode == 200) { //连接成功
            var data=JSON.parse(body);
            if(data.resultCode==200){
                res.json({
                    status:true,
                    resultMsg:data.resultMsg
                })
            }else{
                res.json({
                    status:false,
                    resultMsg:data.resultMsg
                })
            }
        }else {
            logger.info(error);
            res.json({
                status:false,
                resultMsg:"对不起，网络连接错误，请稍后再试！"
            })
        }
    });
});
router.get('/emailValidate', function(req, res, next) {
    var useInfo=req.body;
    var testUrl=httpUrl+'/user/emailActivate?token='+querystring.parse(url.parse(req.url).query).token;
    request(testUrl, function (error, response, body) {
       /* logger.info( response.statusCode);*/
        if (!error && response.statusCode == 200) {
            var data_=JSON.parse(body);
            if(data_.resultCode=200){
                req.session.sign = true;
                req.session.usename = data_.result.nickName;
                //req.session.isCommunity = data_.result.isCommunity;
                req.session.account = data_.result.account;
                req.session.telephone = data_.result.telephone;
                req.session.name = data_.result.name;
                req.session.useid = data_.result.id;
                req.session.usephoto = data_.result.photo;
                res.render('emailValidate',{resultCode:true,resultMsg:data_.resultMsg})
            }else if(data_.resultCode=500){
                res.render('500')
            }else{
                res.render('emailValidate',{resultCode:false,resultMsg:data_.resultMsg})
            }
        }else{
            logger.info(error);
            res.render('404')
        }
    });
});
//退出登录
router.post('/layOut', function(req, res, next) {
    // res.clearCookie('sid');
    req.session.destroy();//退出登录
    res.json({
        status:true
    });
});

//微博登陆
router.get('/wb/login', function(req, res, next) {
    /*res.send('微博登陆')*/
    console.log(req.headers.referer);
    console.log(url.parse(req.url),"加了url");
    global.test =req.headers.referer;
    console.log(global.test,"wx1");
    var appid='2708545225';
    var redirectUri='http://www.banquanbaike.com.cn';
    /* var redirectUri='http://liqiandan.tunnel.qydev.com';*/
    var path="https://api.weibo.com/oauth2/authorize";
    path+='?client_id='+appid;
    path+='&redirect_uri='+redirectUri+'/user/weibo/callback';
    path+='&response_type=code';
    console.log(path);
    //转发到授权服务器
    res.redirect(path);

});

router.get('/weibo/callback', function(req, res, next) {
    var requestData={code:req.query.code};
    request.post({url:httpUrl+'/auth/weibo/authcallback', formData:requestData}, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var data_ = JSON.parse(body);
            console.log(data_,"weibo登录的换回的数据");
            if (data_.resultCode = 200){
                req.session.sign = true;
                req.session.usename = data_.result.nickName;
                req.session.account = data_.result.account;
                req.session.telephone = data_.result.telephone;
                req.session.name = data_.result.name;
                req.session.useid = data_.result.id;
                req.session.usephoto = data_.result.photo;
                req.session.authId = data_.result.authId;
                res.redirect(global.test);
                console.log(req.session,"session里面的值")
            }
        }
    })
});
// 微信登陆
router.get('/wx/login', function(req, res, next) {
    console.log(req.headers.referer);
    global.test =req.headers.referer;
    console.log(global.test,"wx1");
    var appid='wx8a4c5b15fcf9b74d';
    var redirectUri='http://www.banquanbaike.com.cn';
   /* var redirectUri='http://liqiandan.tunnel.qydev.com';*/
    var path="https://open.weixin.qq.com/connect/qrconnect";
    path+='?appid='+appid;
    path+='&redirect_uri='+redirectUri+'/user/weixin/callback';
    path+='&response_type=code&scope=snsapi_login&state=STATE#wechat_redirect';
    console.log(path);
    //转发到授权服务器
    res.redirect(path);
});
router.get('/weixin/callback', function(req, res, next) {
    var requestData={code:req.query.code};
    request.post({url:httpUrl+'/auth/weixin/authcallback', formData:requestData}, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var data_ = JSON.parse(body);
            console.log(data_,"weixin登录的换回的数据")
            console.log(data_);
            if (data_.resultCode = 200){
                /*var str = JSON.stringify({
                    usename: data_.result.account,
                    useid: data_.result.id,
                    usephoto: data_.result.photo
                });
                console.log(str);
                var sstr = CryptoJS.AES.encrypt(str, AES_KEY);
                res.cookie("sid", encodeURIComponent(sstr.toString()), {});*/
                //由cookie改成session
                req.session.sign = true;
                req.session.usename = data_.result.nickName;
                req.session.account = data_.result.account;
                req.session.telephone = data_.result.telephone;
                req.session.name = data_.result.name;
                req.session.useid = data_.result.id;
                req.session.usephoto = data_.result.photo;
                req.session.authId = data_.result.authId;
                res.redirect(global.test);
                console.log(req.session,"session里面的值")
            }
        }
    })
});

// QQ登陆
router.get('/qq/login', function(req, res, next){
    global.test =req.headers.referer;
    console.log(global.test,"qq1");
    var clientid='101410040';
    var redirectUri='http://www.banquanbaike.com.cn';
   /* var redirectUri='http://liqiandan.tunnel.qydev.com';*/
    var path='https://graph.qq.com/oauth2.0/authorize?response_type=code';
    path+='&client_id='+clientid;
    path+='&redirect_uri='+redirectUri+'/user/qq/callback';
    path+='&scope=get_user_info';
    console.log(path);
    //转发到授权服务器
    res.redirect(path);
});
router.get('/qq/callback', function(req, res, next) {
    var requestData={code:req.query.code};
    request.post({url:httpUrl+'/auth/qq/authcallback', formData:requestData}, function (error, response, body) {
        if (!error && response.statusCode == 200){
            var data_ = JSON.parse(body);
            console.log(data_,"weixin登录的换回的数据")
            console.log(data_);
            if (data_.resultCode = 200) {
                req.session.sign = true;
                req.session.usename = data_.result.nickName;
                req.session.account = data_.result.account;
                req.session.telephone = data_.result.telephone;
                req.session.name = data_.result.name;
                req.session.useid = data_.result.id;
                req.session.usephoto = data_.result.photo;
                req.session.authId = data_.result.authId;
                res.redirect(global.test);
                console.log(req.session,"session里面的值")
            }
        }
    })
});
// 头像更换
router.get("/update",function (req,res){

     req.session.usephoto = req.query.usephoto;
     req.session.save();
     logger.info(req.session.usephoto)
        res.json({
            status:true,
        })
});
module.exports = router;