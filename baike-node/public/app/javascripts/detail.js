var mySwiper = new Swiper('#detailNav', {
    freeMode: true,
    freeModeMomentumRatio: 0.5,
    slidesPerView: 'auto',
});

var option3 = {
    tooltip : {
        trigger: 'axis',
        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
    },
    color:['#F37C7C','#687FFF','#5AB5F4','#60CFBB','#F6A623','#DF2D79','#5CA7BA'],
    legend: {
        bottom: 0,
        data: []
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '10%',
        height:'87%',
        containLabel: true
    },
    xAxis:  {
        type: 'value',
        axisLabel:{
            color:'#666666',
            fontSize:16
        },
    },
    yAxis: {
        type: 'category',
        data: [],
        axisTick:{
            show:false
        },
        axisLabel:{
            color:'#666666',
            fontSize:16
        },
    },
    series: []
};
var pdType=0,playChart,clickType;
var workSeqNo=$('#workItemID').val();//作品ID
var start = {
    elem: '#start1',
    format: 'YYYY-MM-DD',
    max: laydate.now(-7), //最大日期
    start: laydate.now(-7),  //开始日期
    istoday: false,
    fixed: true,
    choose: function(datas){
        playChart.showLoading();
        var date2 = new Date(datas);
        date2.setDate(new Date(datas).getDate()+7);
        var times = date2.getFullYear()+"-"+(date2.getMonth()+1)+"-"+date2.getDate();
        $('#endTime').html(times);
        appDetail.AJAX('/api/work/newwork/play?workSeqNo='+workSeqNo+'&startTime='+datas+'&endTime='+times,function (data) {
            if(data.data.resultCode==200) {
                var s = '', historyList = data.data.result.platform;
                if($('.workDetailType').val()=='小说' || $('.workDetailType').val()=='漫画'){
                    for (var i = 0; i < historyList.length; i++) {
                        var scores=historyList[i].scores;
                        if(historyList[i].scores==''){
                            scores='—';
                        }
                        s += '<tr><td>' + historyList[i].platform + '</td>' +
                            '<td>' + historyList[i].totalPlay + '</td>' +
                            '<td>' + historyList[i].playProportion + '</td>' +
                            '<td>' + scores + '</td></tr>';
                    }
                    $('.play-table').html('<thead><tr><td>阅读平台</td><td>阅读总数(万)</td><td>阅读占比</td></tr></thead><tbody>' +s+'</tbody>');
                }else{
                    for (var i = 0; i < historyList.length; i++) {
                        s += '<tr><td>' + historyList[i].platform + '</td>' +
                            '<td>' + historyList[i].totalPlay + '</td>' +
                            '<td>' + historyList[i].playProportion + '</td></tr>';
                    }
                    $('.play-table').html('<thead><tr><td>播放平台</td><td>播放总数(万)</td><td>播放占比</td></tr></thead><tbody>' +s+'</tbody>');
                }

                playChart.hideLoading();
                if (data.data.result.play.length < 1) {
                    return;
                }
                var categories = [];
                var dataList = [], legendData = [], maxNum = 0;
                data.data.result.play.forEach(function (x, index) {
                    var num = [];
                    legendData.push(x.name);
                    x.measures.forEach(function (u, index1) {
                        if (index == 0) {
                            categories.push(u.date);
                        }
                        num.push((u.total/10000).toFixed(2));
                        maxNum += parseInt(u.total);
                    });
                    var s = {
                        name: x.name,
                        type: 'bar',
                        stack: '总量',
                        itemStyle: {},
                        data: num
                    };
                    dataList.push(s);
                });
                $('.playChartTitle').html('七日' + appDetail.measureTitle(data.data.result.type) + ':' + appDetail.unitConversion(maxNum));
                playChart.setOption({
                    legend: {
                        data: legendData
                    },
                    yAxis: {
                        data: categories
                    },
                    series: dataList
                });
            }else{

            }
        })
    }
};


$('.search_btn').click(function (){
    if($("input[name='keyword']").val()!=''){
        $('.search-form').submit();
    }
});
if(document.getElementById('start1')){
    laydate(start);
}

$('.swiper-slide').click(function () {
    if( $(this).hasClass('active')){
        return;
    }
    $("#detailNav  .active").removeClass('active');
    $(this).addClass('active');
    clickType=$(this).data('type');
    //判断切换到相应的tab时是否需要发送AJAX，0--需要发，1---不需要发
    if(clickType=='work_info'){
        appDetail.showWrap();
    }
    if(clickType=='cinema'){
        appDetail.showCinema();
    }
    if(clickType=='playWrap'){
        appDetail.showPlay();
    }
    if(clickType=='movieEvaluating'){
        appDetail.movieEvaluating();
    }
    if(clickType=='tvEvaluating'){
        appDetail.tvEvaluating();
    }
    if(clickType=='platformRanking'){
        appDetail.platformRanking();
    }
    if(clickType=='webApp' ){
        appDetail.webApp();
    }
    if(clickType=='platfromList'){
        appDetail.platfromList();
    }
    if(clickType=='sentiment' && $("input[name='sentiment']").val()==0){
        appDetail.sentiment();
    }
    if(clickType=='bql') {
        $('#copyRight').css({
            'width':$(window).width()+'px',
            'height':($(window).height()-153)+'px'
        });
        var myChart = echarts.init(document.getElementById('copyRight'));
        appDetail.copyRightAjax(myChart)

    }
})


