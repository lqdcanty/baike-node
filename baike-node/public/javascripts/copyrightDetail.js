$(function(){
    var workSeqNoId=$(".workSeqNoId").html();
    var coverImgContent,re_coverImgContent;
    $(".unopen").click(function(){
        $hint.open("该功能未开放")
    })
    //进入详情页的提示信息；
    $(".detailPage_message a").click(function(){
        $(".detailPage_message").hide();
    })
    setTimeout(function(){
        $(".detailPage_message").hide();
    },10000)
    function certificate(){
   /*     var api_domain = "http://tmpfs.banquanjia.com.cn/",*/
             var api_domain = "http://tmpfs.banquanbaike.com.cn/",//线上
            chunkSize = 4*1024*1024,
            $list = $("#fileCertificate"),
            check_url = api_domain+"file/upload/check",
            // 缩略图大小
            ratio = window.devicePixelRatio || 1,
            thumbnailWidth = 120 * ratio,
            thumbnailHeight = 120 * ratio;
        function generateUUID() {
            var d = new Date().getTime();
            var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = (d + Math.random()*16)%16 | 0;
                d = Math.floor(d/16);
                return (c=='x' ? r : (r&0x3|0x8)).toString(16);
            });
            return uuid;
        };

        function getFileUid(file){
            return $.md5(file.name+"_"+file.size+"_"+file.lastModifiedDate.getTime());
        }
        var uploader = WebUploader.create({
            auto:true,
            server: api_domain+'file/upload?X-Progress-ID='+generateUUID(),
            swf: 'http://cdn.staticfile.org/webuploader/0.1.5/Uploader.swf',
            /*pick: {id:'#filePickerCertificate', multiple: false},*/
            pick: {id:'#filePickerCertificate', multiple: false},
            resize: false,
            preserveHeaders: true,
            accept: {title: 'Images', extensions: 'gif,jpg,jpeg,bmp,png', mimeTypes: 'image/*'}
        }).on( 'fileQueued', function( file ) {
            var $li = $('<div id="' + file.id + '" class="item"><img><i class="del-imgBtn"></i><span class="border-item"></span></div>'),
                $img = $li.find('img');
            console.log(file.id,"xiu")
            $list.html( $li ); // $list为容器jQuery实例
            $li.find('.del-imgBtn').click(function () {
                uploader.removeFile( file.id,true  );
                $li.remove();
                $(".upload_fm").attr("style","background:url(/images/icon_zjfm1.png) no-repeat center center/cover!important");
                coverValue="";
            });
            uploader.makeThumb( file, function( error, src ) {
                if ( error ) {
                    $img.replaceWith('<span>不能预览</span>');
                    return;
                }
                $img.attr( 'src', src );
            }, thumbnailWidth, thumbnailHeight );
        }).on( 'uploadSuccess', function( file ,data ) {
            coverImgContent=data.result.sourceId;//得到的值
            $( '#'+file.id ).addClass('upload-state-done');
        }).on( 'uploadError', function( file ) {
            var $li = $( '#'+file.id ),
                $error = $li.find('div.error');
            if ( !$error.length ) { // 避免重复创建
                $error = $('<div class="error"></div>').appendTo( $li );
            }
            $error.text('上传失败');
        }).on( 'uploadComplete', function( file ) {
        });
        uploader.on("uploadFinished",function() {
            if (coverImgContent!== " ") {
                console.log(coverImgContent);
                var url="/api/copyright/uploadCerf";//绝对地址
                var datan={url:coverImgContent,id:workSeqNoId};
                ajax(url,datan,function(data){
                    $hint.open(data.resultMsg);
                })
            } else {
                $hint.open("请添加上传的封面图片");
            }
        })
    }
   /* certificate();*/
    if(!isLogin()){
        $("#filePickerCertificate").click(function () {
            $('.modle-login').show();
            showLogin();
            return;
        })
    }else{
        certificate();
    }

