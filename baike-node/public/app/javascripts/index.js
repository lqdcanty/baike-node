$(function () {

    var itemIndex = 0;
    var curPage=0;
    var totalPage=0;
    var num=1;
    var tabLoadEndArray = [false, false, false,false,false,false,false];
    var tabLenghtArray = [28, 15, 47];
    var tabScroolTopArray = [0, 0, 0, 0, 0, 0, 0];

    // dropload
    var dropload = $('.inner').dropload({
        scrollArea: window,
        domDown: {
            domClass: 'dropload-down',
            domRefresh: '<div class="dropload-refresh">上拉加载更多</div>',
            domLoad: '<div class="dropload-load"><span class="loading"></span>加载中...</div>',
            domNoData: '<div class="dropload-noData">已无数据</div>'
        },
        loadDownFn: function (me) {
            setTimeout(function () {
                if (tabLoadEndArray[itemIndex]) {
                    me.resetload();
                    me.lock();
                    me.noData();
                    me.resetload();
                    return;
                }
                $.ajax({
                    type: 'GET',
                    url: '/app/list?keyword='+$('.keyword').val()+'&currentPage='+(parseInt(curPage)+1),
                    dataType: 'json',
                    success: function(data){
                        var result = '';
                        var newData=data.data.result.workList;
                        totalPage=data.data.result.totalPage;
                        curPage=data.data.result.currentPage;
                        if(curPage==totalPage){
                            tabLoadEndArray[itemIndex] = true;
                        }
                        for(var i = 0; i <newData.length; i++){
                            var t='';
                            if(newData[i].name&&newData[i].name!=null&&newData[i].name!=''){
                                t='<span class="works-title">（'+newData[i].workTitle+'）</span>'
                            }
                            if (itemIndex == 0) {
                                result += '<li>' +
                                    '<div class="name-wrap">' +
                                    '<span class="works-name">'+newData[i].name+'</span>' +
                                    +t+
                                    '</div>' +
                                    '<div class="clearfix content-wrap"><div class="float_left">' +
                                    '<a class="cover-img" style="background-image: url("'+newData[i].cover+'") no-repeat"></a>' +
                                    '<span></span>' +
                                    '</div>' +
                                    '<div class="float_right right-content">' +
                                    '<p class="works-content">'+newData[i].synopsis+'</p>' +
                                    '<p class="works-btns"><a><span class="app-images icon_sm"></span>声明我的版权</a>' +
                                    '<a><span class="app-images icon_bq"></span>获得作品授权</a>' +
                                    '<a><span class="app-images icon_bql"></span>版权链</a></p></div></div>';
                                var s='';
                                if(newData[i].copyrights.length>0){
                                    s='<div class="yz-item">' +
                                        '<span>原著</span>' +
                                        '<span>'+newData[i].copyrights[0].name+'</span>' +
                                        '<a>查看</a>' +
                                        '</div>'
                                }
                                result+=s+'</li>';
                            } else if (itemIndex == 1) {
                                result += '<li>' +
                                    '<div class="name-wrap">' +
                                    '<span class="works-name">'+newData[i].name+'</span>' +
                                    +t+
                                    '</div>' +
                                    '<div class="clearfix content-wrap"><div class="float_left">' +
                                    '<a class="cover-img" style="background-image: url("'+newData[i].cover+'") no-repeat"></a>' +
                                    '<span></span>' +
                                    '</div>' +
                                    '<div class="float_right right-content">' +
                                    '<p class="works-content">'+newData[i].synopsis+'</p>' +
                                    '<p class="works-btns"><a><span class="app-images icon_sm"></span>声明我的版权</a>' +
                                    '<a><span class="app-images icon_bq"></span>获得作品授权</a>' +
                                    '<a><span class="app-images icon_bql"></span>版权链</a></p></div></div>';
                                var s='';
                                if(newData[i].copyrights.length>0){
                                    s='<div class="yz-item">' +
                                        '<span>原著</span>' +
                                        '<span>'+newData[i].copyrights[0].name+'</span>' +
                                        '<a>查看</a>' +
                                        '</div>'
                                }
                                result+=s+'</li>';
                            } else if (itemIndex == 2) {
                                result += '<li>' +
                                    '<div class="name-wrap">' +
                                    '<span class="works-name">'+newData[i].name+'</span>' +
                                    +t+
                                    '</div>' +
                                    '<div class="clearfix content-wrap"><div class="float_left">' +
                                    '<a class="cover-img" style="background-image: url("'+newData[i].cover+'") no-repeat"></a>' +
                                    '<span></span>' +
                                    '</div>' +
                                    '<div class="float_right right-content">' +
                                    '<p class="works-content">'+newData[i].synopsis+'</p>' +
                                    '<p class="works-btns"><a><span class="app-images icon_sm"></span>声明我的版权</a>' +
                                    '<a><span class="app-images icon_bq"></span>获得作品授权</a>' +
                                    '<a><span class="app-images icon_bql"></span>版权链</a></p></div></div>';
                                var s='';
                                if(newData[i].copyrights.length>0){
                                    s='<div class="yz-item">' +
                                        '<span>原著</span>' +
                                        '<span>'+newData[i].copyrights[0].name+'</span>' +
                                        '<a>查看</a>' +
                                        '</div>'
                                }
                                result+=s+'</li>';
                            }
                        }
                        // 为了测试，延迟1秒加载
                        $('.lists').eq(itemIndex).append(result)
                        me.resetload();

                    },
                    error: function(xhr, type){
                        console.log('请求失败');
                        me.resetload();
                    }
                });

            }, 500);
        }
    });


    $('.nav').find('li').click(function (){
        $(this).addClass('active').siblings().removeClass('active')
        $('.keyword').val($(this).html());
        curPage=0;
        tabScroolTopArray[itemIndex] = $(window).scrollTop();
        var $this = $(this);
        itemIndex = $this.index();
        console.log(itemIndex)
        $(window).scrollTop(tabScroolTopArray[itemIndex]);


        $('.lists').eq(itemIndex).show().siblings('.lists').hide();
        console.log(tabLoadEndArray[itemIndex])
        if (!tabLoadEndArray[itemIndex]) {
            dropload.unlock();
            dropload.noData(false);
        } else {
            dropload.lock('down');
            dropload.noData();
        }
        // dropload.resetload();
    });
});