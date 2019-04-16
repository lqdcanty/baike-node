$(function(){
    var registerId=$(".newRegisterId").text(),applyId,rejectReason="",searchText,flageSearch=true;
    $(".message_audit").on("click",".rejectAuditClick",function () {
        $("#AuditWrap").show();
        $("#rejectAuditWrap").show();
        applyId=$(this).parents("tr").children("td").eq(0).text();
        console.log(applyId)
    })
    $(".NEWreject_close").click(function(){
        $("#AuditWrap").hide();
        $("#rejectAuditWrap").hide();
        $("#passAuditWrap").hide();
        $("#seeAuditWrap").hide();
        $(".temp_audit").html("");
    })
    $(".message_audit").on("click",".passAuditClick",function(){
        $("#AuditWrap").show();
        $("#passAuditWrap").show();
        applyId=$(this).parents("tr").children("td").eq(0).text();
        console.log(applyId);
        ////点击之后获取显示的内容
        $(".span1").text($(this).parents("tr").children("td").eq(3).text());
        $(".span2").text($(this).parents("tr").children("td").eq(4).text());
        $(".span3").text($(this).parents("tr").children("td").eq(5).text());
    })
    //模板中的swiper
    var mySwiper1 = new Swiper ('#swiper_coverImg1', {
        slidesPerView : 'auto',
        spaceBetween : 32,
        nextButton: '.next-coverImg.coverImg1',
        prevButton: '.prev-coverImg.coverImg1'
    });
    //浏览修改的内容；
    pageGet();

    //作品搜索审核
    $("#AuditSearchBtn").click(function(){
        flageSearch=false;
        searchText=$("#AuditSearchName").val();
        var pageCurr=1;
        var urlTemp='api/application/search?registerId='+registerId+'&keyword='+searchText+'&page='+pageCurr;
        messageList(urlTemp);
        //pageGet();
    })
    //绑定enter事件
    $('#AuditSearchName').keypress(function(event){
        if(event.keyCode == 13&&$('#AuditSearchName').val()!=''){ //绑定回车
            $("#AuditSearchBtn").click();
            console.log("keycode");
        }
    });

    //审核通过
    $("#passAuditBtn").click(function(){
        var urlTemp="api/application/audit";
        var data={applyId:applyId,status:"adopt"}
        ajax(urlTemp,data,function(data){
            $hint.open(data.resultMsg);
            $("#AuditWrap").hide();
            $("#passAuditWrap").hide();
            location.reload();
        },function (data) {
            $hint.open(data.resultMsg);
            $("#AuditWrap").hide();
            $("#passAuditWrap").hide();
        });
    })

    //审核拒绝
    $("#rejectAuditBtn").click(function () {
        rejectReason=$("#auditReajectReason").val();
        console.log(rejectReason);
        var urlTemp="api/application/audit";
        var data={applyId:applyId,status:"reject",reason:rejectReason};
        ajax(urlTemp,data,function(data){
            $hint.open(data.resultMsg);
            $("#AuditWrap").hide();
            $("#passAuditWrap").hide();
            $("#rejectAuditWrap").hide();
            location.reload();
        },function (data) {
            $hint.open(data.resultMsg);
            $("#AuditWrap").hide();
            $("#passAuditWrap").hide();
            $("#rejectAuditWrap").hide();
        });
    })

    //分页函数
    function page(){
        laypage({
            cont: $('#page1'), //容器。值支持id名、原生dom对象，jquery对象。
            pages: allPage, //通过后台拿到的总页数
            curr: curPage || 1, //当前页
            jump: function(obj, first){ //触发分页后的回调
                if(!first){ //点击跳页触发函数自身，并传递当前页：obj.curr
                    console.log({page:obj.curr});
                    if(flageSearch){
                        var urlTemp='api/application/search?registerId='+registerId+'&page='+obj.curr;
                        messageList(urlTemp);
                    }else{
                        var urlTemp='api/application/search?registerId='+registerId+'&keyword='+searchText+'&page='+obj.curr;
                        messageList(urlTemp);
                    }
                }
            }
        });
    }
    //获取总页数和当前页数
    function pageGet(){
        allPage=$(".html_totalPage").text();
        curPage=parseInt($(".html_currentPage").text());
        console.log(allPage,curPage);
        if(allPage==0||allPage==1){
            $("#page1").css("display","none");
            $(".bottom").addClass("pc_fixed")
        }else{
            $("#page1").css("display","block")
        }
        page(allPage,curPage);
        if(allPage==curPage){
            $(".bottom").addClass("pc_fixed");
        }
    }

    //获取当前页的列表内容
    function messageList(url){
        $.ajax({
            type: "get",
            url: url,
            success: function (data) {
                console.log(data,"ajax");
                var _data=data.data;
                if(_data.resultCode == 200){
                    var data0 = _data.result;
                    console.log(data0);
                    if(data0.list.length>0){
                        console.log(data0.list.length);
                        var html="";
                        if(data0.list.length>0){
                            for (var i = 0; i < data0.list.length; i++) {
                                html += '<tr><td style="display: none">'+data0.list[i].id+'</td><td>'+data0.list[i].datetime+'</td><td>'+data0.list[i].userName+'</td><td><a href="/item/'+data0.list[i].workSeqNo+' target="_blank" class="aColor">'+data0.list[i].workName+'</a></td><td>'+data0.list[i].workType+'</td><td>'+data0.list[i].remark+'</td><td> <a class="audit_a auditBrower">预览</a></td><td><a class="audit_a pd20 passAuditClick">通过</a><a class="audit_a rejectAuditClick">驳回</a> </td> </tr>';
                            }
                            var span='<span class="html_totalPage">'+data0.totalPage+'</span><span class="html_currentPage">'+data0.currentPage+'</span>';

                            $(".message_audit").html(html);
                            $(".hhiddenPage").html(span);
                            pageGet();
                        }else{
                            $(".message_audit").hide();
                        }
                        //消息详情
                        /*$(".messageStyle_w tr").each(function(index,element){
                            $(this).children("td:last-child").children(".base1_detail_news").on("click",function(){
                                var newsId=$(this).parent("td").parent("tr").children("td:first-child").text();
                                console.log(newsId);
                                var dataId={id:newsId}
                                messageDetail(dataId);
                            })
                            var applyId_html= $(this).children("td:nth-child(2)").text();
                            var applytype_html=$(this).children("td:nth-child(3)").text();
                            console.log(applyId_html,applytype_html);
                        })*/
                    }else{
                        $(".message_audit").html("没有数据 ");
                        $("#page1").css("display","none");
                        $(".bottom").addClass("pc_fixed");
                    }
                }
            }
        })
    }

    //点击浏览获取的展示内容
    function Browse(){
        $(".message_audit").on("click",".auditBrower",function () {
            $(".temp_audit").html("");
            $("#AuditWrap").show();
            $("#seeAuditWrap").show();
            applyId=$(this).parents("tr").children("td").eq(0).text();
            console.log(applyId,"id")
           // var urlTemp='api/application/detail?registerId='+registerId+'&applyId='+applyId;
            $.ajax({
                type:'get',
                url:'api/application/detail?registerId='+registerId+'&applyId='+applyId,
                success:function (data) {
                    var _data=data.data;
                    if(_data.resultCode == 200){
                        console.log(_data.result.html);
                       $(".temp_audit").html(_data.result.html)
                    }
                    var mySwiper1 = new Swiper ('#swiper_coverImg1', {
                        slidesPerView : 'auto',
                        spaceBetween : 32,
                        nextButton: '.next-coverImg.coverImg1',
                        prevButton: '.prev-coverImg.coverImg1'
                    });
                    var mySwiper2 = new Swiper ('#swiper_coverImg2', {
                        slidesPerView : 'auto',
                        spaceBetween : 32,
                        nextButton: '.next-coverImg.coverImg2',
                        prevButton: '.prev-coverImg.coverImg2'
                    });
                }
            })
        })
    }
     Browse();

    //ajax函数封装
    var ajax_flag=false;
    function ajax(url,data,succCallback,errorCallback){
        if(ajax_flag){
            return
        }
        ajax_flag=true;
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
                            errorCallback(data.data)
                        }
                    }
                    ajax_flag =false;
                }else{
                    $hint.open(data.resultMsg);
                    ajax_flag =false;
                }
            }
        })
    }
})