var appDetail={
    tishiText:function(){
        //----------------是否关注该作品
        return '数据监听服务目前处于锁定状态，需要您前往电脑端版权百科网站关注该作品解锁该服务。'
    },

    //-----电影类--------院线票房AJAX
    showCinema:function (ele) {
        var _this=this;
        if($("input[name="+clickType+"]").val()!=0){
            _this.showWrap();
            return;
        }
        $('.loading_div').show()
        console.log($(".chartWidth").width())
        $("#cinema-chart").css( 'width', '690px');
        var cinemaChart = echarts.init(document.getElementById('cinema-chart'));
        cinemaChart.showLoading();

        this.AJAX('/api/work/cinema/box?workSeqNo='+workSeqNo,function (data) {
            if(data.data.resultCode==200) {
                if(data.data.result.boxTotal){
                    _this.haveContent();
                    $("input[name='cinema']").val('1'); //下次切换不用再发送AJAX
                    $('.boxTotal').html(data.data.result.boxTotal==""?"—":data.data.result.boxTotal);
                    $('.boxRanking').html(data.data.result.boxRanking==""?"—":data.data.result.boxRanking);
                    $('.audience').html(data.data.result.audience==""?"—":data.data.result.audience);
                    var dataX=[],dataY=[],brokenList=data.data.result.broken,historyList=data.data.result.history;
                    var s='';
                    for(var i=0;i<brokenList.length;i++){
                        dataX.push(_this.getDate(brokenList[i].date,2));
                        dataY.push((brokenList[i].oneDayBox/10000).toFixed(2));
                    };
                    for(var i=0;i<historyList.length;i++){
                        s+='<tr>' +
                            '<td>'+historyList[i].releaseDay+'</td>' +
                            '<td>'+historyList[i].oneDayBox+'</td>' +
                            '<td>'+historyList[i].boxProportion+'</td>' +
                            '</tr>';
                    }
                    $('.cinema-table').find('tbody').html(s);
                    var option = {
                        tooltip : {
                            trigger: 'axis'
                        },
                        gird:{
                          left:'3'
                        },
                        xAxis: [{
                            type: 'category',
                            boundaryGap: false,
                            axisTick:{
                                show:false,
                                interval:0
                            },
                            axisLabel:{
                                color:'#666666',
                                fontSize:16
                            },
                            data:dataX
                        }],
                        yAxis: [{
                            type: 'value',
                            axisTick:{
                                show:false
                            },
                            axisLabel:{
                                color:'#666666',
                                formatter: '{value}',
                                fontSize:16
                            },
                        }],
                        series: [{
                            name: '单日票房',
                            type: 'line',
                            itemStyle: {
                                normal: {
                                    areaStyle: {
                                        type: 'default'
                                    },
                                    color:'rgba(255,183,65,1)'
                                }
                            },
                            data:dataY
                        }]
                    }
                    cinemaChart.hideLoading();
                    cinemaChart.setOption(option);

                }else{
                    _this.noContent('该电影目前尚未上映，未产生院线票房监听数据')
                }
            }else{
                _this.noContent("网络错误，未产生院线票房监听数据。请稍后再试")
            }
        },function () {
            _this.noContent("该作品院线票房"+_this.tishiText(),'sz')
        },true)
    },

    //-------------网络播放AJAX
    showPlay:function (ele) {
        var _this=this;
        if($("input[name="+clickType+"]").val()!=0){
            _this.showWrap();
            return;
        }
        $('.loading_div').show()
        $("#play-chart").css( 'width', '690px');
        playChart = echarts.init(document.getElementById('play-chart'));
        playChart.setOption(option3);
        playChart.showLoading();

        var  nowTime= new Date();
        nowTime.setDate(new Date().getDate()-7);
        var startTime = nowTime.getFullYear()+"-"+(nowTime.getMonth()+1)+"-"+nowTime.getDate();
        var endTime=new Date().getFullYear()+"-"+(new Date().getMonth()+1)+"-"+new Date().getDate();
        this.AJAX('/api/work/newwork/play?workSeqNo='+workSeqNo+'&startTime='+startTime+'&endTime='+endTime,function (data) {

            if(data.data.resultCode==200) {
                if(data.data.result.platform.length>0){
                    _this.haveContent();
                    $("input[name='playWrap']").val('1');
                    $('.totalPlay').html(data.data.result.totalPlay);
                    $('.yesterdayPlay').html(data.data.result.yesterdayPlay);
                    var s = '', historyList = data.data.result.platform;
                    if($('.workDetailType').val()=='小说' || $('.workDetailType').val()=='漫画'){
                        $('.playAddress ').html(data.data.result.people);
                        for (var i = 0; i < historyList.length; i++) {
                            var scores=historyList[i].scores;
                            if(historyList[i].scores==''){
                                scores='—';
                            }
                            s += '<tr><td>' + historyList[i].platform + '</td>' +
                                '<td>' + historyList[i].totalPlay + '</td>' +
                                '<td>' + historyList[i].playProportion + '</td>' +
                                '<td>' + scores + '</td></tr>';
                        }
                        $('.play-table').html('<thead><tr><td>阅读平台</td><td>阅读总数(万)</td><td>阅读占比</td><td>评测分数</td></tr></thead><tbody>' +s+'</tbody>');
                    }else{
                        $('.playAddress').html(data.data.result.monitorSet);
                        for (var i = 0; i < historyList.length; i++) {
                            s += '<tr><td>' + historyList[i].platform + '</td>' +
                                '<td>' + historyList[i].totalPlay + '</td>' +
                                '<td>' + historyList[i].playProportion + '</td></tr>';
                        }
                        $('.play-table').html('<thead><tr><td>播放平台</td><td>播放总数(万)</td><td>播放占比</td></tr></thead><tbody>' +s+'</tbody>');
                    }

                    playChart.hideLoading();
                    if (data.data.result.play.length < 1) {
                        return;
                    }
                    var categories = [];
                    var dataList = [], legendData = [], maxNum = 0;
                    data.data.result.play.forEach(function (x, index) {
                        var num = [];
                        legendData.push(x.name);
                        x.measures.forEach(function (u, index1) {
                            if (index == 0) {
                                categories.push(u.date);
                            }
                            num.push(u.total>10000?(u.total/10000).toFixed(2):u.total);
                            maxNum += parseInt(u.total);
                        });
                        var s = {
                            name: x.name,
                            type: 'bar',
                            stack: '总量',
                            itemStyle: {},
                            data: num
                        };
                        dataList.push(s);
                    });
                    $('.playChartTitle').html('七日' + _this.measureTitle(data.data.result.type) + ':' + _this.unitConversion(maxNum));
                    playChart.setOption({
                        legend: {
                            data: legendData
                        },
                        yAxis: {
                            data: categories
                        },
                        series: dataList
                    });
                }else{
                    _this.noContent('该作品目前网络播放未开始，未产生网络播放监听数据')
                }
            }else{
                _this.noContent("网络错误，未产生网络播放监听数据。请稍后再试");
            }
        },function () {
            _this.noContent("该作品"+$('.swiper-slide.active').find('a').html()+_this.tishiText(),'sz')
        },true)
    },

    //-----电影类--------专业测评AJAX
    movieEvaluating:function(ele){
        var _this=this;
        if($("input[name="+clickType+"]").val()!=0){
            _this.showWrap();
            return;
        }
        $('.loading_div').show()
        var movieVue=new Vue({
            el:'#movieEvaluating',
            data:{
                douban:{},
                doubanStsart:{},
                doubanStart1:[],
                doubanStart2:[],
                doubanStart3:[],
                maoyan:{},
                maoyanStart1:[],
                maoyanStart2:[],
                maoyanStart3:[],
                shiguang:{},
                shiguangStart1:[],
                shiguangStart2:[],
                shiguangStart3:[],
                lfq:{},
                lfqStart1:[],
                lfqStart2:[],
                lfqStart3:[],
                imdb:{},
                imdbStart1:[],
                imdbStart2:[],
                imdbStart3:[]
            },
            methods:{
                creatList:function (data) {
                    var that=this;
                    that.douban=data.data.result.douBan;
                    that.doubanStsart={
                        one:that.douban.oneScale?that.douban.oneScale.replace('%','')*180/100 + 'px':0,
                        two:that.douban.twoScale?that.douban.twoScale.replace('%','')*180/100 + 'px':0,
                        three:that.douban.threeScale?that.douban.threeScale.replace('%','')*180/100 + 'px':0,
                        four:that.douban.fourScale?that.douban.fourScale.replace('%','')*180/100 + 'px':0,
                        five:that.douban.fiveScale?that.douban.fiveScale.replace('%','')*180/100 + 'px':0
                    }
                    that.doubanStart1=that.creatStart1(data.data.result.douBan.score);
                    that.doubanStart2=that.creatStart2(data.data.result.douBan.score);
                    that.doubanStart3=that.creatStart3(data.data.result.douBan.score);
                    that.maoyan=data.data.result.maoYan;
                    that.maoyanStart1=that.creatStart1(data.data.result.maoYan.score);
                    that.maoyanStart2=that.creatStart2(data.data.result.maoYan.score);
                    that.maoyanStart3=that.creatStart3(data.data.result.maoYan.score);
                    that.shiguang=data.data.result.shiGuang;
                    that.shiguangStart1=that.creatStart1(data.data.result.shiGuang.score);
                    that.shiguangStart2=that.creatStart2(data.data.result.shiGuang.score);
                    that.shiguangStart3=that.creatStart3(data.data.result.shiGuang.score);
                    that.lfq=data.data.result.lanFanQie;
                    that.lfqStart1=that.creatStart1(data.data.result.lanFanQie.score);
                    that.lfqStart2=that.creatStart2(data.data.result.lanFanQie.score);
                    that.lfqStart3=that.creatStart3(data.data.result.lanFanQie.score);
                    that.imdb=data.data.result.imdb;
                    that.imdbStart1=that.creatStart1(data.data.result.imdb.score);
                    that.imdbStart2=that.creatStart2(data.data.result.imdb.score);
                    that.imdbStart3=that.creatStart3(data.data.result.imdb.score);
                    console.log(that.douban)
                },
                creatStart1:function (score) { //评分星2分为一星
                    var star=[];
                    for(var i=0;i< Math.floor(score/2);i++){
                        star.push(i)
                    }
                    return star;
                },
                creatStart2:function (score) {//评分星2分内为半星
                    var star=[];
                    if(score%2!=0){
                        star.push(1)
                    }
                    return star;
                },
                creatStart3:function (score) {
                    var star=[],banXing=0;
                    if(score%2!=0){
                        banXing=1;
                    }
                    for(var i=0;i<5-Math.floor(score/2)-banXing;i++){
                        star.push(i)
                    }
                    return star;
                }
            }
        });
        this.AJAX('/api/work/assessment?workSeqNo='+workSeqNo,function (data) {
            if(data.data.resultCode==200){
                $("input[name='movieEvaluating']").val('1');
                _this.haveContent();
                movieVue.creatList(data);
            }else{
                _this.noContent("网络错误，未产生专业测评监听数据。请稍后再试")
            }
        },function () {
            _this.noContent("该作品专业测评"+_this.tishiText(),'sz')
        },true)
    },

    //---电视类--------市场评测
    tvEvaluating:function (ele) {
        var _this=this;
        if($("input[name="+clickType+"]").val()!=0){
            _this.showWrap();
            return;
        }
        $('.loading_div').show()
        var EditorVue=new Vue({
            el:'#monitor-wrap',
            data:{
                totalComment:'—',
                totalFabulous:'—',
                totalTread:'—',
                youku:undefined,
                aqy:undefined,
                tx:undefined,
                ls:undefined,
                sh:undefined,
                jl:undefined,
                xl:undefined,
                mgtv:undefined,
            },
            methods:{
                creatList:function (data) {
                    var _this=this;
                    var tv_list=data.data.result.tvEvaluation.detailVos;
                    for(var i=0;i<tv_list.length;i++){
                        if(tv_list[i].platformCode=='youku'){
                            _this.youku=tv_list[i];
                        }else if(tv_list[i].platformCode=='letv'){
                            _this.ls=tv_list[i];
                        }else if(tv_list[i].platformCode=='tencent_video'){
                            _this.tx=tv_list[i];
                        }else if(tv_list[i].platformCode=='iqiyi'){
                            _this.aqy=tv_list[i];
                        }else if(tv_list[i].platformCode=='sohu'){
                            _this.sh=tv_list[i];
                        }else if(tv_list[i].platformCode=='pptv'){
                            _this.jl=tv_list[i];
                        }else if(tv_list[i].platformCode=='mgtv'){
                            _this.mgtv=tv_list[i];
                        }
                    }
                    _this.totalComment=data.data.result.tvEvaluation.totalComment;
                    _this.totalFabulous=data.data.result.tvEvaluation.totalFabulous;
                    _this.totalTread=data.data.result.tvEvaluation.totalTread;

                }
            }
        });
        this.AJAX('/api/work/TV/evaluation?workSeqNo='+workSeqNo,function (data) {
            if(data.data.resultCode==200){
                $("input[name='tvEvaluating']").val('1');
                _this.haveContent();
                EditorVue.creatList(data);
            }else{
                _this.noContent("网络错误，未产生市场评测监听数据。请稍后再试")
            }

        },function () {
            _this.noContent("该作品市场评测"+_this.tishiText(),'sz')
        },true)
    },

    //------------音乐类--------平台排行榜AJAX
    platformRanking:function (ele) {
        var _this=this;
        if($("input[name="+clickType+"]").val()!=0){
            _this.showWrap();
            return;
        }
        $('.loading_div').show()
        var MusicVue=new Vue({
            el:'#music-platform',
            data:{
                internetCount:0,
                operatorCount:0,
                rankCount:0,
                totalTread:0,
                platform:{},
                tableList:[],
            },
            methods:{
                creatList:function (data) {
                    var _this=this;
                    _this.platform=data.data.result.rankPlatForms;
                    _this.internetCount=data.data.result.internetCount;
                    _this.operatorCount=data.data.result.operatorCount;
                    _this.rankCount=data.data.result.rankCount;
                    var rankInfo=data.data.result.rankInfo;
                    if(rankInfo.length>0){
                        _this.tableList=rankInfo;
                    }else{
                        _this.tableList=[{platformName:'—',rankDate:'—',topRankName:'—',topRankDays:'—'}]
                    }
                }
            }
        });
        this.AJAX('/api/work/music/platform/ranking?workSeqNo='+workSeqNo,function (data) {
            if(data.data.resultCode==200){
                $("input[name='platformRanking']").val('1');
                _this.haveContent();
                MusicVue.creatList(data);
            }else{
                _this.noContent("网络错误，未产生平台排行榜监听数据。请稍后再试")
            }

        },function () {
            _this.noContent("该作品平台排行榜"+_this.tishiText(),'sz')
        },true)
    },

    //-----小说动漫--------相关APP AJAX
    webApp:function (ele) {
        var _this=this;
        if($("input[name="+clickType+"]").val()!=0){
            _this.showWrap();
            return;
        }
        $('.loading_div').show()
        var appVue=new Vue({
            el:'#app-wrap',
            data:{
                appList:[],
            },
            methods:{
                creatList:function (data) {
                    var _this=this;
                    _this.appList=data.data.result;
                }
            }
        });
        this.AJAX('/api/work/relevant/app?workSeqNo='+workSeqNo,function (data) {
            if(data.data.resultCode==200){
                if(data.data.result!=null && data.data.result.length>0){
                    $("input[name='webApp']").val('1');
                    _this.haveContent();
                    appVue.creatList(data);
                    var appSwiper = new Swiper('#appSwiper', {
                        freeMode: true,
                        freeModeMomentumRatio: 0.5,
                        slidesPerView: 'auto',
                        spaceBetween : 30
                    });
                }else{
                    console.log('222222222222')
                    _this.noContent("版权百科正在尽快整理该作品相关APP监听数据。")
                }

            }else{
                _this.noContent("网络错误，未产生相关APP监听数据。请稍后再试")
            }
        },function () {
            _this.noContent("该作品相关APP"+_this.tishiText(),'sz')
        },true)
    },

    //-----小说动漫--------平台榜单 AJAX
    platfromList:function (ele) {
        var _this=this;
        if($("input[name="+clickType+"]").val()!=0){
            _this.showWrap();
            return;
        }
        $('.loading_div').show()
        $("#platformChart").css( 'width', '690px');
        var platfromChart = echarts.init(document.getElementById('platformChart'));
        platfromChart.showLoading();
        this.AJAX('/api/work/platfrom/list?workSeqNo='+workSeqNo,function (data) {
            platfromChart.hideLoading();
            if(data.data.resultCode==200){
                if(data.data.result.total>0){
                    $("input[name='platfromList']").val('1');
                    $('.totalDate').html(data.data.result.total==""?"—":data.data.result.total)
                    var s='',platfromList=data.data.result.platfrom,dataX=[],dataY=[];
                    $('.totalPt').html(platfromList.length)
                    for(var i=0;i<platfromList.length;i++){
                        s+='<tr><td>'+platfromList[i].platfrom+'</td>' +
                            '<td><a>'+platfromList[i].listName+'</a></td>' +
                            '<td>'+platfromList[i].listNumber+'</td></tr>';
                        dataX.push(platfromList[i].platfrom);
                        dataY.push(platfromList[i].listNumber);
                    };
                    $('.cartoonTable').find('tbody').html(s);
                    var option = {
                        title: {
                            text: '上榜天数',
                            left: 'center',
                            textStyle: {
                                color: '#666666',
                                fontSize:24
                            }
                        },
                        color: ['#3398DB'],
                        tooltip : {
                            trigger: 'axis',
                            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                                type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                            }
                        },
                        grid: {
                            left: '3%',
                            right: '4%',
                            top:'13%',
                            height:'80%',
                            bottom: '3%',
                            containLabel: true
                        },
                        xAxis : [
                            {
                                type : 'category',
                                data: dataX,
                                axisTick: {
                                    show:false,
                                    alignWithLabel: true
                                },
                                axisLabel:{
                                    color:'#666666',
                                    fontSize:16
                                }
                            }
                        ],
                        yAxis : [
                            {
                                type : 'value',
                                name: '（日）',
                                axisLabel:{
                                    color:'#666666',
                                    fontSize:16,
                                    fontWeight:200
                                }
                            }
                        ],
                        series : [
                            {
                                name:'上榜次数',
                                type:'bar',
                                barWidth: '40%',
                                data:dataY
                            }
                        ]
                    };
                    platfromChart.hideLoading();
                    platfromChart.setOption(option);
                }else{
                    _this.noContent("版权百科正在尽快整理该作品平台榜单监听数据。")
                }
            }else{
                _this.noContent("网络错误，未产生平台榜单监听数据。请稍后再试")
            }
        },function () {
            _this.noContent("该作品平台榜单"+_this.tishiText(),'sz')
        },true)
    },

    //-------------舆情洞察AJAX
    sentiment: function (ele) {
        var _this=this;
        if($("input[name="+clickType+"]").val()!=0){
            _this.showWrap();
            return;
        }
        $('.loading_div').show()
        $("#gaugeChart").css( 'width', '690px');
        var gaugeChart = echarts.init(document.getElementById('gaugeChart'));
        var newsChart = echarts.init(document.getElementById('news-chart'));
        var Kchart = echarts.init(document.getElementById('k-chart'));
        var sentimentVue=new Vue({
            el:'#sentimentVue',
            data:{
                newsList:[],
                emotionValue:'—',
                effectCount:'—',
                totalInfoCount:'—',
                totalPage:1,
                curPage:1
            },
            mounted: function(){

            },
            methods:{
                creatList:function (data,ele) {
                    this.newsList=data.data.result.news!=null?data.data.result.news:[];
                    this.totalPage=data.data.result.totalPage;
                    if(data.data.result.publicOpinionSummary.emotionValue!=null&&data.data.result.publicOpinionSummary.emotionValue<0){
                        this.emotionValue='负面';
                    }else if(data.data.result.publicOpinionSummary.emotionValue!=null&&data.data.result.publicOpinionSummary.emotionValue>0){
                        this.emotionValue='正面';
                    }
                    this.effectCount=data.data.result.publicOpinionSummary.effectCount!=null?data.data.result.publicOpinionSummary.effectCount:'—';
                    this.totalInfoCount=data.data.result.publicOpinionSummary.totalInfoCount!=null?data.data.result.publicOpinionSummary.totalInfoCount:"—";
                },
                changeNews:function () {
                    var that=this;
                    var newPage=this.curPage<this.totalPage?this.curPage+1:1;
                    _this.AJAX('/api/public/sentiment/related/news?workSeqNo='+workSeqNo+'&currentPage='+newPage,function (data) {
                        if(data.data.resultCode==200){
                            that.curPage=newPage;
                            that.newsList=data.data.result.news;
                        }else{
                            $hint.open('网络错误，请稍后再试')
                        }
                    })
                },
                unitConversion:function(num) {
                    if(num>100000000){
                        return  (num/100000000).toFixed(2)+'亿';
                    }else if(num>10000000){
                        return  (num/10000000).toFixed(2)+'千万';
                    }else if(num>1000000){
                        return  (num/1000000).toFixed(2)+'百万';
                    }else if(num>10000){
                        return  (num/10000).toFixed(2)+'万';
                    }else{
                        return  num;
                    }
                }
            }
        }); //舆情洞察VUe
        gaugeChart.showLoading();
        newsChart.showLoading();
        this.AJAX('/api/public/sentiment/info?workSeqNo='+workSeqNo,function (data) {
            if(data.data.resultCode==200 && data.data.result.publicOpinionSummary!=null){
                $("input[name='sentiment']").val('1');
                sentimentVue.creatList(data);
                _this.createGaugeChart(data,gaugeChart);
                _this.createNewsChart(data,newsChart);
                _this.createKChart(data,Kchart);
            }else{
                _this.noContent("版权百科正在尽快整理该作品舆情洞察监听数据。")
            }
        },function () {
            _this.noContent("该作品舆情洞察"+_this.tishiText(),'sz')
        },true)
    },

    //-----------------舆情洞察情感偏向
    createGaugeChart:function (data,gaugeChart) {
        $('.negativeEmotion').html(data.data.result.publicOpinionSummary.negativeEmotion);
        $('.positiveEmotion').html(data.data.result.publicOpinionSummary.positiveEmotion);
        gaugeChart.hideLoading();
        var option={
            tooltip : {
                formatter: "{b} : {c}%"
            },
            grid:{
                left:"0",
                right:"0",
            },
            series: [
                {
                    name: '',
                    type: 'gauge',
                    radius:"100%",
                    axisLine:{
                        lineStyle:{
                            width:20
                        }
                    },
                    min:-5,
                    max:5,
                    splitLine:{
                        length:20
                    },
                    title:{
                        fontSize:"12px",
                        color:"#333"
                    },
                    detail: {formatter:'{value}'},
                    data: [{value: data.data.result.publicOpinionSummary.emotionValue, name: '目前情感值'}]
                }
            ]
        };
        gaugeChart.setOption(option);
    },

    //-----------------舆情洞察影响力分布
    createNewsChart:function (data,newsChart) {
        newsChart.hideLoading();
        var newData=[];
        data.data.result.publicOpinionSummary.mediaList.forEach(function (t) {
            newData.push({value:t.peopleCount,name:t.mediaName})
        });
        var newsOption={
            tooltip: {
                trigger: 'item',
                formatter: "{b}: {d}%"
            },
            series: [
                {
                    type:'pie',
                    selectedMode: 'single',
                    radius: [0, '50%'],

                    label: {
                        normal: {
                            position: 'inner'
                        }
                    },
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data:[
                        {value:data.data.result.publicOpinionSummary.pcCount, name:'pc端', selected:true},
                        {value:data.data.result.publicOpinionSummary.mobileCount, name:'移动端'}
                    ]
                },
                {
                    type:'pie',
                    radius: ['65%', '85%'],
                    label: {
                        normal: {
                            formatter: '{b|{b}：}  {per|{d}%}  ',
                            backgroundColor: '#fff',
                            borderColor: '#aaa',
                            borderWidth: 1,
                            borderRadius: 4,
                            padding: [0, 7],
                            rich: {
                                hr: {
                                    borderColor: '#aaa',
                                    width: '100%',
                                    borderWidth: 0.5,
                                    height: 0
                                },
                                b: {
                                    fontSize: 12,
                                    lineHeight: 20
                                }
                            }
                        }
                    },
                    labelLine:{
                        normal:{
                            length:5,
                            length2:10
                        }
                    },
                    data:newData
                }
            ]
        };
        newsChart.setOption(newsOption);
    },

    //-----------------K线图
    createKChart:function (num,Kchart) {
        var upColor = '#00da3c';
        var downColor = '#ec0000';

        var newData=[],volumes=[],averageEmotion=[],dateData=[];
        num.data.result.historyPublicOpinion.forEach(function (t) {
            if(Math.abs(t.positiveEmotion)>=Math.abs(t.negativeEmotion)){
                newData.push([t.positiveEmotion,t.negativeEmotion,t.positiveEmotion,t.negativeEmotion]);
            }else {
                newData.push([t.negativeEmotion,t.positiveEmotion,t.positiveEmotion,t.negativeEmotion]);
            }

            dateData.push(t.date);
            volumes.push(t.totalInfoCount);
            averageEmotion.push(t.averageEmotion);
        });
        var option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross'
                },
                formatter: function(params) {
                    if(params[0].componentSubType=='bar'){
                        return "资讯总数："+params[0].data
                    }else if(params[0].componentSubType!='bar'&&params[1]){
                        return "日期："+params[0].axisValueLabel+"</br>正面情感指数："+params[0].data[3]+"</br>负面情指数:"+params[0].data[4]+"</br>情感趋势:"+params[1].data
                    }else if(params[0].componentSubType!='bar'&&!params[1]&&params[0].data[3]){
                        return "日期："+params[0].axisValueLabel+"</br>正面情感指数："+params[0].data[3]+"</br>负面情指数:"+params[0].data[4]+"</br>情感趋势:"
                    }else if(params[0].componentSubType!='bar'&&!params[1]&&!params[0].data[3]){
                        return "日期："+params[0].axisValueLabel+"</br>情感趋势："+params[0].data
                    }

                }
            },
            legend: {
                data: ['资讯总数', '情感趋势'],
                bottom:"10"
            },
            grid: [{
                left: 40,
                right: 30,
                top: 50,
                height: 150,
            }, {
                left: 30,
                right: 30,
                height: 30,
                top: 220,
            }],
            xAxis: [{
                type: 'category',
                data: dateData,
                boundaryGap : false,
                axisLine: { lineStyle: { color: '#777' } },
                axisLabel: {
                    formatter: function (value) {
                        return echarts.format.formatTime('MM-dd', value);
                    }
                },
                min: 'dataMin',
                max: 'dataMax',
                axisPointer: {
                    show: true
                }
            },{
                type: 'category',
                gridIndex: 1,
                data: volumes,
                scale: true,
                boundaryGap : false,
                splitLine: {show: false},
                axisLabel: {show: false},
                axisTick: {show: false},
                axisLine: { lineStyle: { color: '#777' } },
                splitNumber: 20,
                min: 'dataMin',
                max: 'dataMax',
            }],
            yAxis: [{
                scale: true,
                splitArea: {
                    show: true
                },

            },{
                scale: true,
                gridIndex: 1,
                splitNumber: 2,
                axisLabel: {show: false},
                axisLine: {show: false},
                axisTick: {show: false},
                splitLine: {show: false}
            }],
            dataZoom: [
                {
                    type: 'inside',
                },
            ],
            series: [{
                name: '资讯总数',
                type: 'bar',
                xAxisIndex: 1,
                yAxisIndex: 1,
                data: volumes
            },
                {
                    name: '资讯总数',
                    type: 'candlestick',
                    data: newData,
                    itemStyle: {
                        normal: {
                            color: upColor,
                            color0: downColor,
                            borderColor: null,
                            borderColor0: null
                        }
                    },
                },
                {
                    name: '情感趋势',
                    type: 'line',
                    data: averageEmotion,
                    smooth: true,
                    lineStyle: {
                        normal: {opacity: 0.5}
                    }
                }

            ]
        };

        Kchart.setOption(option)

    },

    //-------------版权链AJAX
    copyRightAjax: function (myChart) {
        var _this=this;
        if($("input[name="+clickType+"]").val()!=0){
            _this.showWrap();
            return;
        }
        myChart.showLoading();
        this.AJAX('/api/copyright/getPaint?workSeqNo='+workSeqNo,function (data) {
            myChart.hideLoading();
            if(data.data.resultCode&&data.data.resultCode==200){
                $("input[name='bql']").val('1');
                _this.haveContent();
                var dataList=data.data.result.paint;
                _this.createEchart(dataList,myChart);
            }else {
                _this.noData("网络错误，未产生版权链监听数据。请稍后再试");
            }
        },function () {
            myChart.hideLoading();
            _this.noData("该作品版权链"+_this.tishiText(),'sz')
        },false)
    },

    //-------------版权链关系图构造方法
    createEchart:function(dataList,myChart) {
        var colors=['#1A8CDC','#67C1FF','#60CFBB','#F27C7C','#F5A623','#6dabd2','#a0a1a2'];
        var myChartDada=[],myChartLink=[],newLine=[],_this=this;
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
                symbolSize:p1.nodeType=='WORK'?_this.strLength(p1.name,1):_this.strLength(p1.name,2),
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
            backgroundColor:'#FFFFFF',
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
    },

    strLength:function (str,num) {
        var _length=str.length;
        var newStr='';
        if(num==1){
            return [10*str.length,40]
        }else{
            return [12*str.length+20,40]
        }
    },

    haveContent:function () {
        $('.content-wrap[data-type="'+clickType+'"]').find('.haveContent').show();
        $('.content-wrap[data-type="'+clickType+'"]').find('.noContent').hide()
    },

    noContent:function (t,noType) {
        var h = '';
        if (noType && noType == 'sz') {
            h= '<img src="../app/images/img_sz_1.png">' +
                '<p class="noContent-text">'+t+'</p>'
        } else {
            h= '<a class="app_detail img_wk"></a>' +
                '<p class="noContent-text">'+t+'</p>'
        }
        $('.content-wrap[data-type="'+clickType+'"]').find('.haveContent').hide();
        $('.content-wrap[data-type="'+clickType+'"]').find('.noContent').show().html(h);
    },

    showWrap:function () {
        $('.content-wrap').each(function () {
            $(this).hide();
            if($(this).data('type')==clickType){
                $(this).show()
            }
        })
        $('.loading_div').hide()
    },

    AJAX:function (url,callback,callback2,status) {
        var _this=this;
        //----------------是否解锁该作品
        if($('.monitorStatus').val()==0 && status){
            callback2();
        }
        $.ajax({
            url: url,
            type: 'get',
            success:function (data) {
                if($('.monitorStatus').val()!=0 || !status ){
                    callback(data);
                }
                appDetail.showWrap();
            },
            error:function (data) {
                $('.loading_div').hide()
            }
        });
    },

    getDate:function (time,num) {
        var newDa=new Date(time);
        var y = newDa.getFullYear();
        var m = newDa.getMonth() + 1;
        m = m < 10 ? '0' + m : m;
        var d = newDa.getDate();
        d = d < 10 ? ('0' + d) : d;
        return num == 1 ? y + '-' + m + '-' + d :  m + '/' + d
    },

    measureTitle:function(data) {
        if(data=='小说' || data=='动漫'){
            return '阅读总量'
        }else{
            return '播放总量'
        }
    },

    unitConversion: function(num) {
    if(num>100000000){
        return  (num/100000000).toFixed(2)+'亿';
    }else if(num>10000){
        return  (num/10000).toFixed(2)+'万';
    }else{
        return  num;
    }
}

}

$(function () {
    var date1 = new Date();
    date1.setDate(new Date().getDate()-7);

    if($('.fromCode').val()=='bql'){
        clickType='bql';
        $('#copyRight').css({
            'width':$(window).width()+'px',
            'height':($(window).height()-153)+'px'
        });
        var myChart = echarts.init(document.getElementById('copyRight'));
        appDetail.copyRightAjax(myChart)
    }

    var times = date1.getFullYear()+"-"+(date1.getMonth()+1)+"-"+date1.getDate();
    $('#start1').val(times);
    $('#endTime').html(new Date().getFullYear()+"-"+(new Date().getMonth()+1)+"-"+new Date().getDate());
})