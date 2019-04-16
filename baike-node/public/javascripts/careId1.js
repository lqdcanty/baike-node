$(function(){
    var coverImgContent="",webfilepath='';
    var api_domain = "http://tmpfs.banquanjia.com.cn/",
        chunkSize = 4*1024*1024,
        $list = $("#fileList"),
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
        $list.html( $li );
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
        console.log(coverImgContent);
        if(coverImgContent!==" "){
            console.log(coverImgContent.toString(),"传给后台的值");
            console.log(webfilepath,"shangchaun de zhi ")
            ModifyAjax({photo:coverImgContent})

        }else{
            layer.alert('请添加上传的封面图片');
        }

    });
})