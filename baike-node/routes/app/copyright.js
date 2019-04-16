var express = require('express');
var request= require('request');
var router = express.Router();

router.get('/', function(req, res, next) {
    //数据
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
    //渲染模板
    res.render('app/copyright', data);
});
module.exports = router;
