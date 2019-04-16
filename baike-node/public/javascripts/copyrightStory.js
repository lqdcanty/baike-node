$(function(){
    var allPage,curPage;
    pageGet();
    page();
    //展示分页
    function page(){
        laypage({
            cont: $('#page1'), //容器。值支持id名、原生dom对象，jquery对象。
            pages:$('.html_totalPage').val(), //通过后台拿到的总页数
            curr: $('.html_currentPage').val(), //当前页
            jump: function(obj, first){ //触发分页后的回调
                if(!first){ //点击跳页触发函数自身，并传递当前页：obj.curr
                    location.href = '&currentPage='+obj.curr+'&pageSize=10';
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
           // $(".bottom").addClass("pc_fixed")
        }else{
            $("#page1").css("display","block")
          //  $(".bottom").removeClass("pc_fixed")
        }
        page(allPage,curPage);
        if(allPage==curPage){
            //$(".bottom").addClass("pc_fixed");
        }
    }

    $("#contribute").click(function(){
        $hint.open("该功能暂未开放");
    })

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
                        for (var i = 0; i < data0.list.length; i++) {
                            html+='<div class="works_information"><div class="works_top clearfix"> <a class="works_img" href="'+data0.list[i].sourceUrl+'" style="background-image: url('+data0.list[i].storyCover+');"></a> <div class="works_describe"> <p class="works_name"> <a href="'+data0.list[i].sourceUrl+'">'+data0.list[i].storyTitle+'</a> </p> <p class="works_content mt10">'+data0.list[i].synopsis+'</p> <p class="payment clearfix"> <span>稿件来源：</span><span>'+data0.list[i].storySource+'</span> <span class="ml50">'+data0.list[i].submissionTime+'</span> </p> </div> </div> </div>';
                        }
                        var span='<span class="html_totalPage">'+data0.totalPage+'</span><span class="html_currentPage">'+data0.currentPage+'</span>';

                        $(".storyList").html(html);
                        $(".hhiddenPage").html(span);
                        pageGet();
                    }

                }else{
                    $("#storyList").html("没有数据");
                    $("#page").css("display","none");
                    $(".bottom").addClass("pc_fixed");
                }
            },
            error:function(data){
                $hint.open("链接错误");
            }
        })
    }

})