/**
 * Created by EFIDA on 2017/5/3.
 */

//获取URL参数
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg); //匹配目标参数
    if (r != null) return unescape(r[2]); return null; //返回参数值
}
var workSeqNo=$('#workItemID').val();//作品ID
var ajax_flag=false;
var DetailAjax= {
    //-------------封装AJAX
    AJAX:function (url,callback) {
        $.ajax({
            url: url,
            type: 'get',
            success:function (data) {
                callback(data);
            }
        });
    },

    clickMaxLabel:function () {
        $('.smallLabel').slideUp();
        $('.smallLabel-wrap').find('.bottom-icon').removeClass('icon-shangjiantou').addClass('icon-xiajiantou')
        $('.smallLabel').attr('value',1);
        if( $('.maxLabel').attr('value')==1){
            $('.maxLabel').slideDown();
            $('.maxLabel-wrap').find('.bottom-icon').removeClass('icon-xiajiantou').addClass('icon-shangjiantou')
            $('.maxLabel').attr('value',2);
        }else{
            $('.maxLabel').slideUp(30);
            $('.maxLabel-wrap').find('.bottom-icon').removeClass('icon-shangjiantou').addClass('icon-xiajiantou')
            $('.maxLabel').attr('value',1)
        }
    },

    clickSmallLabel:function () {
        $('.maxLabel').slideUp();
        $('.maxLabel-wrap').find('.bottom-icon').removeClass('icon-shangjiantou').addClass('icon-xiajiantou')
        $('.maxLabel').attr('value',1);
        if($('.smallLabel').attr('value')==1){
            $('.smallLabel').slideDown();
            $('.smallLabel-wrap').find('.bottom-icon').removeClass('icon-xiajiantou').addClass('icon-shangjiantou')
            $('.smallLabel').attr('value',2);
        }else{
            $('.smallLabel').slideUp(30);
            $('.smallLabel-wrap').find('.bottom-icon').removeClass('icon-shangjiantou').addClass('icon-xiajiantou')
            $('.smallLabel').attr('value',1)
        }
    },

    selMaxLable:function (ele) {
        var _this=this;
        $('.maxLabel-val').html($(ele).html());
        $('.maxLabel').hide();
        $('.bottom-icon').removeClass('icon-shangjiantou').addClass('icon-xiajiantou')
        this.AJAX('/api/work/smallLabel?category='+$(ele).html(),function (data) {
            console.log(data);
            var list=data.data.result,s='';
            if(data.data.resultCode==200){
                for(var i=0;i<list.length;i++){
                    s+='<a onclick="DetailAjax.selSmallLable(this)">'+list[i]+'</a>'
                }
                $('.smallLabel-val').html(list[0]);
                $('.smallLabel').html(s);
                _this.AJAX('/api/work/workTemp?type='+ $('.smallLabel-val').html(),function (data) {
                    var list=data.data.result.baseInfoTemp;
                    if(list.length>0){
                        var s='';
                        list.forEach(function (p1,p2) {
                            s+='<li>' +
                                '<input type="text" class="basicInfo-item addName" value="'+p1.key+'">：' +
                                '<input type="text" class="basicInfo-item addValue" value="'+p1.val+'">' +
                                '</li>'
                        })
                        $('.addInfo-ulWrap').html(s)
                    }else{
                        $('.addInfo-ulWrap').html('')
                    }
                })
            }
        });

    },

    selSmallLable:function (ele) {
        var _this=this;
        $('.smallLabel-val').html($(ele).html());
        $('.smallLabel').hide();
        $('.bottom-icon').removeClass('icon-shangjiantou').addClass('icon-xiajiantou');
        this.AJAX('/api/work/workTemp?type='+$(ele).html(),function (data) {
            var list=data.data.result.baseInfoTemp;
            if(list.length>0){
                var s='';
                list.forEach(function (p1,p2) {
                    s+='<li>' +
                        '<input type="text" class="basicInfo-item addName" value="'+p1.key+'">：' +
                        '<input type="text" class="basicInfo-item addValue" value="'+p1.val+'">' +
                        '</li>'
                })
                $('.addInfo-ulWrap').html(s)
            }else{
                $('.addInfo-ulWrap').html('')
            }
        });
        if($(ele).html()=='其他'){
            $('.smallLabel-val').hide();
            $('.elseLabel').show().focus();
            $('.smallLabel-wrap').find('.bottom-icon').hide();
            $('.elseLabel').blur(function () {
                _this.inputBlur(this);
            })
        }
    },

    inputBlur:function (ele) {
        if($(ele).val()==''){
            $('.smallLabel-val').html('其他');
        }else{
            $('.smallLabel-val').html($(ele).val());
        }
        $('.smallLabel-wrap').find('.bottom-icon').show()
        $('.smallLabel-val').show();
        $('.elseLabel').hide();
    },

    labelArray:[]

};
$(function () {
    //修改标签
    if(!isLogin()){
        $('.modle-login').show();
        showLogin();
    }
    $('.label-wrap').css({'display':'inline-block'});
    $('.maxLabel-val').html($('.tips-div').find('a:first-child').html());
    $('.smallLabel-val').html($('.tips-div').find('a:nth-child(2)').html());
    $('.tips-div').find('a:nth-child(1)').hide();
    $('.tips-div').find('a:nth-child(2)').hide();
    $.ajax({
        url: '/api/work/label',
        type: 'get',
        success:function (data) {
            var list=data.data.result,s='',l='';
            DetailAjax.labelArray=list;
            if(data.data.resultCode==200){
                for(var i=0;i<list.length;i++){
                    s+='<a onclick="DetailAjax.selMaxLable(this)">'+list[i].type+'</a>';
                    if(list[i].type==$('.tips-div').find('a:first-child').html()){
                        for(var j=0;j<list[i].tags.length;j++){
                            l+='<a onclick="DetailAjax.selSmallLable(this)">'+list[i].tags[j]+'</a>';
                        }
                        $('.smallLabel').html(l)
                    }
                };
                $('.maxLabel').html(s)
            }
        }
    });
    //编辑标签
    $('.maxLabel-val').click(function (event) {
        event.stopPropagation();
        DetailAjax.clickMaxLabel();
    });
    $('.smallLabel-val').click(function (event) {
        event.stopPropagation();
        DetailAjax.clickSmallLabel();
    });
    $(document).click(function () {
        $('.label-btn').next().slideUp();
        $('.label-btn').next().attr('value',1);
        $('.bottom-icon').removeClass('icon-shangjiantou').addClass('icon-xiajiantou')
    });


    $('.tips-div').find('a').click(function () {
        updateTips(this)
    });
    $('.save-tips').click(function () {
        $(nowTips).html($('.update-tips').val());
        $('.tips-module').hide()
    });
    $('.detail-tips').click(function () {
        $(nowTips).remove();
        $('.tips-module').hide()
    });

    //增加标签
    $('.addTip-input').click(function () {
        if($('.addTip-wrap').find('input').length>0){
            $hint.open('添加标签不能为空')
            return;
        }
        var t='<input type="text" id="addTip-val" class="addTip-val" onblur="addTips(this)">';
        $('.addTip-btn').show();
        $('.addTip-wrap').append(t);
        $('#addTip-val')[0].focus();
    })



    //编辑基本信息
    $('.openEditor').click(function () {
        if(!isLogin()){
            $('.modle-login').show();
            showLogin();
            return;
        };
        $('.basicIfo-div').hide();
        $('#basicIfoForm').show();
        var data=[];
        $('#basicInfo-ul li').each(function (u,index) {
            data.push({key:$(this).find("span:first-child").html(),val:$(this).find("span:last-child").html()})
        });
        var dataId=$(this).data('id');
        var dataName=$(this).data('name');
        var EditorVue=new Vue({
            el:'#basicIfoForm',
            data:{
                info:data,
                addInfo:[],
                addData:[],
                EditorStatus:true,
                saveStatus:true,
                saveAddStatus:true
            },
            methods:{
                saveEditor:function () {
                    var _this=this;
                    _this.saveAddStatus=true;
                    _this.saveStatus=true;
                    if(this.addInfo.length>0){
                        this.addInfo.forEach(function (u,index) {

                            if(u.key=='' || u.val==''){
                                _this.saveStatus=false
                            }
                        });
                    }
                    this.info.forEach(function (u,index) {
                        console.log(u.key=='' || u.val=='')

                        if(u.key=='' || u.val==''){

                            _this.saveAddStatus=false
                        }
                    });

                    if(_this.saveStatus&&_this.saveAddStatus){
                        _this.addData=_this.info;
                        _this.addInfo.forEach(function (u,index) {
                            _this.addData.push(u)
                        });
                        _this.addInfo=[];
                        _this.info=_this.addData;
                        if(this.info.length<1){
                            $hint.open('修改内容不能为空');
                        }else{
                            ajax(JSON.stringify(_this.addData),dataName,dataId,function () {
                                _this.EditorStatus=false;
                                $hint.open('修改已经提交，请等待审核');
                            })
                        }
                    }else{
                        $hint.open('修改内容不能为空');
                    }

                },
                editorInfo:function () {
                    this.EditorStatus=true;
                },
                addBasicInfo: function () {
                    this.addInfo.push({key:"",val:""});
                }
            }
        });
    });

    $('.add-basicIfo').click(function () {
        var _li='<li><input type="text" class="basicInfo-item addName">：<input type="text" class="basicInfo-item addValue"><i class="icon iconfont icon-shanchu detalInfoadd" onclick="detail_info(this)"></i></li>';
        $('.addInfo-ulWrap').append(_li);
    })

    $('.add-infoBtn').find('a').click(function () {
        var $name=$('.updateNameVal').val();
        var $title=$('.workTitle-input').val();
        var $txt=$('.eSynopsisInfo').val();
        var tips=[], infoData=[],infoStatus=true;
        $('.tips-div').find('a').each(function (p1,p2) {
            if(p1>1){
                tips.push($(this).html())
            }
        });
        $('.addInfo-ulWrap li').each(function (u,index) {
            if($(this).find(".addName").val()=='' || $(this).find(".addValue").val()==''){
                infoStatus=false;
            }
            infoData.push({key:$(this).find(".addName").val(),val:$(this).find(".addValue").val()})
        });
        console.log(tips.join())
        if(!isLogin()){
            $hint.open('对不起，暂未登录，请您登陆后再操作');
            return;
        }
        if($name==''){
            $hint.open('作品名字不能为空');
            return;
        }
        if($txt==''){
            $hint.open('作品简介不能为空');
            return;
        }
        if(ajax_flag==false){
            ajax_flag=true;
            $.ajax({
                url:'/api/work/init/edit',
                data:{
                    workSeqNo:$('#workItemID').val(),
                    workName:$name,
                    workTitle:$title,
                    synopsis:$txt,
                    type:$('.smallLabel-val').html(),
                    category:$('.maxLabel-val').html(),
                    tags:tips.join(),
                    baseInfo:infoData.length>0?JSON.stringify(infoData):''
                },
                type:'post',
                success:function (data) {
                    if(data.data.resultCode==200){
                        ajax_flag=false;
                        $hint.open('您提交的信息正在审核中');
                        setTimeout(function () {
                            location.reload();
                        },3000)
                    }else{
                        $hint.open(data.data.resultMsg);
                    }
                }
            })
        }
    })

    var coverImgContent="",webfilepath='';
    var api_domain = "http://tmpfs.banquanbaike.com.cn/",
        chunkSize = 4*1024*1024,
        $list = $("#works-cover"),
        check_url = api_domain+"file/upload/check",
        // 缩略图大小
        ratio = window.devicePixelRatio || 1,
        thumbnailWidth = 100 * ratio,
        thumbnailHeight = 100 * ratio;
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
        return $.md5(file.name+"_"+file.size+"_"+file.lastModifiedDate.getTime()) ;
    }
    var uploader = WebUploader.create({
        auto:true,
        // 文件接收服务端。
        server: api_domain+'file/upload?X-Progress-ID='+generateUUID(),
        // 选择文件的按钮。可选。
        // 内部根据当前运行是创建，可能是input元素，也可能是flash.
        swf: 'http://cdn.staticfile.org/webuploader/0.1.5/Uploader.swf',
        pick: {
            id:'#filePicker',
            multiple: false
        },
        // 不压缩image, 默认如果是jpeg，文件上传前会压缩一把再上传！
        resize: false,
        accept: {
            title: 'Images',
            extensions: 'gif,jpg,jpeg,bmp,png',
            mimeTypes: 'image/*'
        }
    }).on( 'fileQueued', function( file ) {
        var $li = $(
            '<div id="' + file.id + '" class="file-item thumbnail">' +
            '<img>' +
            '<div class="info">' + file.name + '</div>' +
            '</div>'
            ),
            $img = $li.find('img');
        // $list为容器jQuery实例
        uploader.makeThumb( file, function( error, src ) {
            if ( error ) {
                $img.replaceWith('<span>不能预览</span>');
                return;
            }
            $img.attr( 'src', src );
        }, thumbnailWidth, thumbnailHeight );
    }).on( 'uploadProgress', function( file, percentage ) {
        var $li = $( '#'+file.id ),
            $percent = $li.find('.progress .progress-bar');

        // 避免重复创建
        if ( !$percent.length ) {
            $percent = $('<p class="progress progress-striped active"> '+'<div class="progress-bar" role="progressbar" style="width: 0%">' + '</div>' + '</div>').appendTo( $li ).find('.progress-bar');
        }
        $li.find('p.state').text('上传中');
        $percent.css( 'width', percentage * 100 + '%' );
    }).on( 'uploadSuccess', function( file ,data ) {
        console.log(data,"上传成功后的传入值");
        /*coverImgContent+=data.result.sourceId;*/
        coverImgContent=data.result.sourceId;
        webfilepath=data.result.webfilepath;
        console.log(coverImgContent+"中间分开"+webfilepath);
        $( '#'+file.id ).addClass('upload-state-done');
    }).on( 'uploadError', function( file ) {
        var $li = $( '#'+file.id ),
            $error = $li.find('div.error');

        // 避免重复创建
        if ( !$error.length ) {
            $error = $('<div class="error"></div>').appendTo( $li );
        }
        $error.text('上传失败');
    }).on( 'uploadComplete', function( file ) {
    });
    //当所有文件上传结束时触发
    uploader.on("uploadFinished",function(){
        if(coverImgContent!==" "){
            console.log(coverImgContent.toString(),"传给后台的值");
            console.log(webfilepath,"shangchaun de zhi ")
            ajax(coverImgContent.toString(),$('#filePicker').data('name'),$('#filePicker').data('id'),function () {
                $hint.open('上传成功，请等待审核');
                $('#filePicker').hide();
                $list.append('<a style="background-image: url('+webfilepath+')"></a>')
            });
        }else{
            layer.alert('请添加上传的封面图片');
        }
    });
});

