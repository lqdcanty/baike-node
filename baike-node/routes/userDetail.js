var express = require('express');
var request= require('request');
var router = express.Router();
var httpUrl=require('../config/config').url;
var logger = require('../app').logger('entry');

router.post('/userDetail', function(req, res, next) {

    //数据
    var data;
    var requestData={registerId:req.body.registerId};
    console.log(req.body.registerId,"kaakn");
    request.post({url:httpUrl+'/user/detail',form:requestData},function(error, response, body){
      console.log(req.body,"chenggong")
        if (!error && response.statusCode == 200){
            console.log(body);
            data=JSON.parse(body);
            console.log(data);
           /* res.render('userdetaily', {data:data});*/
           res.json({
               status:true,
               data:data
           })
        }else {
            res.json({
                status:false,
                resultMsg:'网络连接错误，请稍后再试'
            })
        }
    });
    //渲染模板
});

module.exports = router;
