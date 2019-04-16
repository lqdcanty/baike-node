/**
 * Created by EFIDA on 2017/4/26.
 */
$(".search_input").focus(function () {
    $(".click_search img").attr({ src: "/images/icon-sourch1.png"});
}).blur(function () {
    $(".click_search img").attr({ src: "/images/icon-sourch.png"});
});
$('.click_search').click(function () {
    if($("input[name='keyword']").val()!=''){
        $('.search-form').submit();
    }else{
        console.log("空")
    }
});

$('.header-btn').click(function () {
    var that=this;
    $('.modle-login').show();
    $(".nav-tab").find("a").each(function (i) {
        $(this).removeClass('active-tab');
        if($(this).data("type")==$(that).data("type")){
            $(this).addClass('active-tab');
        }
    });
    $(".login-modle").find('.form-type').each(function () {
        $(this).removeClass('active-wrap');
        if($(this).data("type")==$(that).data("type")){
            $(this).addClass('active-wrap');
        }
    });
});
$(".nav-tab").find("a").click(function (i) {
    $(".nav-tab").find("a").removeClass('active-tab');
    $(this).addClass('active-tab');
    var that=this;
    $(".login-modle").find('.form-type').each(function () {
        $(this).removeClass('active-wrap');
        if($(this).data("type")==$(that).data("type")){
            $(this).addClass('active-wrap');
        }
    });
});
$('.close_btn').click(function () {
    $(".modle-wrap").each(function () {
        if($(this).css("display")=="block"){
            $(this).hide()
        }
        if($(this).hasClass("modle-pwd")){
            $('.step_1').show();
            $(".step_2").hide();
        }
    })
});

// 忘记密码
$(".forget_pwd").click(function () {
    $('.modle-login').hide();
    $(".modle-pwd").show();
    $('.findPwd_Email').val('');
    $('.regist_errorMsg').find("p").hide().html('');
});

$('.return_login').click(function () {
    $('.modle-login').show();
    $(".modle-pwd").hide();
    $(".modle-email").hide();
    $('.step_2').hide();
    $(".step_1").show();
});

$('.regist-wrap').find('input').keypress(function(event){
    if(event.keyCode == 13){ //绑定回车
        $(".registbtn").click();
    }
})



//注册
$(".registbtn").click(function () {
    if(checkEmail()&&checkPwd()&&checkPwdTwo()){
        $.ajax({
            url: '/user/register',
            type: 'POST',
            data: {
                account: $('.regist-name').val(),
                password: $('.regist-pwd').val()
            },
            success: function(data){
                console.log(data);
                if(data.status == true){
                    _utaq.push(['trackEvent','btn-3']);
                    _utaq.push(["trackForm","register-form", $('.regist-name').val()]);
                    $('.regist_errorMsg').find("p").hide().html('');
                    $('.modle-login').hide();
                    $(".modle-email").show();
                    $('.regist-email-address').html($('.regist-name').val());
                    var _mail = $('.regist-name').val().split('@')[1];    //获取邮箱域
                    for (var j in hash){
                        if(j == _mail){
                            $('.email-modle').find('.registEmail').attr("href", hash[_mail]).css({"display":"block"});    //替换登陆链接
                        }
                    }
                }else{
                    $('.regist_errorMsg').find("p").show();
                    $('.regist_errorMsg').find("p").html(data.resultMsg);
                }
            }
        });

    }

});

