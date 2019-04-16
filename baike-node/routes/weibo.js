var express = require('express');
var request= require('request');
var router = express.Router();

router.post('/weibo', function(req, res, next) {
    //数据
    var data;
    var dataStr = (new Date()).valueOf();
    //重定向到认证接口,并配置参数
    //注意这里使用的是node的https模块发起的请求
    var path = " https://graph.qq.com/oauth2.0/authorize";
    path += '?client_id=' + OAuthConfig.GITHUB_CLIENT_ID;
    path += '&scope='+OAuthConfig.GITHUB_CLIENT_SCOPE;
    path += '&state='+ dataStr;
    //转发到授权服务器
    res.redirect(path);


    request.post({url:url1},function(error, response, body){
        if (!error && response.statusCode == 200){
            console.log(body);
            data=JSON.parse(body);
            console.log(data);
            res.json({
                status:true,
                data:data
            })
           /* res.send("微博登录成功");*/
        }else {
            res.json({
                status:false,
                resultMsg:'网络连接错误，请稍后再试'
            })
        }
    })
    //渲染模板
});
module.exports = router;

