/**
 * Created by Administrator on 2017/5/26.
 */
var express = require('express');
var request= require('request');
var router = express.Router();

router.get('/', function(req, res, next) {
    var useInfo=req.body;
    //数据
    var data;
   /* var requestData={registerId:req.body.loginUser.useid};
    var useInfo=req.body;*/
    var data = {
        title: '国内要闻',
        time: (new Date).toString(),
        list: [
            {
                id: '1',
                name: '张三22222222222222222222'
            },
            {
                id: '2',
                name: '李四111111111111'
            }
        ]
    };
    res.render('editor_detail',{useInfo:useInfo});
    //渲染模板
});

module.exports = router;