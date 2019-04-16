$(function(){
    var registerId=$(".newRegisterId").text(),applyId,rejectReason="",searchText,flageSearch=true;
    pageGet();

    //作品搜索审核
    $("#AuditSearchBtn").click(function(){
        flageSearch=false;
        searchText=$("#AuditSearchName").val();
        var pageCurr=1;
        var urlTemp='api/application/query/audit?registerId='+registerId+'&keyword='+searchText+'&page='+pageCurr;
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
                        var urlTemp='api/application/query/audit?registerId='+registerId+'&page='+obj.curr;
                        messageList(urlTemp);
                    }else{
                        var urlTemp='api/application/query/audit?registerId='+registerId+'&keyword='+searchText+'&page='+obj.curr;
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
                                html += '<tr><td style="display: none">'+data0.list[i].id+'</td> <td>'+data0.list[i].auditTime+'</td> <td><a href="/item/'+data0.list[i].workSeqNo+' target="_blank" class="aColor">'+data0.list[i].workName+'</a> </td> <td>'+data0.list[i].workType+'</td> <td>'+data0.list[i].remark+'</td> <td>'+data0.list[i].datetime+'</td> <td>'+data0.list[i].auditStatus+'</td> <td>'+data0.list[i].userName+'</td> </tr>';
                            }
                            var span='<span class="html_totalPage">'+data0.totalPage+'</span><span class="html_currentPage">'+data0.currentPage+'</span>';

                            $("#mgAudit").html(html);
                            $(".hhiddenPage").html(span);
                            pageGet();
                        }else{
                            $("#mgAudit").hide();
                        }
                    }else{
                        $("#mgAudit").html("没有数据 ");
                        $("#page1").css("display","none");
                        $(".bottom").addClass("pc_fixed");
                    }
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