//修改标签
var nowTips=null;
function updateTips(e) {
    nowTips=$(e);
    if($(e).hasClass('active')){
        $('.modle-tips').find('.detail-tips').hide();
    }else{
        $('.modle-tips').find('.detail-tips').show()
    }
    $('.update-tips').val($(e).html());
    $('.tips-module').show()
}
//增加标签
function addTips(e) {
    if($(e).val()!=''){
        var t='<a onclick="updateTips(this)">'+$(e).val()+'</a>';
        $(e).remove();
        $('.tips-div').append(t);
    }else{
        $(e).remove();
    }
}
//删除信息
function detail_info(e) {
    $(e).parent().remove()
}
//验证非空
function isNull( str ){
    if ( str == "" ) return true;
    var regu = "^[ ]+$";
    var re = new RegExp(regu);
    return re.test(str);
}
function isURL(str_url){
    var reg=/^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)(([A-Za-z0-9-~]+)\.)+([A-Za-z0-9-~\/])+$/;
    return reg.test(str_url);
}
function delCoverImg(e,file) {
    uploader.removeFile( file,true );
    $(e).parent().remove()
}

function ajax(content,dataName,dataId,callback) {
    if(ajax_flag){
        return
    }
    ajax_flag=true;
    $.ajax({
        url: '/api/work/chapter/edit',
        type: 'post',
        data:{
            workSeqNo:workSeqNo,
            content:content,
            name:dataName,
            chapterId:dataId
        },
        success:function (data) {
            console.log(data);
            if(data.status){
                if(data.data.resultCode==200){
                    callback();
                }else{
                    $hint.open(data.data.resultMsg);
                }
                ajax_flag =false;
            }else{
                $hint.open(data.resultMsg);
                ajax_flag =false;
            }
        }
    });
}

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
$(".close_btn").click(function () {
    $(this).parent().parent().parent().parent().hide();
});