//忘记密码
$(".find_pwd").click(function () {
    var szReg=/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    var bChk=szReg.test( $('.findPwd_Email').val());
    if(!bChk){
        $('.error_wrap').find("p").show().html('邮箱格式不正确');
        return false;
    }else{
        $.ajax({
            url: '/user/findPassword',
            type: 'POST',
            data: {
                account: $('.findPwd_Email').val()
            },
            success: function(data){
                console.log(data);
                if(data.status == true){
                    $('.error_wrap').find("p").hide().html('');
                    $('.step_1').hide();
                    $(".step_2").show();
                    $('.pwdEmail-address').html($('.regist-name').val());
                    var _mail = $('.findPwd_Email').val().split('@')[1];    //获取邮箱域
                    for (var j in hash){
                        if(j == _mail){
                            $('.email-modle').find('.pwdEmail').attr("href", hash[_mail]).css({"display":"block"});    //替换登陆链接
                        }
                    }
                }else{
                    $('.error_wrap').find("p").show();
                    $('.error_wrap').find("p").html(data.resultMsg);
                }
            }
        });
    }
});
//登陆
$('#login').click(function(evt){
    evt.preventDefault();
    login($('.loginStatus').val());
});
$('.login-wrap').find('input').keypress(function(event){
    if(event.keyCode == 13){ //绑定回车
       login();
    }
})
function login(status) {
    if($('#name').val()==''){
        $('.error_msg').find("p").show();
        $('.error_msg').find("p").html('账号不能为空');
        return;
    }
    if($('#password').val()==''){
        $('.error_msg').find("p").show();
        $('.error_msg').find("p").html('密码不能为空');
        return;
    }
    $.ajax({
        url: '/user/login',
        type: 'POST',
        data: {
            account: $('#name').val(),
            password: $('#password').val()
        },
        success: function(data){
            if(data.status == true){

                if(status==1){
                    //创建作品词条
                    window.location.href="./creatEntry";
                }else{
                    location.reload();
                }
            }else{
                $('.error_msg').find("p").show();
                $('.error_msg').find("p").html(data.resultMsg);
            }
        }
    });
}
//退出
$('.layOutBtn').click(function () {
    $.ajax({
        url: '/user/layOut',//这个ajax是为了获取node层的操作
        type: 'POST',
        success: function(data){
            console.log(data)
            if(data.status == true){
                location.reload();
            }else{
                $hint.open(data.resultMsg)
            }
        }
    });
});
function  checkEmail() {
   /* var szReg=/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;*/
    var szReg=/^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;//
    var bChk=szReg.test( $('.regist-name').val());
    if(!bChk){
        $('.regist_errorMsg').find("p").show().html('邮箱格式不正确');
        return false;
    }else{
        return true;
    }
}

function checkPwd() {
    regExp=/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,21}$/;
    if($(".regist-pwd").val()==""){
        $('.regist_errorMsg').find("p").show().html("密码不能为空");
        return false;
    }
    else if(!regExp.test($(".regist-pwd").val())){
        $('.regist_errorMsg').find("p").show().html("密码必须由6-21位字母和数字组成");
        return false;
    }
    else{
        return true;
    }
}
function checkPwdTwo() {
    if($(".regist-pwdTwo").val()==""){
        $('.regist_errorMsg').find("p").show().html("确认密码不能为空");
        return false;
    }
    else if($(".regist-pwdTwo").val()!=$(".regist-pwdTwo").val()){
        $('.regist_errorMsg').find("p").show().html("确认密码和密码必须一样");
        return false;
    }
    else{
        return true;
    }
}

var hash = {
    'qq.com': 'http://mail.qq.com',
    'gmail.com': 'http://mail.google.com',
    'sina.com': 'http://mail.sina.com.cn',
    'sina.cn': 'http://mail.sina.com.cn',
    '163.com': 'http://mail.163.com',
    '126.com': 'http://mail.126.com',
    'yeah.net': 'http://www.yeah.net/',
    'sohu.com': 'http://mail.sohu.com/',
    'tom.com': 'http://mail.tom.com/',
    'sogou.com': 'http://mail.sogou.com/',
    '139.com': 'http://mail.10086.cn/',
    'hotmail.com': 'http://www.hotmail.com',
    'live.com': 'http://login.live.com/',
    'live.cn': 'http://login.live.cn/',
    'live.com.cn': 'http://login.live.com.cn',
    '189.com': 'http://webmail16.189.cn/webmail/',
    'yahoo.com.cn': 'http://mail.cn.yahoo.com/',
    'yahoo.cn': 'http://mail.cn.yahoo.com/',
    'eyou.com': 'http://www.eyou.com/',
    '21cn.com': 'http://mail.21cn.com/',
    '188.com': 'http://www.188.com/',
    'foxmail.com': 'http://www.foxmail.com',
    'foxmail.com': 'http://www.foxmail.com',
    'outlook.com': 'http://www.outlook.com'
};


//微博登陆
WB2.anyWhere(function(W) {
    W.widget.connectButton({
        id: "wb_connect_btn",
        type: "6,2",
        callback: {
            login: function (o) {	//登录后的回调函数
            },
            logout: function () {	//退出后的回调函数
            }
        }
    });
});
//获取所有消息
function dinshi(){
    $.ajax({
        url: '/msg/message/query',
        type: 'POST',
        success: function(data){
            $("#msgNum").html(data.msgNum);
        }
    })
}
if($('.login_true').css('display')){
    dinshi();
    setInterval(function () {
        dinshi();
    },30000);
}

$('.bqj_login').click(function () {
    console.log(getCurrLocation())
})
function getCurrLocation(){
    return window.location.href ;
}

