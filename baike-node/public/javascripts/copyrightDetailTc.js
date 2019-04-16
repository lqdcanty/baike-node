$(function(){
    var nameReal,idStyle,careId,style_category,realed_name="",realed_id="";
    //原始著作
    $(".scope .scope_div").each(function(){
        $(this).click(function(){
            $(this).toggleClass("on");
        })
    })
    //声明权力内容
    var state_textarea=$("#state_textarea").val();
    $("#state_textarea").blur(function(){
        state_textarea=$(this).val();
        console.log(state_textarea,"state_textarea")
    })
    var copyrightId=$(".copyrightId").text();
    var copyrighttype=$(".copyrighttype").text();

console.log(copyrightId,copyrighttype);
    //实名制
//反面
    var coverImgContent1="",coverImgContent1="",z="",f="",coverImgContent2="",coverImgContent2="";
    function careId_f(){
        var api_domain = "http://tmpfs.banquanbaike.com.cn/", //线上
            /*var api_domain = "http://tmpfs.banquanjia.com.cn/",*/
            chunkSize = 3*1024*1024,
            $list = $("#filef"),
            check_url = api_domain+"file/upload/check",
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
            server: api_domain+'file/upload?X-Progress-ID='+generateUUID(),
            swf: 'http://cdn.staticfile.org/webuploader/0.1.5/Uploader.swf',
            pick: {id:'#filePicker2', multiple: false},
            resize: false,
            preserveHeaders: true,
            //添加
            /*  duplicate:true,*/
            /* multiple: false,*/
            /*  threads :1,//上传并发数，允许同时最大上传进程数
             fileNumLimit:1,//验证文件总数量, 超出则不允许加入队列。*/
            /*  chunkRetry:false,//如果失败，则不重试*/
            //结束
            accept: {title: 'Images', extensions: 'gif,jpg,jpeg,bmp,png', mimeTypes: 'image/*'}
        }).on( 'fileQueued', function( file ) {
            var $li = $('<div id="' + file.id + '" class="file-item thumbnail">' + '<img>' + '<div class="info">' + file.name + '</div>' + '</div>'),
                $img = $li.find('img');
            $list.html( $li ); // $list为容器jQuery实例
            uploader.makeThumb( file, function( error, src ){
                if ( error ) {
                    $img.replaceWith('<span>不能预览</span>');
                    return;
                }
                $img.attr( 'src', src );
            }, thumbnailWidth, thumbnailHeight );
        }).on( 'uploadSuccess', function( file ,data ) {
            /* console.log(data,"上传成功后的传入值");*/
            coverImgContent2=data.result.sourceId;//得到的值
            $( '#'+file.id ).addClass('upload-state-done');
        }).on( 'uploadError', function( file ) {
            var $li = $( '#'+file.id ),
                $error = $li.find('div.error');
            // 避免重复创建
            if (!$error.length) {
                $error = $('<div class="error"></div>').appendTo( $li );
            }
            $error.text('上传失败');
        }).on( 'uploadComplete', function( file ) {
        });
        uploader.on("uploadFinished",function() {
            if (coverImgContent2!== " ") {
                f=coverImgContent2;// 赋值
                console.log(f+"值2");
            } else {
                $hint.open("请添加上传的封面图片");
            }
        })
    }
    function careId_z(){
        /* var api_domain = "http://tmpfs.banquanjia.com.cn/",*/
        var api_domain = "http://tmpfs.banquanbaike.com.cn/",//线上
            chunkSize = 4*1024*1024,
            $list = $("#filez"),
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
            server: api_domain+'file/upload?X-Progress-ID='+generateUUID(),
            swf: 'http://cdn.staticfile.org/webuploader/0.1.5/Uploader.swf',
            pick: {id:'#filePicker1', multiple: false},
            resize: false,
            preserveHeaders: true,
            accept: {title: 'Images', extensions: 'gif,jpg,jpeg,bmp,png', mimeTypes: 'image/*'}
        }).on( 'fileQueued', function( file ) {
            var $li = $('<div id="' + file.id + '" class="file-item thumbnail">' + '<img>' + '<div class="info">' + file.name + '</div>' + '</div>'),
                $img = $li.find('img');
            $list.html( $li ); // $list为容器jQuery实例
            uploader.makeThumb( file, function( error, src ) {
                if ( error ) {
                    $img.replaceWith('<span>不能预览</span>');
                    return;
                }
                $img.attr( 'src', src );
            }, thumbnailWidth, thumbnailHeight );
        }).on( 'uploadSuccess', function( file ,data ) {
            /* console.log(data,"上传成功后的传入值");*/
            coverImgContent1=data.result.sourceId;//得到的值
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
            if (coverImgContent1!==" ") {
                z=coverImgContent1;
                console.log(z+"值1");
            } else {
                $hint.open("请添加上传的封面图片");
            }
        })
    }



    idStyle= $("#smIds").val();
    console.log(idStyle,"最开始");

    $("#smIds").change(function (){
        idStyle = $("#smIds  option:selected").val();
        console.log(idStyle);
        if(idStyle!="1"){
            $(".box_photo_right").addClass("on");
        }else {
            $(".box_photo_right").removeClass("on");
        }
    })
    careId= $("#careId").val();
    $("#careId").blur(function(){
        careId=$(this).val();
        console.log(careId,"careId的值")
    })
    nameReal= $("#nameReal").val();
    $("#nameReal").blur(function(){
        nameReal=$(this).val();
        console.log(nameReal)
    })

    function Name(name) {
        var pattern=/[`~%!@#^=''?~！@#￥……&——‘”“'？*()（），,。.、]/;
        if(!pattern.test(name)){
            var regName =/[\u4E00-\u9FA5]{2,5}(?:·[a-zA-Z]{2,20})*/;
            if(!regName.test(name)){
                return false;
            }else{
                return true;
            }
        }else{
            return false;
        }
    }
    //护照验证
    function isPassport(number){
        var str=number;
//在JavaScript中，正则表达式只能使用"/"开头和结束，不能使用双引号
        var Expression=/(P\d{7})|(G\d{8})/;
        var objExp=new RegExp(Expression);
        if(objExp.test(str)==true){
            return true;
        }else{
            return false;
        }
    };
    //判断是否为统一社会信用代码格式（营业执照）；
    function isEnterpriseSCCode(obj) {
        //代码字符集-代码字符
        var charCode = ["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F","G","H","J","K","L","M","N","P","Q","R","T","U","W","X","Y"];
        //代码字符集-代码字符数值
        var charVal = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30];
        //各位置序号上的加权因子
        var posWi = [1,3,9,27,19,26,16,17,20,29,25,13,8,24,10,30,28];
        //统一代码由十八位的数字或大写英文字母（不适用I、O、Z、S、V）组成，第18位为校验位。
        //第1位为数字或大写英文字母，登记管理部门代码
        //第2位为数字或大写英文字母，机构类别代码
        //第3到8位共6位全为数字登记管理机关行政区划码
        //第9-17位共9位为数字或大写英文字母组织机构代码
        //第18为为数字或者大写的Y
        var city = { 11: "北京", 12: "天津", 13: "河北", 14: "山西", 15: "内蒙古", 21: "辽宁", 22: "吉林", 23: "黑龙江 ", 31: "上海", 32: "江苏", 33: "浙江", 34: "安徽", 35: "福建", 36: "江西", 37: "山东", 41: "河南", 42: "湖北 ", 43: "湖南", 44: "广东", 45: "广西", 46: "海南", 50: "重庆", 51: "四川", 52: "贵州", 53: "云南", 54: "西藏 ", 61: "陕西", 62: "甘肃", 63: "青海", 64: "宁夏", 65: "新疆", 71: "台湾", 81: "香港", 82: "澳门", 91: "国外" };
        var reg = /^([0-9ABCDEFGHJKLMNPQRTUWXY]{2})([0-9]{6})([0-9ABCDEFGHJKLMNPQRTUWXY]){10}$/;
        if (obj.length != 0) {
            if (!reg.test(obj)) {
                return false;
            }
            else if (!city[obj.substr(2, 2)]) {
                return false;
            }
            else {
                //校验位校验
                obj = obj.split('');
                //∑(ci×Wi)(mod 31)
                var sum = 0;
                var ci = 0;
                var Wi = 0;
                for (var i = 0; i < 17; i++) {
                    ci = charVal[charCode.indexOf(obj[i])];
                    Wi = posWi[i];
                    sum += ci * Wi;
                }
                var c10 = 31 - (sum % 31);
                c10 = 31 == c10 ? 0 : c10;
                return c10 == charCode.indexOf(obj[17]);
            }
            return true;
        }
    }
    //身份证验证
    function IdentityCodeValid(code) {
        var city={11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江 ",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北 ",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏 ",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外 "};
        var tip = "";
        var pass= true;

        if(!code || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(code)){
            tip = "身份证号格式错误";
            pass = false;
        }

        else if(!city[code.substr(0,2)]){
            tip = "地址编码错误";
            pass = false;
        }
        else{
            //18位身份证需要验证最后一位校验位
            if(code.length == 18){
                code = code.split('');
                //∑(ai×Wi)(mod 11)
                //加权因子
                var factor = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 ];
                //校验位
                var parity = [ 1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2 ];
                var sum = 0;
                var ai = 0;
                var wi = 0;
                for (var i = 0; i < 17; i++)
                {
                    ai = code[i];
                    wi = factor[i];
                    sum += ai * wi;
                }
                var last = parity[sum % 11];
                if(parity[sum % 11] != code[17]){
                    tip = "校验位错误";
                    pass =false;
                }
            }
        }
        return pass;
    }


    //三级联动
    var country = '';
    for (var a=0;a<=_areaList.length-1;a++) {
        var objContry = _areaList[a];
        country += '<option value="'+objContry+'" a="'+(a+1)+'">'+objContry+'</option>';
    }
    $("#country").html(country).chosen({search_contains: true}).change(function(){
        var a = $("#country").find("option[value='"+$("#country").val()+"']").attr("a");
        var _province = areaObj[a];
        var province = '';
        for (var b in _province) {
            var objProvince = _province[b];
            if (objProvince.n) {
                province += '<option value="'+objProvince.n+'" b="'+b+'">'+objProvince.n+'</option>';
            }
        }
        if (!province) {
            province = '<option value="" b="0">--</option>';
        }
        $("#province").html(province).chosen({search_contains: true}).change(function(){
            var b = $("#province").find("option[value='"+$("#province").val()+"']").attr("b");
            var _city = areaObj[a][b];
            var city = '';
            for (var c in _city) {
                var objCity = _city[c];
                if (objCity.n) {
                    city += '<option value="'+objCity.n+'">'+objCity.n+'</option>';
                }
            }
            if (!city) {
                var city = '<option value="">--</option>';
            }
            $("#city").html(city).chosen({search_contains: true}).change();
            $(".dept_select").trigger("chosen:updated");
        });
        $("#province").change();
        $(".dept_select").trigger("chosen:updated");
    });
    $("#country").change();
    careId_f();
    careId_z();
    var contactName=$(".contactName").val()
    $(".contactName").blur(function(){
        contactName=$(this).val();
    })
    var contactTele=$(".contactTele").val();
    $(".contactTele").blur(function(){
        contactTele=$(this).val();

    })
    var contactEmail=$(".contactEmail").val();
    $(".contactEmail").blur(function(){
        contactEmail=$(this).val();
    })
    //电话验证
    function checkTel(telphone){
        var isPhone = /^([0-9]{3,4}-)?[0-9]{7,8}$/;
        var isMob=/^((\+?86)|(\(\+86\)))?(13[012356789][0-9]{8}|15[012356789][0-9]{8}|18[02356789][0-9]{8}|147[0-9]{8}|1349[0-9]{7})$/;
        if(isMob.test(telphone)||isPhone.test(isPhone)){
            return true;
        }
        else{
            return false;
        }
    }
    //邮箱验证
    function  checkEmail(email) {
        var szReg=/^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;//
        if(!szReg.test(email)){
            $('.regist_errorMsg').find("p").show().html('邮箱格式不正确');
            return false;
        }else{
            return true;
        }
    }

var rightScopevalue=[],rightScopevalueString;
    setInterval(function(){
        console.log(z,f);
    },2000)
    realed_name = $("#realNameStyleSelect option:selected").val();
    realed_id=$("#realNameStyleSelect option:selected").attr("name");
    console.log(realed_id,realed_name);
$("#realNameStyleSelect").change(function(){
    realed_name = $("#realNameStyleSelect option:selected").val();
    realed_id=$("#realNameStyleSelect option:selected").attr("name");
    console.log(realed_id,realed_name);
    if(realed_name=="新增"){
        $(".selectReal").hide().siblings(".add_real").show();
        $(".contactName").val("");
        $(".contactTele").val("")
        $(".contactEmail").val("")
    }else {
        $(".add_real").hide().siblings(".selectReal").show();
        var url="/api/copyright/statementPo";
        var datan={id:realed_id};

        ajax(url,datan,function(data){
            console.log(data)
            var cardTypeWord,real_photo_html;
            if(data.result.cardType=="1"){
                cardTypeWord="身份证";
            }else if(data.result.cardType=="2"){
                cardTypeWord="营业执照";
            }else if(data.result.cardType=="3"){
                cardTypeWord="护照";
            }
            if(data.result.attr2!=""){
                real_photo_html="<img src='"+data.result.attr1+"'><img src='"+data.result.attr2+"'>";
            }else{
                real_photo_html="<img src='"+data.result.attr1+"'>";
            }
            $("#real_carStyle").text(cardTypeWord);
            $("#real_photo").html(real_photo_html);
            $("#real_name").text(data.result.name);
            $("#real_carno").text(data.result.cardNo);
            $("#real_country").text(data.result.country);
            $("#real_province").text(data.result.province);
            $("#real_city").text(data.result.city);
            $(".contactName").val(data.result.contacts)
            $(".contactTele").val(data.result.contactsPhone)
            $(".contactEmail").val(data.result.contactsEmail)
            contactName=$(".contactName").val()
            $(".contactName").blur(function(){
                contactName=$(this).val();
            })
            contactTele=$(".contactTele").val();
            $(".contactTele").blur(function(){
                contactTele=$(this).val();

            })
            contactEmail=$(".contactEmail").val();
            $(".contactEmail").blur(function(){
                contactEmail=$(this).val();
            })
        },function(data){
            $hint.open(data.resultMsg);
        })
    }
})




    var tempUrlReal="/api/copyright/updateStatement";
    function clickNews_btn(){
        $("#news_btn").click(function(){
            rightScopevalue=[];
            rightScopevalueString="";
            $(".scope_div").each(function(){
                if($(this).hasClass("on")){
                    var tempVale=$(this).children("label").children("input").val();
                    console.log(tempVale);
                    rightScopevalue.push(tempVale);
                }
                rightScopevalueString=rightScopevalue.toString()
            })
            console.log(rightScopevalue)
            console.log(realed_name,"realed_name的值")
            if(realed_name=="新增"||realed_name==""||realed_name==undefined){
                if(idStyle=="1"){
                    if($(".style_pp").text()=='zs'&&rightScopevalueString==""){
                        $hint.open("请填写权力范围");
                    }else if(state_textarea==""){
                        $hint.open("声明权力不能为空");
                    }else if(z==""){
                        $hint.open("请上传证件正面");
                    }else if(f==""){
                        $hint.open("请上传证件反面");
                    }else if(!Name(nameReal)){
                        $hint.open("请填写正确的姓名");
                    }else if(!IdentityCodeValid(careId)){
                        $hint.open("请填写正确的证件号码");
                        console.log(IdentityCodeValid(careId),careId)
                    }else if(contactName==""){
                        $hint.open("联系人不能为空");
                    }else if(!checkTel(contactTele)){
                        $hint.open("请填写正确的联系电话");
                    }else if(!checkEmail(contactEmail)){
                        $hint.open("请填写正确的联系邮箱");
                    }else{
                        var tempDate={
                            cardType: idStyle,
                            attr1: z,
                            attr2: f,
                            name: nameReal,
                            cardNo: careId,
                            country: $("#country").val(),
                            province: $("#province").val(),
                            city: $("#city").val(),
                            statement: state_textarea,
                            type: copyrighttype,
                            email: contactEmail,
                            contactName: contactName,
                            telephone: contactTele,
                            copyrightId: copyrightId,
                            rightScope:rightScopevalueString,
                            poId:""
                        }
                        console.log(tempDate)
                        ajax(tempUrlReal,tempDate,function(data){
                            $("#message_tis").show();
                            /!*  location.reload();*!/
                        },function(data){
                            $hint.open(data.resultMsg);
                        })
                    }
                }else if(idStyle=="2"){
                    if($(".style_pp").text()=='zs'&&rightScopevalueString==""){
                        $hint.open("请填写权力范围");
                    }else if(state_textarea==""){
                        $hint.open("声明权力不能为空");
                    }else if(z==""){
                        $hint.open("请上传证件");
                    }else if(!Name(nameReal)){
                        $hint.open("请填写正确的姓名");
                    }else if(!isEnterpriseSCCode(careId)){
                        $hint.open("请填写正确的证件号码");
                    }else if(contactName==""){
                        $hint.open("联系人不能伟空");
                    }else if(!checkTel(contactTele)){
                        $hint.open("请填写正确的联系电话");
                    }else if(!checkEmail(contactEmail)){
                        $hint.open("请填写正确的联系邮箱");
                    }else{
                        var tempDate={
                            cardType: idStyle,
                            attr1: z,
                            attr2: "",
                            name: nameReal,
                            cardNo: careId,
                            country: $("#country").val(),
                            province: $("#province").val(),
                            city: $("#city").val(),
                            statement: state_textarea,
                            type: copyrighttype,
                            email: contactEmail,
                            contactName: contactName,
                            telephone: contactTele,
                            copyrightId: copyrightId,
                            rightScope:rightScopevalueString,
                            poId:""
                        }
                        console.log(tempDate)
                        ajax(tempUrlReal,tempDate,function(data){
                            $("#message_tis").show();
                            /!*  location.reload();*!/
                        },function(data){
                            $hint.open(data.resultMsg);
                        })
                    }
                }else if(idStyle=="3"){
                    if($(".style_pp").text()=='zs'&&rightScopevalueString==""){
                        $hint.open("请填写权力范围");
                    }else if(state_textarea==""){
                        $hint.open("声明权力不能为空");
                    }else if(z==""){
                        $hint.open("请上传证件");
                    }else if(!Name(nameReal)){
                        $hint.open("请填写正确的姓名");
                    }else if(!isPassport(careId)){
                        $hint.open("请填写正确的证件号码");
                    }else if(contactName==""){
                        $hint.open("联系人不能为空");
                    }else if(!checkTel(contactTele)){
                        $hint.open("请填写正确的联系电话");
                    }else if(!checkEmail(contactEmail)){
                        $hint.open("请填写正确的联系邮箱");
                    }else{
                        var tempDate={
                            cardType: idStyle,
                            attr1: z,
                            attr2: "",
                            name: nameReal,
                            cardNo: careId,
                            country: $("#country").val(),
                            province: $("#province").val(),
                            city: $("#city").val(),
                            statement: state_textarea,
                            type: copyrighttype,
                            email: contactEmail,
                            contactName: contactName,
                            telephone: contactTele,
                            copyrightId: copyrightId,
                            rightScope:rightScopevalueString,
                            poId:""
                        }
                        console.log(tempDate)
                        ajax(tempUrlReal,tempDate,function(data){
                            $("#message_tis").show();
                            /!*  location.reload();*!/
                        },function(data){
                            $hint.open(data.resultMsg);
                        })
                    }
                }
            }else{
                if($(".style_pp").text()=='zs'&&rightScopevalueString==""){
                    $hint.open("请填写权力范围");
                }else if(state_textarea==""){
                    $hint.open("声明权力不能为空");
                }else if(contactName==""){
                    $hint.open("联系人不能为空");
                }else if(!checkTel(contactTele)){
                    $hint.open("请填写正确的联系电话");
                }else if(!checkEmail(contactEmail)){
                    $hint.open("请填写正确的联系邮箱");
                }else{
                    var tempDate={
                        statement: state_textarea,
                        type: copyrighttype,
                        email: contactEmail,
                        contactName: contactName,
                        telephone: contactTele,
                        copyrightId: copyrightId,
                        rightScope:rightScopevalueString,
                        poId:realed_id
                    }
                    console.log(tempDate)
                    ajax(tempUrlReal,tempDate,function(data){
                        $("#message_tis").show();
                        /*  location.reload();*/
                    },function(data){
                        $hint.open(data.resultMsg);
                    })
                }
            }
        })
    }

    clickNews_btn();

    //ajax的封装
    //可以传的参数。   curl，data，function（）；
    function ajax(url,data,succCallback,errorCallback){
        $.ajax({
            url:url,
            type:"post",
            data:data,
            success:function(data){
                if(data.status){
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