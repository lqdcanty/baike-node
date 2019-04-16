var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var url = require('url');
var CryptoJS = require("crypto-js");
var Hex = require("crypto-js/format-hex");
var AES_KEY = "1234567891000000";
var request = require("request");
var httpUrl=require('./config/config');
var log4js = require('log4js');
log4js.configure({
    appenders: [
        { type: 'console' }, //控制台输出
        {
            type: 'file', //文件输出
            //指定文件输出位置及文件大小，当超过maxLogSize大小时，会自动生成一个新文件。logs的文件目录要动手创建。
            filename: './logs/access.log',
            maxLogSize: 20480,
            backups:4,
            category: 'normal'
        }
    ],
    replaceConsole: true
});//该配置的意思是console是默认的appender，使用access这个appender时会将日志记录文件中，日志文件名为access.log。
exports.logger=function(name){
    var logger = log4js.getLogger(name);
    logger.setLevel('INFO');
    return logger;
};

/*引用artTemplate模板*/
var template=require('art-template/node/template-native.js');

var app = express();

//用use连接到中间件，我们默认使用的是cheese这个appender，级别为auto。
/*app.use(log4js.connectLogger(this.logger('normal'), {level: 'auto',format:':method :url'}));*/
app.use(log4js.connectLogger(this.logger('normal'), {level: 'auto',format:':method :url'}));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
template.config('base','');
template.config('extname','.html');
app.engine('.html',template.__express);
app.set('view engine','html');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(session({
    secret: 'hubwizApp', //为了安全性的考虑设置secret属性
    cookie: {maxAge:  60 * 1000 * 60 * 24 * 10}, //设置过期时间
    resave: true, // 即使 session 没有被修改，也保存 session 值，默认为 true
    saveUninitialized: false,
    store:new RedisStore(httpUrl.redis) //
}));


app.use(function (req, res,next) {
    if (req.session.sign) {//检查用户是否已经登录，如果已登录展现的页面
        req.body.islogin = true;
        req.body.loginUser = req.session;
    } else {//否则展示index页面
        req.body.islogin = false;
    }
    next();
});

var index = require('./routes/index');
var login = require('./routes/login');
var detail = require('./routes/detail');
var history = require('./routes/history');
var search_list = require('./routes/search_list');
var entry = require('./routes/entry');
var my_editor = require('./routes/my_editor');
var all_news = require('./routes/all_news');
var person_set = require('./routes/person_set');
var editor_detail = require('./routes/editor_detail');
var copyRight = require('./routes/copyRight');
var copyright_1 = require('./routes/copy_right');
var userDetail = require('./routes/userDetail');
var creatEntry = require('./routes/creatEntry');
var baiduzhishu = require('./routes/baiduzhishu');
var workAudit = require('./routes/workAudit');
var myAudit = require('./routes/myAudit');
var getCopy= require('./routes/getCopy');
var app_copyInfo= require('./routes/app_copyInfo');
var attentionWork = require('./routes/attentionWork');
var copyrightStory = require('./routes/copyrightStory');


// app html
var appcopy= require('./routes/app/copyright');
var appdetail= require('./routes/app/detail');




app.use('/', index);
app.use('/user', login);

app.use('/item', detail);
app.use('/history', history);
app.use('/list', search_list);
app.use('/entry', entry);
app.use('/my_editor', my_editor);
app.use('/all_news', all_news);
app.use('/person_set', person_set);
app.use('/editor_detail', editor_detail);
app.use('/copyRight', copyRight);
app.use('/copyright', copyright_1);
app.use('/userdetaily', userDetail);
app.use('/creatEntry', creatEntry);
app.use('/baiduzhishu', baiduzhishu);
app.use('/workAudit', workAudit);
app.use('/myAudit', myAudit);
app.use('/copy', getCopy);
app.use('/app_copyInfo', app_copyInfo);
app.use('/attentionWork', attentionWork);
app.use('/copyrightStory', copyrightStory);


app.use('/appcopy', appcopy);
app.use('/item', appdetail);




app.get("/api/*",function (req,res) {
    request(httpUrl.url+req.path.replace("/api","")+'?'+url.parse(req.url).query, function (error, response, body) {

        if (!error && response.statusCode == 200){ //连接成功
            var data=JSON.parse(body);
            console.log(data);
            if(data.resultCode==200){ //登陆成功
                res.json({
                    data:data
                })
            }else {
                res.json({
                    status:false,
                    data:data
                })
            }
        }else{
            res.json({
                status:false,
                resultMsg:'网络连接错误，请稍后再试'
            })
        }
    });
});

app.post("/api/*",function (req,res) {
  console.log('post-----------------------------请求');
  if(req.body.islogin){
      var requestData=req.body;
      requestData["registerId"]=req.body.loginUser.useid;
      console.log(requestData,"cehsi ");
      request.post({url:httpUrl.url+req.path.replace("/api",""), form:requestData}, function (error, response, body){
          console.log(httpUrl.url+req.path.replace("/api",""));
          if (!error && response.statusCode == 200) { //连接成功
              var data=JSON.parse(body);
              console.log(data);
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
  }else{
     res.json({
       status:false,
       resultMsg:'暂登录，请先登录'
     })
  }
});

app.post("/score/*",function (req,res) {
    var requestData=req.body;
    requestData["cookie"]=JSON.stringify(req.cookies);
    if(req.body.islogin) {
        requestData["registerId"] = req.body.loginUser.useid;
    }
    request.post({url:httpUrl.url+req.path.replace("/score",""), form:requestData}, function (error, response, body){
        console.log(httpUrl.url+req.path.replace("/score",""));
        if (!error && response.statusCode == 200) { //连接成功
            var data=JSON.parse(body);
            console.log(data);
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
});

app.post("/personal/*",function (req,res){
        var requestData=req.body;
        requestData["registerId"]=req.body.loginUser.useid;
        console.log(requestData);
        request.post({url:httpUrl.url+req.path.replace("/personal",""), form:requestData}, function (error, response, body) {
            console.log(body);
            if (!error && response.statusCode == 200) { //连接成功/**/
                var data=JSON.parse(body);
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
});

app.post("/app/*",function (req,res) {
    console.log('post-----------------------------请求');
    var requestData=req.body;
    request.post({url:httpUrl.url+req.path.replace("/app",""), form:requestData}, function (error, response, body){
        console.log(httpUrl.url+req.path.replace("/app",""));
        if (!error && response.statusCode == 200) { //连接成功
            var data=JSON.parse(body);
            console.log(data);
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
});


var msgNum=0;
app.use(function(req, res, next) {
    if (req.body.islogin) {
        request.post({
            url: httpUrl.url + '/message/query',
            form: {
                type:0,
                registerId:req.body.loginUser.useid
            }
        }, function (error, response, body) {
            if (!error && response.statusCode == 200) { //连接成功
                msgNum=JSON.parse(body).result.allRow;
                res.json({
                    msgNum:msgNum
                })
            } else {
                res.json({
                    msgNum:msgNum
                })
            }
        });
    }
});

// 404
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});
module.exports = app;