//重新上传
    function re_certificate(){
        /*var api_domain = "http://tmpfs.banquanjia.com.cn/",*/
            var api_domain = "http://tmpfs.banquanbaike.com.cn/",//线上
            chunkSize = 4*1024*1024,
            $list = $("#re_fileCertificate"),
            check_url = api_domain+"file/upload/check",
            // 缩略图大小
            ratio = window.devicePixelRatio || 1,
            thumbnailWidth = 120 * ratio,
            thumbnailHeight = 120 * ratio;
        function generateUUID() {
            var d = new Date().getTime();
            var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = (d + Math.random()*16)%16 | 0;
                d = Math.floor(d/16);
                return (c=='x' ? r : (r&0x3|0x8)).toString(16);
            });
            return uuid;
        };

        function getFileUid(file){
            return $.md5(file.name+"_"+file.size+"_"+file.lastModifiedDate.getTime());
        }


        var uploader = WebUploader.create({
            auto:true,
            server: api_domain+'file/upload?X-Progress-ID='+generateUUID(),
            swf: 'http://cdn.staticfile.org/webuploader/0.1.5/Uploader.swf',
            /*pick: {id:'#filePickerCertificate', multiple: false},*/
            pick: {id:'#re_filePickerCertificate', multiple: false},
            resize: false,
            preserveHeaders: true,
            accept: {title: 'Images', extensions: 'gif,jpg,jpeg,bmp,png', mimeTypes: 'image/*'}
        }).on( 'fileQueued', function( file ) {
            var $li = $('<div id="' + file.id + '" class="item"><img><i class="del-imgBtn"></i><span class="border-item"></span></div>'),
                $img = $li.find('img');
            console.log(file.id,"xiu")
            $list.html( $li ); // $list为容器jQuery实例
            $li.find('.del-imgBtn').click(function () {
                uploader.removeFile( file.id,true  );
                $li.remove();
                $(".upload_fm").attr("style","background:url(/images/icon_zjfm1.png) no-repeat center center/cover!important");
                coverValue="";
            });
            uploader.makeThumb( file, function( error, src ) {
                if ( error ) {
                    $img.replaceWith('<span>不能预览</span>');
                    return;
                }
                $img.attr( 'src', src );
            }, thumbnailWidth, thumbnailHeight );
        }).on( 'uploadSuccess', function( file ,data ) {
            re_coverImgContent=data.result.sourceId;//得到的值
            $( '#'+file.id ).addClass('upload-state-done');
        }).on( 'uploadError', function( file ) {
            var $li = $( '#'+file.id ),
                $error = $li.find('div.error');
            if ( !$error.length ) { // 避免重复创建
                $error = $('<div class="error"></div>').appendTo( $li );
            }
            $error.text('上传失败');
        }).on( 'uploadComplete', function( file ) {
        });
        uploader.on("uploadFinished",function() {
            if (re_coverImgContent!="") {
                console.log(re_coverImgContent);
                var url="/api/copyright/uploadCerf";//绝对地址
                var datan={url:re_coverImgContent,id:workSeqNoId};
                ajax(url,datan,function(data){
                    $hint.open(data.resultMsg);
                })
            } else {
                $hint.open("请添加上传的封面图片");
            }
        })
    }
    if(!isLogin()){
        $("#re_filePickerCertificate").click(function () {
            $('.modle-login').show();
            showLogin();
            return;
        })
    }else{
        re_certificate();
    }

    //判断是否登录
    function isLogin() {
        if($('.is_login').find('.personalWrap').hasClass('login_true')){
            return true
        }else{
            return false
        }
    }
    function showLogin() {
        $(".nav-tab").find("a").each(function (i) {
            if($(this).data("type")=='login'){
                $(this).addClass('active-tab');
            }
        });
        $(".login-modle").find('.form-type').each(function () {
            if($(this).data("type")=='login'){
                $(this).addClass('active-wrap');
            }
        });
    }

    /*$('.get-dy').click(function () {

        $('.dy-module').show()
    })
*/

    //修改
    var url_xgValue="/api/copyright/update";
    var pledge_style,tag_value;
    $(".use_a.xgxx").click(function(){
        if(!isLogin()){
            $('.modle-login').show();
            showLogin();
            return;
        }else{
            $(".border_dl").attr("style","height:62px");
            $("#time_dd").children(".time-wrap.creationTime1").show();
            $(".xg_div").each(function(){
                var old1_value= $(this).children("dd").children(".old1_value").text();
                console.log(old1_value);
                $(this).children("dd").children(".old1_value").hide();
                $(this).children("dd").children(".new1_value").show().focus();
                if($(this).children("dd").find("select")){
                    $(this).children("dd").children("select").change(function(){
                        pledge_style=$(this).children("dd").children("select option:selected").val()
                    })
                    console.log(pledge_style,"12");
                }
                if($(this).children("dd").find(".modify_time")){
                    $(this).children("dd").children(".old1_value").hide();
                    $(this).children("dd").children(".new1_value.modify_time").show();
                }
                if($(this).find("#time_dd")){
                    $("#time_dd").children(".creationTime0").show();
                }
                console.log(pledge_style,"11");
            })
            $(".save_sq_div").show();
        }
    })
    $("#modify_time_value").click(function(){
        $(".time_xg").show();
    })
    $(".close_xg").click(function(){
        $(".time_xg").hide();
        $("#time_dd").children(".old1_value").show().attr("style","width:70%");
        if($(".xg_div").children("#time_dd")){
            if(time_end&&time_start){
                $("#time_dd").children(".old1_value").text(time_start+"-"+time_end)
            }else{
                if($("#time_dd").find(".select-btn").children(".copyType-btn").hasClass("on")){
                    console.log(this)
                    var value_time_style=$("#time_dd").find(".copyType-btn.on").siblings("span").text();
                    console.log(value_time_style,"时间类型");
                    $("#time_dd").children(".old1_value").text(value_time_style);
                }
            }
        }
    })
    $('.time_xg').find('.select-btn').find('a').click(function () {
        $('.time_xg').find('.select-btn').find('a').each(function () {
            $(this).removeClass('on');
        });
        if($(this).hasClass('on')){
            $(this).removeClass('on');
            $(this).parent().parent().find("input[name='validity']").val('');

        }else{
            $(this).addClass('on')
            $(this).parent().parent().find("input[name='validity']").val($(this).data('time'));
            $(this).parent().parent().find('.dateTime-s').val('');
        }
    });
    var time_start,time_end,creation_time;
    var registerTime = {
        elem: '#registerTime',
        format: 'YYYY/MM/DD',
        istoday: false,
        fixed: true,
        choose: function(datas){

        }
    };


    var start2 = {
        elem: '#pledge-startTime',
        format: 'YYYY/MM/DD',
        max: '2099-06-16', //最大日期
        istoday: false,
        fixed: true,
        choose: function(datas){
            end2.min = datas; //开始日选好后，重置结束日的最小日期
            end2.start = datas; //将结束日的初始值设定为开始日
            $('#pledge-startTime').parent().parent().find('.select-btn').find('a').each(function () {
                $(this).removeClass('on');
            });
            time_start=datas;
        }
    };
    var end2 = {
        elem: '#pledge-endTime',
        format: 'YYYY/MM/DD',
        max: '2099-06-16',
        istoday: false,
        fixed: true,
        choose: function(datas){
            start2.max = datas; //结束日选好后，重置开始日的最大日期
            $('#pledge-endTime').parent().parent().find('.select-btn').find('a').each(function () {
                $(this).removeClass('on');
            });
            time_end=datas;
        }
    };
    laydate(start2);
    laydate(end2);


    //原始著作
    $(".save_sq").click(function() {
        $(".border_dl").attr("style","height:auto");
        $(".xg_div").each(function(){
            var i=$(this).index();
            var new1_value= $(this).children("dd").children(".new1_value").val();
            console.log(new1_value);
            $(this).children("dd").children(".old1_value").show().text(new1_value);
            $(this).children("dd").children(".new1_value").hide();
            if($(this).children("#time_dd")){
                if(time_end&&time_start){
                    $("#time_dd").children(".old1_value").text(time_start+"-"+time_end)
                }else{
                    if($("#time_dd").find(".select-btn").children(".copyType-btn").hasClass("on")){
                        console.log(this)
                        var value_time_style=$("#time_dd").find(".copyType-btn.on").siblings("span").text();
                        console.log(value_time_style,"时间类型");
                        $("#time_dd").children(".old1_value").text(value_time_style);
                    }
                }
                $(".save_sq_div").hide();
            }
            console.log(pledge_style,"baocunshi");
        })

        console.log("cehsi")
        console.log($(".xg_form").serialize())
        var datan=$(".xg_form").serialize();
        ajax(url_xgValue,datan,function(data){
            $hint.open(data.resultMsg);
        },function(data){
            $hint.open(data.resultMsg);
        })
    })

    //声明
    var textarea_true=false,textarea_word;
    var textarea_word="";
    $(".textarea_style").focus(function(){
        $(this).text("");
    })
    $(".textarea_style").blur(function(){
        textarea_word=$(this).val();
        textarea_true=true;
        console.log(textarea_word,"textarea_word")
    })
    var textarea_trued=false,textarea_worded;
    var textarea_worded="";
    $(".textarea_styled").focus(function(){
        $(this).text("");
    })
    $(".textarea_styled").blur(function(){
        textarea_worded=$(this).val();
        textarea_trued=true;
        console.log(textarea_worded,"textarea_word")
    })

    $("#state_copyright").click(function(){
        if(!isLogin()){
            $('.modle-login').show();
            showLogin();
            return;
        }else{
            if(textarea_word){
                var url="/api/copyright/cache";
                var datan={id:workSeqNoId,statements:textarea_word,type:"obblige"}
                ajax(url,datan,function(data){
                    window.location.href='/copyRight/state/'+workSeqNoId;
                },function(data){
                    $hint.open(data.resultMsg);
                })
            }else{
                $hint.open("声明内容不能为空");
            }
        }
    })
    $("#state_copyrighted").click(function(){
        if($(".workSeqNoId1").text()=="true"){
            if(textarea_worded){
                var url="/api/copyright/cache";
                var datan={id:workSeqNoId,statements:textarea_worded,type:"grant"}
                ajax(url,datan,function(data){
                    window.location.href='/copyRight/state/'+workSeqNoId;
                },function(data){
                    $hint.open(data.resultMsg);
                })
            }else{
                $hint.open("声明内容不能为空");
            }
        }else{
            $hint.open("请先登录");
        }
    })


    function ajax(url,data,succCallback,errorCallback){
        $.ajax({
            url:url,
            type:"post",
            data:data,
            success:function(data){
                if(data.status){
                    console.log(data.data)
                    if(data.data.resultCode==200){
                        if(succCallback){
                            succCallback(data.data);
                        }
                    }else{
                        if(errorCallback){
                            errorCallback(data.data);
                        }
                    }
                }else{
                    $hint.open(data.resultMsg);
                }
            }
        })
    }
})