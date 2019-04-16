$(document).ready(function(){
/*    initPage();*/
    var timestamp = $("#timestamp").val();//时间戳
    var nonceStr = $("#noncestr").val();//随机串
    var signature = $("#signature").val();//签名
    wx.config({
        debug : false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId : 'wx8a4c5b15fcf9b74d', // 必填，公众号的唯一标识
        timestamp : timestamp, // 必填，生成签名的时间戳
        nonceStr : nonceStr, // 必填，生成签名的随机串
        signature : signature,// 必填，签名，见附录1
        jsApiList : [ 'scanQRCode','onMenuShareAppMessage','onMenuShareTimeline' ]
        // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
    });

    wx.ready(function(){
        //分享到朋友圈
        wx.onMenuShareTimeline({
            title: '版权百科--数据服务平台',
            desc: '通过社会化协作方式收集作品和版权数据，基于数据挖掘IP价值。用户可以通过版权百科获得作品的版权生命周期相关信息，包括作品基本情况',
            link: 'http://www.banquanbaike.com.cn',
            imgUrl: 'app/images/logo.png',
            success: function () {
                // 用户确认分享后执行的回调函数
                alert('分享到朋友圈成功');
            },
            cancel: function () {
                // 用户取消分享后执行的回调函数
                alert('你没有分享到朋友圈');
            }
        });
        //分享给朋友
        wx.onMenuShareAppMessage({
            title: '版权百科--数据服务平台',
            desc: '通过社会化协作方式收集作品和版权数据，基于数据挖掘IP价值。用户可以通过版权百科获得作品的版权生命周期相关信息，包括作品基本情况',
            link: 'http://www.banquanbaike.com.cn',
            imgUrl: 'app/images/logo.png',
            trigger: function (res) {
                // 不要尝试在trigger中使用ajax异步请求修改本次分享的内容，因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返回
            },
            success: function (res) {
                alert('分享给朋友成功');
            },
            cancel: function (res) {
                alert('你没有分享给朋友');
            },
            fail: function (res) {
                alert(JSON.stringify(res));
            }
        });
    });
});
