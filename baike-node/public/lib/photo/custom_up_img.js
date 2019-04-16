$(document).ready(function(){
        $("#up-img-touch").click(function(){
        		  $("#doc-modal-1").modal({width:'600px'});
        });
         $("#id_photo_qian").click(function(){
                  $("#doc-modal-1").modal({width:'600px'});
        });
          $("#id_photo_hou").click(function(){
                  $("#doc-modal-1").modal({width:'600px'});
        });
});
$(function() {
    'use strict';
    // 初始化
    var $image = $('#image');
    $image.cropper({
        aspectRatio: '1',
        autoCropArea:0.8,
        preview: '.up-pre-after',

    });

    // 事件代理绑定事件
    $('.docs-buttons').on('click', '[data-method]', function() {
   
        var $this = $(this);
        var data = $this.data();
        var result = $image.cropper(data.method, data.option, data.secondOption);
        switch (data.method) {
            case 'getCroppedCanvas':
            if (result) {
                // 显示 Modal
                $('#cropped-modal').modal().find('.am-modal-bd').html(result);
                $('#download').attr('href', result.toDataURL('image/jpeg'));
            }
            break;
        }
    });
    
    

    // 上传图片
    var $inputImage = $('#inputImage');
    var URL = window.URL || window.webkitURL;
    var blobURL;
    var api_domain = "http://tmpfs.banquanjia.com.cn/";


    if (URL) {
        $inputImage.change(function () {
            var files = this.files;
            var file;

            if (files && files.length) {
               file = files[0];

               if (/^image\/\w+$/.test(file.type)) {
                    blobURL = URL.createObjectURL(file);
                    $image.one('built.cropper', function () {
                        // Revoke when load complete
                       URL.revokeObjectURL(blobURL);
                    }).cropper('reset').cropper('replace', blobURL);
                    $inputImage.val('');
                } else {
                    window.alert('Please choose an image file.');
                }
            }

            // Amazi UI 上传文件显示代码
            var fileNames = '';
            $.each(this.files, function() {
                fileNames += '<span class="am-badge">' + this.name + '</span> ';
            });
            $('#file-list').html(fileNames);
        });
    } else {
        $inputImage.prop('disabled', true).parent().addClass('disabled');
    }
    
    //绑定上传事件
    $('#up-btn-ok').on('click',function(){
    	var $modal = $('#my-modal-loading');
    	var $modal_alert = $('#my-alert');
    	var img_src=$image.attr("src");
    	console.log(img_src+"地址一");
    	if(img_src==""){
    		set_alert_info("没有选择上传的图片");
    		$modal_alert.modal();
    		return false;
    	}
    	//我添加的
        var api_domain = "http://tmpfs.banquanjia.com.cn/";
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
        //添加的结束

    	$modal.modal();

    	var url=$(this).attr("url");
    	console.log("图片地址为"+url);
    	var canvas=$("#image").cropper('getCroppedCanvas');
    	var data=canvas.toDataURL(); //转成base64
        console.log("转化后的地址"+canvas+"  "+data);
        $.ajax( {  
                url:api_domain+'file/upload?X-Progress-ID='+generateUUID(),
                dataType:'json',
                type: "POST",
                data: {"photo":data.toString()},
                success: function(data, textStatus){
                    console.log(data);
                	$modal.modal('close');
                	set_alert_info(data.result);
                	$modal_alert.modal();
                	if(data.result=="ok"){
                		$("#show-img img").attr("src",data.file);
                	
                		var img_name=data.file.split('/')[2];
                		console.log(img_name);
                		$("#pic").text(img_name);
                	}
                },
                error: function(){
                	$modal.modal('close');
                	set_alert_info("上传文件失败了！");
                	$modal_alert.modal();
                	//console.log('Upload error');  
                }  
         });  
    	
    });
    
});

function rotateimgright() {
$("#image").cropper('rotate', 90);
}


function rotateimgleft() {
$("#image").cropper('rotate', -90);
}

function set_alert_info(content){
	$("#alert_content").html(content);
}



 
