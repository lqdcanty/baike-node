$(function(){
    var registerId=$(".newRegisterId").text(),workId,rejectReason="",searchText;
    pageGet();
    //分页函数
    function page(){
        laypage({
            cont: $('#page1'), //容器。值支持id名、原生dom对象，jquery对象。
            pages: allPage, //通过后台拿到的总页数
            curr: curPage || 1, //当前页
            jump: function(obj, first){ //触发分页后的回调
                if(!first){ //点击跳页触发函数自身，并传递当前页：obj.curr
                    console.log({pagenumber:obj.curr});
                    var urlTemp='api/work/workFollow?registerId='+registerId+'&pagenumber='+obj.curr+'&pagesize=10';
                    messageList(urlTemp);
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

    //点击每一行的取消关注获取的内容
    $(".message_audit").on("click",".auditBrower",function(){
        $("#attentionWrap").show();
        workId=$(this).parents("tr").children("td").eq(0).text();
        console.log(workId);
        ////点击之后获取显示的内容
        $(".span1").text($(this).parents("tr").children("td").eq(1).text());
    })

    //取消关注
    $("#passAttentionBtn").click(function(){
        var urlTemp="/api/work/subscribe";
        var data={workSeqNo:workId,status:"cancel_subscribe"}
        ajax(urlTemp,data,function(data){
            $hint.open(data.resultMsg);
            $("#attentionWrap").hide();
            location.reload();
        },function (data) {
            $hint.open(data.resultMsg);
            $("#attentionWrap").hide();
        });
    })
    $(".NEWreject_close").click(function(){
        $("#attentionWrap").hide();
       // $(".temp_audit").html("");
    })


    //获取当前页的列表内容
    function messageList(url){
        $.ajax({
            type: "get",
            url: url,
            success: function (data) {
                console.log(data,"ajax");
                var _data=data.data;
                if(_data.resultCode == 200){
                    var data0 = _data.result.follow;
                    console.log(data0);
                    if(data0.list.length>0){
                        console.log(data0.list.length);
                        var html="";
                        for (var i = 0; i < data0.list.length; i++) {
                            if(data0.list[i].monitorStatus==1){
                                html += '<tr><td style="display: none">'+data0.list[i].workSeqNo+'</td><td><a class="aColor" href="/item/'+data0.list[i].workSeqNo+'" target="_blank">'+data0.list[i].name+'</a></td><td>'+data0.list[i].type+'</td><td>已解锁</td> <td>'+data0.list[i].updateTime+'</td> <td> <a class="audit_a auditBrower">取消关注</a> </td> </tr>';
                            }else{
                                html += '<tr><td style="display: none">'+data0.list[i].workSeqNo+'</td><td>'+data0.list[i].name+'</td><td>'+data0.list[i].type+'</td><td>待解锁</td> <td>'+data0.list[i].updateTime+'</td> <td> <a class="audit_a auditBrower">取消关注</a> </td> </tr>';
                            }
                        }
                        var span='<span class="html_totalPage">'+data0.totalPage+'</span><span class="html_currentPage">'+data0.currentPage+'</span>';

                        $("#attentionWork").html(html);
                        $(".hhiddenPage").html(span);
                        pageGet();
                     }

                    }else{
                        $("#attentionWork").html("没有数据");
                        $("#page1").css("display","none");
                        $(".bottom").addClass("pc_fixed");
                    }
                }
        })
    }
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