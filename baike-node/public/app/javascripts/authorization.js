$(function () {
    //关于input与textarea的输入与未输入时的字体颜色控制
    $("input").blur(function () {
        $(this).attr("style","color:#333;")
    });
    $("textarea").blur(function () {
        $(this).attr("style","color:#333;")
    });
    $("input").focus(function () {
        $(this).attr("style","color:#333;")
    });
    $("textarea").focus(function () {
        $(this).attr("style","color:#333;")
    });

    function isNull( str ){
        if ( str == "" ) return true;
        var regu = "^[ ]+$";
        var re = new RegExp(regu);
        return re.test(str);
    }
    //授权的js代码
    $("#authorizationSubmit").click(function () {

        if(isNull($('.content').val())){
            $('.error-msg').show().html('版权使用需求不能为空');
            return
        }
        if(isNull($('.contactsPhone').val())){
            $('.error-msg').show().html('电话不能为空');
            return
        }
        $('.error-msg').hide();
        $.ajax({
            type: "POST",
            url:"app/contact/copyright",
            data:$('#authorizationForm').serialize(),
            success: function(data) {
                if(data.data.resultCode==200) {
                    $('.error-msg').show().html(data.data.resultMsg);
                }else{
                    $('.error-msg').show().html(data.data.resultMsg);
                }
            },
            error:function () {

            }
        })
    })
})