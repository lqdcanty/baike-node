/**
 * Created by EFIDA on 2017/6/28.
 */
var registerTime = {
    elem: '#registerTime',
    format: 'YYYY/MM/DD',
    istoday: false,
    fixed: true,
    choose: function(datas){

    }
};
var start = {
    elem: '#authorize-startTime',
    format: 'YYYY/MM/DD',
    max: '2099-06-16', //最大日期
    min:'0001-01-01',
    istoday: false,
    fixed: true,
    choose: function(datas){
        end.min = datas; //开始日选好后，重置结束日的最小日期
        end.start = datas; //将结束日的初始值设定为开始日
        $('#authorize-startTime').parent().parent().find('.select-btn').find('a').each(function () {
            $(this).removeClass('on');
        });
        $('#authorize-startTime').parent().parent().find("input[name='validity']").val('notforerver');
    }
};
var end = {
    elem: '#authorize-endTime',
    format: 'YYYY/MM/DD',
    max: '2099-06-16',
    min:'0001-01-01',
    istoday: false,
    fixed: true,
    choose: function(datas){
        start.max = datas; //结束日选好后，重置开始日的最大日期
        $('#authorize-endTime').parent().parent().find('.select-btn').find('a').each(function () {
            $(this).removeClass('on');
        });
        $('#authorize-endTime').parent().parent().find("input[name='validity']").val('notforerver');
    }
};
var start1 = {
    elem: '#assignment-startTime',
    format: 'YYYY/MM/DD',
    max: '2099-06-16', //最大日期
    min:'0001-01-01',
    istoday: false,
    fixed: true,
    choose: function(datas){
        end1.min = datas; //开始日选好后，重置结束日的最小日期
        end1.start = datas; //将结束日的初始值设定为开始日
        $('#assignment-startTime').parent().parent().find('.select-btn').find('a').each(function () {
            $(this).removeClass('on');
        });
    }
};
var end1 = {
    elem: '#assignment-endTime',
    format: 'YYYY/MM/DD',
    max: '2099-06-16',
    min:'0001-01-01',
    istoday: false,
    fixed: true,
    choose: function(datas){
        start1.max = datas; //结束日选好后，重置开始日的最大日期
        $('#assignment-endTime').parent().parent().find('.select-btn').find('a').each(function () {
            $(this).removeClass('on');
        });
    }
};
var start2 = {
    elem: '#pledge-startTime',
    format: 'YYYY/MM/DD',
    max: '2099-06-16', //最大日期
    min:'0001-01-01',
    istoday: false,
    fixed: true,
    choose: function(datas){
        end2.min = datas; //开始日选好后，重置结束日的最小日期
        end2.start = datas; //将结束日的初始值设定为开始日
        $('#pledge-startTime').parent().parent().find('.select-btn').find('a').each(function () {
            $(this).removeClass('on');
        });
    }
};
var end2 = {
    elem: '#pledge-endTime',
    format: 'YYYY/MM/DD',
    max: '2099-06-16',
    min:'0001-01-01',
    istoday: false,
    fixed: true,
    choose: function(datas){
        start2.max = datas; //结束日选好后，重置开始日的最大日期
        $('#pledge-endTime').parent().parent().find('.select-btn').find('a').each(function () {
            $(this).removeClass('on');
        });
    }
};
laydate(start);
laydate(end);
laydate(start1);
laydate(end1);
laydate(start2);
laydate(end2);
laydate(registerTime);
$('.tips-o').tipso({
    useTitle: false,
    background: '#000',
    position:"right"
});
var myChart = echarts.init(document.getElementById('main'));
var workSeqNo=$('.workSeqNo').val();
var firstNode;
$(function () {
    if($('.fromType').val()=='getCopyRight'){
        $('.module-getCopyRight').show();
    }

    myChart.showLoading();
    getDatalist();
    var dataNames=['三国演义'];

    function createFunc() {
        $('.module-bql').show();
        $('#menuuu').hide()
    }
    function addFunc() {
        $('.module-work').show();
        $('#menuuu').hide()
    }
    $('.close_btn').click(function () {
        $('.module-bql').hide();
        $('.module-body').find('dl').removeClass('on');
        $('.module_content').hide();
    });
    $('.module-body').find('dl').click(function () {
        $(this).addClass('on').parent().siblings().find('dl').removeClass('on');
        var t=$(this).data('type');
        $('.module_content').each(function () {
            $(this).find('form')[0].reset();
            //关联作品----------star
            resetGxFrom();
            //关联作品----------end
            $(this).find('.authorize-type-item').find('li').find('a').removeClass('on');
            $('.error-msg').hide();
            if($(this).data('type')==t){
                $(this).show();
                if($('.now_name').attr('num')!='WORK'){
                    $(this).find("input[name='grant']").val($('.now_name').val()).attr('readonly',true);
                }
            }else{
                $(this).hide()
                $(this).find("input[name='grant']").val('').attr('readonly',false);
            }
        })
    });

    // 授权方式
    $('.authorize-type-item').find('a').click(function () {
        $(this).addClass('on').parent().siblings().find('a').removeClass('on');
        $(this).parent().parent().next().val($(this).data('type'));
        if($(this).data('type')=='other'){
            $(this).parent().parent().next().show().val('')
        }else{
            $(this).parent().parent().next().hide()
        }
    });
    //有效期
    $('.time-wrap').find('.select-btn').find('a').click(function () {
        $('.time-wrap').find('.select-btn').find('a').each(function () {
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

    //涉及金额
    $('.money-wrap').find('.select-btn').find('a').click(function () {
        if($(this).hasClass('on')){
            $(this).removeClass('on');
            $(this).parent().find("input[name='isopen']").val('false');

        }else{
            $(this).addClass('on')
            $(this).parent().find("input[name='isopen']").val($(this).data('true'));
        }
    });

    $('.create-lemma').click(function () {
        $('.module-work').hide();
        $('.module-bql').show();
    });
    $('.add-ppl').click(function () {
        var text=$(this).prev().attr('placeholder');
        var _name=$(this).prev().attr('name');
        var t='<li class="mb10"><input type="text" name='+_name+' placeholder='+text+'><a class="del-ppl" onclick="delInput(this)">删除</a></li>';
        $(this).parent().parent().append(t)
    });

    $('.nav_btn').hover(function () {
        var _this=this;
        $('.nav_content').show();
        $('.nav_wrap').each(function () {
            $(this).hide();
            if($(this).data('type')==$(_this).data('type')){
                $(this).show()
            }
        })
    },function () {
        $('.nav_content').hide();
    })

    $('.close-tips').click(function () {
        $(this).parent().parent().hide();
    })
});

function delInput(e) {
    $(e).parent().remove()
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
var dataListStatus=null;
function getDatalist() {
    $.ajax({
        url:'/api/copyright/getPaint?workSeqNo='+workSeqNo,
        type:'get',
        success:function (data) {
            myChart.hideLoading();
            if(data.data.resultCode&&data.data.resultCode==200){
                data.data.result.paint.forEach(function (p1, p2, p3) {
                    if (p1.nodeColor == 0) {
                        firstNode = {
                            menu: p1.menu,
                            dataName: p1.name,
                            nodeType: p1.nodeType
                        }
                    }
                })
                if($('.fromType').val()=='smCopyRight'&&dataListStatus==null){ //申明版权注释
                    if(!isLogin()){
                        $('.modle-login').show();
                        showLogin();
                        return;
                    };
                    var menu=firstNode.menu.split(',');
                    $('.ul_nav').find('dl').each(function () {
                        $(this).hide();
                        if($.inArray($(this).data('type'), menu)>-1){
                            $(this).show();
                        }
                    });
                    $('.cr_gaTag').show();
                    $('.typeTagLine').addClass('on');
                    if($.inArray("CR_GX", menu)<0){
                        $('.cr_gaTag').hide();
                        $('.typeTagLine').removeClass('on');
                    };
                    $('.now_name').val(firstNode.dataName).attr('num',firstNode.nodeType);
                    $('.module-bql').show();
                    $('#menuuu').hide();
                }
                if($('.fromType').val()=='addCopyRight'&&dataListStatus==null){ //添加版权注释
                    if(data.data.result.paint.length>1){
                        $('.tips-seeven').show();
                        setTimeout(function () {
                            $('.tips-seeven').hide();
                        },10000)
                        dataListStatus=true;
                    }else{
                        $('.tips-five').show();
                        setTimeout(function () {
                            $('.tips-five').hide();
                        },10000)
                        dataListStatus=false;
                    }
                }
                dataList=data.data.result.paint;
                createEchart();
                $('.modle-copyList').find('ul').html('');
                var yz=data.data.result.copyrights.yz;
                var zs=data.data.result.copyrights.zs;
                var zr=data.data.result.copyrights.zr;
                var zy=data.data.result.copyrights.zy;
                if(yz){
                    var s='';
                    yz.forEach(function (p1,p2) {
                        s+='<p><a target="_blank" href="../detail/'+p1.id+'">'+'· '+p1.obllige+'</a></p>'
                    })
                    var t='<li class="clearfix"><div class="float_left"><span class="yz">原著</span>'+
                        '</div><div class="float_left list-item">'+s+'</div></li>';
                    $('.modle-copyList').find('ul').append(t);
                }
                if(zs){
                    var s='';
                    zs.forEach(function (p1,p2) {
                        var t=p1.tag.substr(0,1);
                        if(t=='非'){
                            s+='<p><a target="_blank" href="../detail/'+p1.id+'">'+'· '+p1.obllige+'<span class="icon-f">'+p1.tag.substr(0,1)+'</span></a></p>'
                        }else if(t=='历'){
                            s+='<p><a target="_blank" href="../detail/'+p1.id+'">'+'· '+p1.obllige+'<span class="icon-l">'+p1.tag.substr(0,1)+'</span></a></p>'
                        }else{
                            s+='<p><a target="_blank" href="../detail/'+p1.id+'">'+'· '+p1.obllige+'<span class="icon-d">'+p1.tag.substr(0,1)+'</span></a></p>'
                        }

                    })
                    var t='<li class="clearfix"><div class="float_left"><span class="zs">转授</span>'+
                        '</div><div class="float_left list-item">'+s+'</div></li>';
                    $('.modle-copyList').find('ul').append(t);
                }
                if(zr){
                    var s='';
                    zr.forEach(function (p1,p2) {
                        s+='<p><a target="_blank" href="../detail/'+p1.id+'">'+'· '+p1.obllige+'</a></p>'
                    })
                    var t='<li class="clearfix"><div class="float_left"><span class="zr">转让</span>'+
                        '</div><div class="float_left list-item">'+s+'</div></li>';
                    $('.modle-copyList').find('ul').append(t);
                }
                if(zy){
                    var s='';
                    zy.forEach(function (p1,p2) {
                        s+='<p><a target="_blank" href="../detail/'+p1.id+'">'+'· '+p1.obllige+'</a></p>'
                    })
                    var t='<li class="clearfix"><div class="float_left"><span class="zy">质押</span>'+
                        '</div><div class="float_left list-item">'+s+'</div></li>';

                    $('.modle-copyList').find('ul').append(t);
                }

                $('.modle-copyList').show();
            }else {
                console.log('查询失败')
            }

        }
    })

}
//声明状态下的提示
function smTips() {
    if(dataListStatus){
        $('.modle-tips').hide();
        $('.tips-four').show();
        setTimeout(function () {
            $('.tips-four').hide();
        },10000)
        dataListStatus=true;
    }else{
        $('.modle-tips').hide();
        $('.tips-two').show();
        setTimeout(function () {
            $('.tips-two').hide();
        },10000)
        dataListStatus=true;
    }
}
//创建状态下的提示
function addTips() {
    if(dataListStatus){
        $('.modle-tips').hide();
        $('.tips-ehight').show();
        setTimeout(function () {
            $('.tips-ehight').hide();
        },10000)
        dataListStatus=true;
    }else{
        $('.modle-tips').hide();
        $('.tips-six').show();
        setTimeout(function () {
            $('.tips-six').hide();
        },10000)
        dataListStatus=true;
    }
}
function getNameStr(str) {
    var newStr='',_length=str.length;
    if(_length>20){
        newStr=str.substring(0,20)+"...";
    }else{
        newStr=str;
    }
    return newStr //++++'/n'换行
}
function strLength(str,num) {
    var _length=str.length;
    var newStr='';
    if(num==1){
        return [10*str.length,40]
    }else{
        return [12*str.length+20,40]
    }
};
//创建图
function createEchart() {
    var colors=['#1A8CDC','#67C1FF','#60CFBB','#F27C7C','#F5A623','#6dabd2','#a0a1a2'];
    var myChartDada=[],myChartLink=[],newLine=[];
    dataList.forEach(function (p1, p2, p3) {
        var t={
            name:p1.name,
            itemStyle:{
                normal:{
                    color:colors[p1.nodeColor],
                    shadowColor: 'rgba(0, 0, 0, 0.5)',
                    shadowBlur: 10
                }
            },
            menu:p1.menu,
            dataName:p1.name,
            nodeType:p1.nodeType,
            symbol:p1.nodeType=='WORK'?'roundRect':'rect',
            symbolSize:p1.nodeType=='WORK'?strLength(p1.name,1):strLength(p1.name,2),
        };
        myChartDada.push(t);
        if(p1.line&&p1.line!=null&&p1.parents){
            p1.parents.forEach(function (ele,index) {
                newLine.push({parentNode:ele,node:p1})
            })
        }
    });
    newLine.forEach(function (p1, p2, p3) {
        var l;
        if (p1.parentNode.copyrightType == 'WRW') {
            l = {
                source: p1.node.name,
                target: p1.parentNode.name,
                value: p1.parentNode.tag,
                copyId: p1.parentNode.copyrightId,
                relationId:p1.parentNode.relationId,
                copyrightType:p1.parentNode.copyrightType,
                lineStyle: {
                    normal: {
                        color: colors[p1.parentNode.lineColor],
                        type: p1.parentNode.lineType != true ? 'dashed' : 'solid'
                    }
                }
            };
        }else if(p1.parentNode.copyrightType == 'ORO'){
            l = {
                source: p1.node.name,
                target: p1.parentNode.name,
                value: p1.parentNode.tag,
                relationId:p1.parentNode.relationId,
                copyId: p1.parentNode.copyrightId,
                copyrightType:p1.parentNode.copyrightType,
                lineStyle: {
                    normal: {
                        color: colors[p1.parentNode.lineColor],
                        type: p1.parentNode.lineType != true ? 'dashed' : 'solid'
                    }
                }
            };
        }else{
            l={
                source: p1.parentNode.name,
                target: p1.node.name,
                value: p1.parentNode.tag,
                copyId:p1.parentNode.copyrightId,
                relationId:p1.parentNode.relationId,
                copyrightType:p1.parentNode.copyrightType,
                lineStyle:{
                    normal:{
                        color:colors[p1.parentNode.lineColor],
                        type:p1.parentNode.lineType!=true?'dashed':'solid'
                    }
                }
            };
        }
        myChartLink.push(l)
    });
    var option = {
        animationDurationUpdate: 1500,
        animationEasingUpdate: 'quinticInOut',
        label: {
            normal: {
                show: true,
                textStyle: {
                    fontSize: 12,
                    color:'#fff'
                }
            }
        },
        series: [
            {
                type: 'graph',
                layout: 'force',
                symbolSize: 60,
                focusNodeAdjacency: true,
                roam: true,
                edgeSymbol: ['circle', 'arrow'],
                label: {
                    normal: {
                        show: true,
                        textStyle: {
                            fontSize: 12
                        }
                    }
                },
                force: {
                    repulsion: 3000,
                    edgeLength:100
                },
                //edgeSymbol: ['pin'],
                //edgeSymbolSize: [1, 10],
                edgeLabel: {
                    normal: {
                        show: true,
                        textStyle: {
                            fontSize: 12
                        },
                        formatter: "{c}"
                    }
                },
                data: myChartDada,
                links:myChartLink,
                lineStyle: {
                    normal: {
                        opacity: 0.7,
                        width: 1,
                        curveness: 0.1
                    }
                }
            }
        ]
    };
    myChart.setOption(option);
}
var offset_X,offset_Y;
myChart.on('mousedown', function(params) {
    offset_X=params.event.event.offsetX;
    offset_Y=params.event.event.offsetY;
});
myChart.on('mouseup', function(params) {
    if(offset_X==params.event.event.offsetX&&offset_Y==params.event.event.offsetY){
        if (params.dataType === "node") {
            if(params.data.menu&&params.data.menu.indexOf('TZ')){
                if(!isLogin()){
                    $('.modle-login').show();
                    showLogin();
                    return;
                };
                var menu=params.data.menu.split(',');
                $('.ul_nav').find('dl').each(function () {
                    $(this).hide();
                    if($.inArray($(this).data('type'), menu)>-1){
                        $(this).show();
                    }
                });
                $('.cr_gaTag').show();
                $('.typeTagLine').addClass('on');
                if($.inArray("CR_GX", menu)<0){
                    $('.cr_gaTag').hide();
                    $('.typeTagLine').removeClass('on');
                };
                $('.now_name').val(params.data.dataName).attr('num',params.data.nodeType);
                $('.module-bql').show();
                $('#menuuu').hide();
            }else if(params.data.menu&&params.data.menu.indexOf('TZ')>-1){
                window.open("./"+params.data.menu.substring(3)+"?from="+$('.fromType').val())
            }
        }else if(params.dataType === "edge"){
            if(params.data.copyId){
                window.open("http://www.banquanbaike.com.cn/copyRight/detail/"+params.data.copyId+"?from="+$('.fromType').val())
            };
            if( (params.data.copyrightType=='WRW' || params.data.copyrightType=='WRWA')&& params.data.relationId){
                if(!isLogin()){
                    $('.modle-login').show();
                    showLogin();
                    return;
                };
                $('.update-gxWork').show();
                $('.update-gxWork').find('.tag').val(params.data.value);
                $('.update-gxWork').find('.relationId').val(params.data.relationId);
            }
        }
    }
});

//修改关联作品
$('.update-gx').click(function () {
    if( $('.update-gxWork').find('.tag').val().length>40){
        $hint.open('作品关系不能超过40个字');
        return;
    }
    $.ajax({
        url: '/api/work/update/relation',
        type: 'post',
        data:$('.updateGx-form').serialize(),
        success: function(data){
            if(data.data && data.data.resultCode==200){
                getDatalist();
                $('.update-gxWork').hide();
                $hint.open('修改作品关联关系成功');
            }else{
                $hint.open('操作失败，请刷新重试');
            }
        }
    })
});
//删除关联作品
$('.detail-gx').click(function () {
    $.ajax({
        url: '/api/work/remove/relation',
        type: 'post',
        data:$('.updateGx-form').serialize(),
        success: function(data){
            if(data.data && data.data.resultCode==200){
                getDatalist();
                $('.update-gxWork').hide();
                $hint.open('删除关联作品成功');
            }else{
                $hint.open('操作失败，请刷新重试');
            }
        }
    })
})
//添加关联作品
$('.gx-tag').find('a').click(function () {
    var $this=$(this);
    if($this.hasClass('else-tag')){
        $this.removeClass('on').siblings().removeClass('on');
        $this.find('span').hide();
        $this.find('input').show().focus();
    }else{
        $this.addClass('on').siblings().removeClass('on');
        $('.else-tag').find('span').show();
        $('.else-tag').find('input').hide();
        $('.tagInput').val($this.html())
    }
});

//选择作品关系类型
$('.gxTagType-btn').click(function () {
    $(this).parent().parent().parent().find('.gx-tag').find('a').removeClass('on');
    $(this).parent().parent().parent().find('.gx-tag').find('a').find('span').show().html('其他');
    $(this).parent().parent().parent().find('.gx-tag').find('a').find('input').hide().val('');

    $('.tagInput').val('');
    $('.gxTagType-btn').each(function () {
        $(this).removeClass('on');
        $(this).parent().parent().parent().removeClass('active');
    });
    $(this).addClass('on');
    $(this).parent().parent().parent().addClass('active');
    if($(this).data('type')==2){
        $('.workSeqNo-gx').attr('name','relationSeqNo');
        $('.relationSeqNo').attr('name','workSeqNo')
    }else{
        $('.workSeqNo-gx').attr('name','workSeqNo');
        $('.relationSeqNo').attr('name','relationSeqNo')
    }
});

//其他关系标签
$('.elseTagInput').blur(function () {
    if($(this).val()!=''){
        $(this).prev().show().html($(this).val());
        $(this).hide();
        $(this).parent().addClass('on');
        $('.tagInput').val($(this).val());
    }else{
        $(this).prev().show().html('其他');
        $(this).hide();
        $(this).parent().removeClass('on');
        $('.tagInput').val('');
    }
});
//选择关联作品
function selectWork(e) {
    if($(e).hasClass('on')){
        $(e).removeClass('on');
        $('.relationSeqNo').val('');
    }else{
        $('.gx-table').find('.copyType-btn ').removeClass('on');
        $(e).addClass('on');
        $('.relationSeqNo').val($(e).data('seq'));
        // $(this).parent().find("input[name='isopen']").val($(this).data('true'));
    }
}
//搜索关联作品
$('.search-gx').click(function () {
    if($('#search-input').val()==''){
        return;
    }
    searchWorkAjax(1);
});
//搜索关联作品AJAX封装
function searchWorkAjax(curr) {
    $.ajax({
        url: '/api/work/relations',
        type: 'get',
        data:{currentPage:curr,keyword:$('#search-input').val()},
        success: function(data){
            var s='';
            console.log(data.data.result.workList.length);
            if(data.data.result.workList.length<1){
                $('.no-works').show();
                return;
            };
            $('.no-works').hide();
            data.data.result.workList.forEach(function (t) {
                s+=' <li class="clearfix">' +
                    '<div class="float_left">' +
                    '<div class="select-btn">' +
                    '<a class="copyType-btn" data-seq="'+t.seqNo+'" onclick="selectWork(this)"><i></i></a>' +
                    '</div>' +
                    '</div>' +
                    '<div class="clearfix">' +
                    '<div class="work-name float_left"><a target="_blank" href="../../item/'+t.seqNo+'">'+t.name+'</a></div>' +
                    '<div class="work-tag float_left">';
                t.tags.forEach(function (t2,index) {
                    if(index>1){
                        return;
                    }
                    if(index==0){
                        s+='<a class="on">'+t2+'</a>'
                    }else{
                        s+='<a>'+t2+'</a>'
                    }
                })
                s+='</div><div class="search-workTitle float_left">'+t.workTitle+'</div></div></li>';
            })
            $('.gx-table').html(s);
            createPage(data.data.result.totalPage,data.data.result.currentPage)
        }
    })
}
//关联作品列表分页
function createPage(totalPage,curPage) {
    $('#layerPage').show();
    laypage({
        cont: $('#layerPage'), //容器。值支持id名、原生dom对象，jquery对象。【如该容器为】：<div id="page1"></div>
        pages:totalPage, //通过后台拿到的总页数
        curr: curPage, //当前页
        jump: function(obj, first){ //触发分页后的回调
            if(!first){ //一定要加此判断，否则初始时会无限刷新
                searchWorkAjax(obj.curr);
            }
        }
    });
}
$('#search-input').keypress(function(event){
    if(event.keyCode == 13&&$('#search-input').val()!=''){ //绑定回车
        $(".search-gx").click();
    }
});

//重置关联作品from
function resetGxFrom() {
    $('.gx-form').find('.gx-table').html('');
    $('.gx-form').find('#layerPage').hide();
    $('.gx-form').find('.tagInput').val('');
    $('.gx-form').find('.relationSeqNo').val('');
    $('.gxTagType-btn').each(function () {
        $(this).removeClass('on');
        $(this).parent().parent().parent().removeClass('active');
    })
}


$('.getCopy-btn').click(function () {
    console.log(isNull($('.getCopy-text').val()));
    if(isNull($('.getCopy-text').val())){
        $hint.open("请填写版权使用需求");
        return;
    }
    $.ajax({
        url: '/app/contact/copyright ',
        type: 'POST',
        data:$('.getCopyRight-form').serialize(),
        success: function(data){
            if(data.data.resultCode==200){
                $hint.open(data.data.resultMsg);
                $('.module-getCopyRight').hide();
            }else{
                $hint.open(data.data.resultMsg);
            }
        }
    })
})

function isNull( str ){
    if ( str == "" ) return true;
    var regu = "^[ ]+$";
    var re = new RegExp(regu);
    return re.test(str);
}

//创建原著
$('.create-btn').click(function (){
    if($(this).data('type')==0){
        if($('.tagInput').val()==''){
            $hint.open('请选择作品关系');
            return;
        }
        if($('.tagInput').val().length>40){
            $hint.open('作品关系不能超过40个字');
            return;
        }
        if($('.relationSeqNo').val()==''){
            $hint.open('请选择一个关联作品');
            return;
        }
        $.ajax({
            url: '/api/work/create/relationWork',
            type: 'POST',
            data:$('.gx-form').serialize(),
            success: function(data){
                if(data.data.resultCode==200){
                    $hint.open('添加关联作品成功');
                    getDatalist();
                    $('.module-bql').hide();
                    $('.module-body').find('dl').removeClass('on');
                    $('.module_content').hide();
                    //清空上次操作关联作品form数据
                    $('.else-tag').find('span').show().html('其他');
                    $('.else-tag').find('input').hide();
                    $('.gx-tag').find('a').removeClass('on');
                    $('.tagInput').val('');
                    $('.gx-table').html('');
                    $('.relationSeqNo').val('');
                    createPage(0,0);
                    if($('.fromType').val()=='smCopyRight'){
                        smTips()
                    };
                    if($('.fromType').val()=='addCopyRight'){
                        addTips()
                    }
                }else{
                    $hint.open(data.data.resultMsg);
                }
            }
        })
    }
    if($(this).data('type')==1){
        if( $('.yz-form').find("input[name='obllige']").val()!=''){
            $.ajax({
                url: '/api/copyright/addOriginal ',
                type: 'POST',
                data:$('.yz-form').serialize(),
                success: function(data){
                    if(data.data.resultCode==200){
                        getDatalist();
                        $('.module-bql').hide();
                        $('.module-body').find('dl').removeClass('on');
                        $('.module_content').hide();
                        if($('.fromType').val()=='smCopyRight'){
                            smTips()
                        };
                        if($('.fromType').val()=='addCopyRight'){
                            addTips()
                        }
                    }else{
                        $hint.open(data.data.resultMsg);
                    }
                }
            })
        }else{
            $('.yz-form').find("input[name='obllige']").parent().parent().parent().next().show();
        }
    }else if($(this).data('type')==2){

        if( $('.zs-form').find("input[name='tag']").val()==''){
            $('.zs-form').find("input[name='tag']").next().show();
            return;
        }
        if( $('.zs-form').find("input[name='grant']").val()==''){
            $('.zs-form').find("input[name='grant']").parent().parent().parent().next().show();
            return;
        }
        if($('.zs-form').find("input[name='obllige']").val()==''){
            $('.zs-form').find("input[name='obllige']").parent().parent().parent().next().show();
            return;
        }
        $.ajax({
            url: '/api/copyright/addAuthorization',
            type: 'POST',
            data:$('.zs-form').serialize(),
            success: function(data){
                if(data.data.resultCode==200){
                    getDatalist();
                    $('.module-bql').hide();
                    $('.module-body').find('dl').removeClass('on');
                    $('.module_content').hide();
                    if($('.fromType').val()=='smCopyRight'){
                        smTips()
                    };
                    if($('.fromType').val()=='addCopyRight'){
                        addTips()
                    }
                }else{
                    $hint.open(data.data.resultMsg);
                }
            }
        })
    }else if($(this).data('type')==3){

        if( $('.zr-form').find("input[name='tag']").val()==''){
            $('.zr-form').find("input[name='tag']").next().show();
            return;
        }
        if( $('.zr-form').find("input[name='grant']").val()==''){
            $('.zr-form').find("input[name='grant']").parent().parent().parent().next().show();
            return;
        }
        if($('.zr-form').find("input[name='obllige']").val()==''){
            $('.zr-form').find("input[name='obllige']").parent().parent().parent().next().show();
            return;
        }
        $.ajax({
            url: '/api/copyright/addAttorn',
            type: 'POST',
            data:$('.zr-form').serialize(),
            success: function(data){
                if(data.data.resultCode==200){
                    getDatalist();
                    $('.module-bql').hide();
                    $('.module-body').find('dl').removeClass('on');
                    $('.module_content').hide();
                    if($('.fromType').val()=='smCopyRight'){
                        smTips()
                    };
                    if($('.fromType').val()=='addCopyRight'){
                        addTips()
                    }
                }else{
                    $hint.open(data.data.resultMsg);
                }
            }
        })
    }else if($(this).data('type')==4){

        if( $('.zy-form').find("input[name='grant']").val()==''){
            $('.zy-form').find("input[name='grant']").parent().parent().parent().next().show();
            return;
        }
        if($('.zy-form').find("input[name='obllige']").val()==''){
            $('.zy-form').find("input[name='obllige']").parent().parent().parent().next().show();
            return;
        }

        $.ajax({
            url: '/api/copyright/addPledge',
            type: 'POST',
            data:$('.zy-form').serialize(),
            success: function(data){
                if(data.data.resultCode==200){
                    getDatalist();
                    $('.module-bql').hide();
                    $('.module-body').find('dl').removeClass('on');
                    $('.module_content').hide();
                    if($('.fromType').val()=='smCopyRight'){
                        smTips()
                    };
                    if($('.fromType').val()=='addCopyRight'){
                        addTips()
                    }
                }else{
                    $hint.open(data.data.resultMsg);
                }
            }
        })
    }
});