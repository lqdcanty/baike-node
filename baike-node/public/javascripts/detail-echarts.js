/**
 * Created by EFIDA on 2017/5/3.
 */
var workSeqNo=$('#workItemID').val();//作品ID
var addue = UE.getEditor('add-container',{
    maximumWords:60000
});

// 基于准备好的dom，初始化echarts实例
var Kchart = echarts.init(document.getElementById('k-chart'));
if(document.getElementById('weekNum')){
    var weekNumChart = echarts.init(document.getElementById('weekNum'));
}
if(document.getElementById('gauge-chart')){
    var gaugeChart = echarts.init(document.getElementById('gauge-chart'));
}
if(document.getElementById('news-chart')){
    var newsChart = echarts.init(document.getElementById('news-chart'));
}

// 指定图表的配置项和数据
var option1 = {
    tooltip: {
        trigger: 'axis'
    },
    color:['#F37C7C','#687FFF','#5AB5F4','#60CFBB','#F6A623','#DF2D79','#5CA7BA'],
    grid: {
        bottom:'22',
        left:'10',
        right:'0',
        width:"80%",
        height:"75%"
    },
    calculable : true,
    xAxis : {
        type: 'category',
        boundaryGap: false,
        axisTick:{
            show:false,
            interval:0
        },
        axisLabel:{
            interval:0,
            align:'left',
            rotate:-15,
        },
        data: [],
    },
    yAxis : [
        {
            type : 'value',
            axisTick: {
                show: false
            },
            nameGap:'5',
            axisLabel: {
                show: false
            },
            axisLine: {
                lineStyle:{
                    color:"##E2E2E2"
                }
            },
            // splitLine: {
            //     show: true
            // }
        }
    ],
    series : []
};
var option2 = {
    title:{
        textStyle:{
            fontSize:12
        }
    },
    tooltip : {
        trigger: 'axis',
        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
    },
    grid: {
        top:'22',
        left:'10',
        right:'40',
        width:"85%",
        height:"65%"
    },
    calculable : true,
    xAxis : [
        {
            type : 'category',
            axisTick:{
                show:false,
                interval:0
            },
            axisLabel:{
                interval:0,
                align:'left',
                rotate:-45
            },
            data : []
        }
    ],
    yAxis : [
        {
            type : 'value',
            axisTick: {
                show: false
            },
            nameGap:'5',
            axisLabel: {
                show: false
            },
            axisLine: {
                lineStyle:{
                    color:"#E2E2E2"
                }
            },

        }
    ],
    series : [
        {
            name:'',
            type:'bar',
            data:[],
            itemStyle: {
                normal: {
                    color: function(params) {
                        var colorList=['#F37C7C','#687FFF','#5AB5F4','#60CFBB','#F6A623','#DF2D79','#5CA7BA'];
                        return colorList[params.dataIndex]
                    }
                }
            }
        }
    ]
};
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
        type: 'value'
    },
    yAxis: {
        type: 'category',
        data: [],
        axisTick:{
            show:false
        },
    },
    series: []
};
// 使用刚指定的配置项和数据显示图表。
if(weekNumChart) {
    weekNumChart.setOption(option3);
    weekNumChart.showLoading();
}
// measureNumChart.setOption(option2);

$(".close_btn").click(function () {
    $(this).parent().parent().parent().parent().hide();
});
var ajax_flag=false;
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
            }else if(data.data.result.publicOpinionSummary.emotionValue==0){
                this.emotionValue='中性';
            }
            this.effectCount=data.data.result.publicOpinionSummary.effectCount!=null?data.data.result.publicOpinionSummary.effectCount:'—';
            this.totalInfoCount=data.data.result.publicOpinionSummary.totalInfoCount!=null?data.data.result.publicOpinionSummary.totalInfoCount:"—";
        },
        changeNews:function () {
            var _this=this;
            var newPage=this.curPage<this.totalPage?this.curPage+1:1;
            DetailAjax.AJAX('/api/public/sentiment/related/news?workSeqNo='+workSeqNo+'&currentPage='+newPage,function (data) {
                if(data.data.resultCode==200){
                    _this.curPage=newPage;
                    _this.newsList=data.data.result.news;
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
var cinemaVue;//院线票房VUe
var DetailAjax= {
    tishiText:function(){
        //----------------是否关注该作品
        if($('.isSubscribe').val()==0){
            return '您已经申请解锁该作品监听服务。我们需要2-3个工作日整理该作品监听数据并形成监听报告，通过邮件的方式发送到您的邮箱。'
        }else{
            return '词条【'+ $('.workName').html()+'】'+'<span style="font-weight: bold;color: #000">'+'版权数据服务'+'</span>'+'处于锁定中，如果你想获得该数据服务请点击'+'<span style="font-weight: bold;color: #000">'+'解锁'+'</span>'+'按钮激活服务。'
        }
    },

    changeMonitorNav: function (ele) {  //  版权数据table切换
        $(ele).addClass('active').siblings().removeClass('active');
        $(ele).find('i').addClass('active');
        if($(ele).data('type')=='copyRight'){
            $('.monitor-content').find('.'+$(ele).data('type')).addClass('active').siblings().removeClass('active')
        }
        $(ele).siblings().find('i').removeClass('active');
    },

    //-----电影类--------院线票房AJAX
    cinemaAjax:function (ele) {
        var _this=this;
        var cinemaChart = echarts.init(document.getElementById('cinema-chart'));
        cinemaChart.showLoading();

        this.AJAX('/api/work/cinema/box?workSeqNo='+workSeqNo,function (data) {
            if(data.data.resultCode==200) {
                if(data.data.result.boxTotal){
                    cinemaVue.creatList(data);
                    var dataX=[],dataY=[],historyList=data.data.result.broken;
                    for(var i=0;i<historyList.length;i++){
                        dataX.push(_this.getDate(historyList[i].date,2));
                        dataY.push(historyList[i].oneDayBox);
                    };
                    var option = {
                        tooltip : {
                            trigger: 'axis'
                        },
                        grid: {
                            left: '3%',
                            right: '4%',
                            bottom: '2%',
                            containLabel: true,
                            height:'95%',
                            width:'90%'
                        },
                        xAxis: [{
                            type: 'category',
                            boundaryGap: false,
                            axisTick:{
                                show:false,
                                interval:0
                            },
                            axisLabel:{
                                color:'#666666'
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
                                formatter: '{value} 万',
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
                    _this.hideLoding(ele);
                    _this.showDataWrap(ele);
                }else{
                    _this.noData("该电影目前院线上映，未产生院线票房监听数据。如果您还未关注该作品，请【 关注】 该作品。该作品一旦上映我们将尽快整理该作品相关监听数据并形成报告文件，通过邮件的方式发送到您的邮箱。",ele)
                }
            }else{
                _this.noData("网络错误，未产生院线票房监听数据。请稍后再试",ele)
            }
            _this.hideLoding(ele);

        },function () {
            _this.noData(_this.tishiText(),ele,'sz')
        },true)
    },

    downBt:function (ele) {
        var _this=this;
        var downBtChart = echarts.init(document.getElementById('downBt-chart'));
        downBtChart.showLoading();

        this.AJAX('/api/work/cinema/box?workSeqNo='+workSeqNo,function (data) {
            if(data.data.resultCode==200) {
                if(data.data.result.boxTotal){
                    var downBtVue=new Vue({
                        el:'#downBtVue',
                        data:{
                            historyList:[],
                            cinemaNum:'—',
                            cinemaToday:'—',
                            cinemaRanking:'—',
                            audience:'—',
                            showStatus:false,
                            releaseStatus:'',
                        },
                        methods:{
                            creatList:function (data) {
                                this.cinemaNum=(data.data.result.boxTotal==""?"—":data.data.result.boxTotal);
                                this.cinemaRanking=(data.data.result.boxRanking==""?"—":data.data.result.boxRanking);
                                this.cinemaToday=(data.data.result.todayBox==""?"—":data.data.result.todayBox);
                                this.audience=(data.data.result.audience==""?"—":data.data.result.audience);
                                this.historyList=data.data.result.history;
                                this.releaseStatus=data.data.result.status;
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
                            changeShow:function (str) {
                                this.showStatus=str;
                                console.log(str)
                            }
                        }
                    });
                    var dataX=[],dataY=[],historyList=data.data.result.broken;
                    for(var i=0;i<historyList.length;i++){
                        dataX.push(_this.getDate(historyList[i].date,2));
                        dataY.push(historyList[i].oneDayBox);
                    };
                    var option = {
                        tooltip : {
                            trigger: 'axis'
                        },
                        grid: {
                            left: '3%',
                            right: '4%',
                            bottom: '2%',
                            containLabel: true,
                            height:'95%',
                            width:'90%'
                        },
                        xAxis: [{
                            type: 'category',
                            boundaryGap: false,
                            axisTick:{
                                show:false,
                                interval:0
                            },
                            axisLabel:{
                                color:'#666666'
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
                                formatter: '{value} 万',
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
                    downBtChart.hideLoading();
                    downBtChart.setOption(option);
                    _this.hideLoding(ele);
                    _this.showDataWrap(ele);
                }else{
                    _this.noData("该电影目前院线上映，未产生院线票房监听数据。如果您还未关注该作品，请【 关注】 该作品。该作品一旦上映我们将尽快整理该作品相关监听数据并形成报告文件，通过邮件的方式发送到您的邮箱。",ele)
                }
            }else{
                _this.noData("网络错误，未产生院线票房监听数据。请稍后再试",ele)
            }
            _this.hideLoding(ele);

        },function () {
            _this.noData(_this.tishiText(),ele,'sz')
        },true)
    },

    //-----电影类--------网络播放AJAX
    moviePlay:function (ele) {
        var _this=this;
        this.playAjax(ele,function () {
           _this.noData("该电影目网络播放未开始，未产生网络播放监听数据。如果您还未关注该作品，请【 关注】 该作品。该作品一旦上映我们将尽快整理该作品相关监听数据并形成报告文件，通过邮件的方式发送到您的邮箱。",ele);
        })
    },

    //-----电影类--------专业测评AJAX
    movieEvaluating:function(ele){
        var _this=this;
        var movieVue=new Vue({
            el:'#movie-evaluating',
            data:{
                douban:undefined,
                doubanStart1:[],
                doubanStart2:[],
                doubanStart3:[],
                maoyan:undefined,
                maoyanStart1:[],
                maoyanStart2:[],
                maoyanStart3:[],
                shiguang:undefined,
                shiguangStart1:[],
                shiguangStart2:[],
                shiguangStart3:[],
                lfq:undefined,
                lfqStart1:[],
                lfqStart2:[],
                lfqStart3:[],
                imdb:undefined,
                imdbStart1:[],
                imdbStart2:[],
                imdbStart3:[]
            },
            methods:{
                creatList:function (data) {
                    var that=this;
                    that.douban=data.data.result.douBan;
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
                movieVue.creatList(data);
                _this.showDataWrap(ele);
            }else{
                _this.noData("网络错误，未产生专业评测监听数据。请稍后再试",ele);
            }
            _this.hideLoding(ele);
        },function () {
            _this.noData(_this.tishiText(),ele,'sz')
        },true)
    },

    //-----电视类--------网络播放AJAX
    tvPlay:function (ele) {
        var _this=this;
        this.playAjax(ele,function () {
            _this.noData("版权百科正在尽快整理该作品网络播放监听数据。您可以【关注】该作品，数据整理成功后我们将通过邮件的方式将数据监听报告发送到您的邮箱。",ele);
        })
    },

    //-----电视类--------用户评测AJAX
    tvEvaluatingAjax:function (ele) {
        var _this=this;
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
                EditorVue.creatList(data);
                _this.showDataWrap(ele);
            }else{
                _this.noData("网络错误，未产生用户评测监听数据。请稍后再试",ele);
            }
            _this.hideLoding(ele);

        },function () {
            _this.noData(_this.tishiText(),ele,'sz')
        },true)
    },

//-----音乐类--------在线播放AJAX
    musicPlay:function (el) {
        var _this=this;
        this.playAjax(el,function () {
            _this.noData("版权百科正在尽快整理该作品在线播放监听数据。您可以【关注】该作品，数据整理成功后我们将通过邮件的方式将数据监听报告发送到您的邮箱。",el);
        })
    },

    //------------音乐类--------平台排行榜AJAX
    platformRanking:function (ele)  {
        var _this=this;
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
                MusicVue.creatList(data);
                _this.showDataWrap(ele);
            }else{
                _this.noData("网络错误，未产生平台排行榜监听数据。请稍后再试",ele);
            }
            _this.hideLoding(ele);

        },function () {
            _this.noData(_this.tishiText(),ele,'sz')
        },true)
    },

    //-----小说动漫--------网络阅读AJAX
    textPlay:function (ele) {
        var _this=this;
        console.log(ele)
        this.playAjax(ele,function () {
            _this.noData("版权百科正在尽快整理该作品网络阅读监听数据。您可以【关注】该作品，数据整理成功后我们将通过邮件的方式将数据监听报告发送到您的邮箱。",ele);
        })
    },

    //-----小说动漫--------相关APP AJAX
    webApp:function (ele) {
        var _this=this;
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
                appVue.creatList(data);
                _this.showDataWrap(ele);
            }else{
                _this.noData("网络错误，未产生相关APP监听数据。请稍后再试",ele);
            }
            _this.hideLoding(ele);

        },function () {
            _this.noData(_this.tishiText(),ele,'sz')
        },true)
    },

    //-----小说动漫--------平台榜单 AJAX
    platfromList:function (ele) {
        var _this=this;
        var platfromChart = echarts.init(document.getElementById('platfromChart'));
        platfromChart.showLoading();
        this.AJAX('/api/work/platfrom/list?workSeqNo='+workSeqNo,function (data) {
            platfromChart.hideLoading();
            if(data.data.resultCode==200){
                if(data.data.result.total>0){
                    $('.platfromList').find('.cinema-Num').html(data.data.result.total==""?"—":data.data.result.total)
                    var s='',platfromList=data.data.result.platfrom,dataX=[],dataY=[];
                    for(var i=0;i<platfromList.length;i++){
                        s+='<tr><td>'+platfromList[i].platfrom+'</td>' +
                            '<td>'+platfromList[i].date+'</td>' +
                            '<td><a>'+platfromList[i].listName+'</a></td>' +
                            '<td>'+platfromList[i].listNumber+'</td></tr>';
                        dataX.push(platfromList[i].platfrom);
                        dataY.push(platfromList[i].listNumber);
                    };
                    $('.platfromTable').find('tbody').html(s);
                    var option = {
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
                    _this.showDataWrap(ele);
                    platfromChart.hideLoading();
                    platfromChart.setOption(option);
                    _this.hideLoding(ele);
                }else{
                    _this.noData("该作品未产生平台榜单监听数据。如果您还未关注该作品，请【 关注】 该作品。该作品一旦上映我们将尽快整理该作品相关监听数据并形成报告文件，通过邮件的方式发送到您的邮箱。",ele)
                }
                _this.showWrap(ele);
            }else{
                _this.noData("网络错误，未产生平台榜单监听数据。请稍后再试",ele);
            }
            _this.hideLoding(ele);

        },function () {
            _this.noData(_this.tishiText(),ele,'sz')
        },true)
    },

    //-------------搜索指数AJAX
    trendAjax: function (ele) {
        var _this=this;
        this.AJAX('/api/work/index/image?workSeqNo='+workSeqNo+'&type='+$(ele).data('type'),function (data) {
            _this.showWrap(ele);
            if(data.data.resultCode==200 && data.data.result.imageUrl!=""){
                $('.trend').find('img').attr('src',data.data.result.imageUrl);
                _this.showDataWrap(ele);
                _this.hideLoding(ele);
            }else{
                _this.noData("抱歉,未产生搜索指数监听数据。如果您还未关注该作品，请【 关注】 该作品。该作品用户画像我们将尽快整理该作品相关监听数据并形成报告文件，通过邮件的方式发送到您的邮箱。",ele);
            }
        },function () {
            _this.noData(_this.tishiText(),ele,'sz')
        },false)
    },

    //-------------舆情洞察AJAX
    sentimentAjax: function (ele) {
        var _this=this;
        gaugeChart.showLoading();
        newsChart.showLoading();
        this.AJAX('/api/public/sentiment/info?workSeqNo='+workSeqNo,function (data) {
            _this.showWrap(ele);
            if(data.data.resultCode==200 && data.data.result.publicOpinionSummary!=null){
                sentimentVue.creatList(data);
                _this.createGaugeChart(data);
                _this.createNewsChart(data);
                _this.createKChart(data);
                _this.showDataWrap(ele);
                _this.hideLoding(ele);
            }else{
                _this.noData(" 我们暂未收录该作品相关舆情，如果您需要获得该舆情，请关注该作品，我们将在3-5个工作日准备该舆情数据。",ele);
            }
        },function () {
            _this.noData(_this.tishiText(),ele,'sz')
        },true)
    },

    //-----------------舆情洞察情感偏向
    createGaugeChart:function (data) {
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
    createNewsChart:function (data) {
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
    createKChart:function (num) {
        var upColor = '#00da3c';
        // var downColor = '#ec0000';
        var downColor = '#1A8CDC';

        var newData=[],averageEmotion=[],dateData=[];
        num.data.result.historyPublicOpinion.forEach(function (t) {
            if(Math.abs(t.positiveEmotion)>=Math.abs(t.negativeEmotion)){
                newData.push([t.positiveEmotion,t.negativeEmotion,t.positiveEmotion,t.negativeEmotion]);
            }else {
                newData.push([t.negativeEmotion,t.positiveEmotion,t.positiveEmotion,t.negativeEmotion]);
            }
            dateData.push(t.date);
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
                data: ['情感指数', '情感趋势'],
                bottom:"10"
            },
            grid: [{
                left: 40,
                right: 30,
                top: 50,
                height: 150,
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
            }],
            yAxis: [{
                scale: true,
                splitArea: {
                    show: true
                },

            }],
            dataZoom: [
                {
                    type: 'inside',
                },
            ],
            series: [
                // {
                //     name: '情感指数',
                //     type: 'candlestick',
                //     data: newData,
                //     itemStyle: {
                //         normal: {
                //             color: upColor,
                //             color0: downColor,
                //             borderColor: null,
                //             borderColor0: null
                //         }
                //     },
                // },
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
    copyRightAjax: function (myChart,ele) {
        var _this=this;
        myChart.showLoading();
        this.AJAX('/api/copyright/getPaint?workSeqNo='+workSeqNo,function (data) {

            myChart.hideLoading();
            if(data.data.resultCode&&data.data.resultCode==200){
                var dataList=data.data.result.paint;
                _this.createEchart(dataList,myChart);
                _this.hideLoding(ele);
            }else {
                _this.noData("网络错误，未产生版权链监听数据。请稍后再试",ele);
            }
        },function () {
            myChart.hideLoading();
            _this.noData(_this.tishiText(),ele,'sz')
        },false)
    },

    //-------------用户画像
    crowdAjax:function (ele) {
        var _this=this;
        this.AJAX('/api/work/index/image?workSeqNo='+workSeqNo+'&type='+$(ele).data('type'),function (data) {
            _this.showWrap(ele);
            if(data.data.resultCode==200 && data.data.result.imageUrl!=""){
                $('.crowd').find('img').attr('src',data.data.result.imageUrl);
                _this.showDataWrap(ele);
                _this.hideLoding(ele);
            }else{
                _this.noData("抱歉,未产生用户画像监听数据。如果您还未关注该作品，请【 关注】 该作品。该作品用户画像我们将尽快整理该作品相关监听数据并形成报告文件，通过邮件的方式发送到您的邮箱。",ele);
            }

        },function () {
            _this.noData(_this.tishiText(),ele,'sz')
        },false)
    },

    //-----网络播放---在线播放----AJAX
    playAjax: function (ele,fn) {
        var _this=this;
        var  nowTime= new Date();
        nowTime.setDate(new Date().getDate()-7);
        var startTime = nowTime.getFullYear()+"-"+(nowTime.getMonth()+1)+"-"+nowTime.getDate();
        var endTime=new Date().getFullYear()+"-"+(new Date().getMonth()+1)+"-"+new Date().getDate();
        this.AJAX('/api/work/newwork/play?workSeqNo='+workSeqNo+'&startTime='+startTime+'&endTime='+endTime,function (data) {
            _this.hideLoding(ele);
            if(data.data.resultCode==200) {
                $('.cinema-Num.play').html(data.data.result.totalPlay);
                $('.yesterdayPlay.play').html(data.data.result.yesterdayPlay);
                var s = '', historyList = data.data.result.platform;
                if($('.workDetailType').val()=='小说' || $('.workDetailType').val()=='漫画'){
                    $('.totalMan-num ').html(data.data.result.people);
                    for (var i = 0; i < historyList.length; i++) {
                        var scores=historyList[i].scores;
                        if(historyList[i].scores=='' || historyList[i].scores==null){
                            scores='—';
                        };
                        var _playProportion=historyList[i].playProportion;
                        if(historyList[i].playProportion==null || historyList[i].playProportion==""){
                            _playProportion='—'
                        };
                        s += '<tr><td>' + historyList[i].platform + '</td>' +
                            '<td>' + historyList[i].date + '</td>' +
                            '<td>' + historyList[i].totalPlay + '</td>' +
                            '<td>' + historyList[i].playProportion + '</td>' +
                            '<td>' + scores + '</td></tr>';
                    }
                }else{
                    $('.webNum.play').html(data.data.result.monitorSet);
                    for (var i = 0; i < historyList.length; i++) {
                        var _playProportion=historyList[i].playProportion;
                        if(historyList[i].playProportion==null || historyList[i].playProportion==""){
                            _playProportion='—'
                        };
                        s += '<tr><td>' + historyList[i].platform + '</td>' +
                            '<td>' + historyList[i].date + '</td>' +
                            '<td>' + historyList[i].totalPlay + '</td>' +
                            '<td>' + _playProportion + '</td></tr>';
                    }
                }
                $('.palyTable').find('tbody').html(s);
                weekNumChart.hideLoading();
                if (data.data.result.play.length < 1) {
                    _this.hideLoding(ele);
                    fn();
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
                        num.push(u.total);
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
                $('.playChartTitle').html('七日' + measureTitle(data.data.result.type) + ':' + unitConversion(maxNum));
                weekNumChart.setOption({
                    legend: {
                        data: legendData
                    },
                    yAxis: {
                        data: categories
                    },
                    series: dataList
                });
                _this.showDataWrap(ele);
            }else{
                _this.noData("网络错误，未产生网络播放监听数据。请稍后再试",ele);
            }
        },function () {
            _this.noData(_this.tishiText(),ele,'sz')
        },true)
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
        // myChart.on('click', function (params) {
        //     // 控制台打印数据的名称
        //     console.log(params);
        //     window.open("../copyRight/bql/"+workSeqNo)
        // });
    },

    // -----------点击table切换显示相应的内容
    showWrap:function (ele) {
        // $('.monitor-content').find('.'+$(ele).data('type')).addClass('active').siblings().removeClass('active')
    },

    //------------- 有数据显示页面
    showDataWrap:function (ele) {
        $('.monitor-content').find('.'+$(ele).data('type')).find('.loading-wrap').hide();
        $('.monitor-content').find('.'+$(ele).data('type')).find('.data-wrap').show()
    },

    //--------没有返回数据或网络错误页面显示
    noData:function (str,ele,noType) {
        var _this=this;
        var h = '';
        if (noType && noType == 'sz' && $('.isSubscribe').val()==0) {
            h= '   <div class="noStatus">' +
                '            <div class="text_center">' +
                '                <div class="monitorImg img_wk"></div>' +
                '            </div>' +
                '            <p>尊敬的用户：</p>' +
                '            <p class="noStatusText">' + str + '</p>' +
                '        </div>';
        } else if(noType && noType == 'sz' && $('.isSubscribe').val()==1){
            h= '   <div class="noStatus">' +
                '            <div class="text_center">' +
                '                <a onclick="DetailAjax.openLockFun()" class="js_btn"></a>' +
                '            </div>' +
                '            <p>尊敬的用户：</p>' +
                '            <p class="noStatusText">' + str + '</p>' +
            '        </div>';
        }else{
            h= '   <div class="noStatus">' +
                '            <div class="text_center">' +
                '                <div class="monitorImg img_wk"></div>' +
                '            </div>' +
                '            <p>尊敬的用户：</p>' +
                '            <p class="noStatusText">' + str + '</p>' +
                '        </div>';
        }
        $('.monitor-content').find('.'+$(ele).data('type')).find('.loading-wrap').hide();
        $('.monitor-content').find('.'+$(ele).data('type')).find('.data-wrap').hide();
        $('.monitor-content').find('.'+$(ele).data('type')).find('.nodata-wrap').show().html(h);
        this.hideLoding(ele);
    },

    //-------------隐藏loding动画
    hideLoding:function (ele) {
        $(ele).find('i').removeClass('active');
    },

    //-------------封装AJAX
    AJAX:function (url,callback,callback2,status) {
        //----------------是否解锁该作品
        if($('.monitorStatus').val()==0 && status && $('.formWeb').val()=='web'){
            callback2();
        }
        $.ajax({
            url: url,
            type: 'get',
            success:function (data) {
                if($('.monitorStatus').val()!=0 || !status || $('.formWeb').val()!='web'){
                    callback(data);
                }
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

    strLength:function (str,num) {
        var _length=str.length;
        var newStr='';
        if(num==1){
            return [10*str.length,40]
        }else{
            return [12*str.length+20,40]
        }
    },

    clickMaxLabel:function () {
        $('.smallLabel').slideUp();
        $('.smallLabel-wrap').find('.bottom-icon').removeClass('icon-shangjiantou').addClass('icon-xiajiantou')
        $('.smallLabel').attr('value',1);
        if( $('.maxLabel').attr('value')==1){
            $('.maxLabel').slideDown();
            $('.maxLabel-wrap').find('.bottom-icon').removeClass('icon-xiajiantou').addClass('icon-shangjiantou')
            $('.maxLabel').attr('value',2);
        }else{
            $('.maxLabel').slideUp(30);
            $('.maxLabel-wrap').find('.bottom-icon').removeClass('icon-shangjiantou').addClass('icon-xiajiantou')
            $('.maxLabel').attr('value',1)
        }
    },

    clickSmallLabel:function () {
        $('.maxLabel').slideUp();
        $('.maxLabel-wrap').find('.bottom-icon').removeClass('icon-shangjiantou').addClass('icon-xiajiantou')
        $('.maxLabel').attr('value',1);
        if($('.smallLabel').attr('value')==1){
            $('.smallLabel').slideDown();
            $('.smallLabel-wrap').find('.bottom-icon').removeClass('icon-xiajiantou').addClass('icon-shangjiantou')
            $('.smallLabel').attr('value',2);
        }else{
            $('.smallLabel').slideUp(30);
            $('.smallLabel-wrap').find('.bottom-icon').removeClass('icon-shangjiantou').addClass('icon-xiajiantou')
            $('.smallLabel').attr('value',1)
        }
    },

    selMaxLable:function (ele) {
        $('.maxLabel-val').html($(ele).html());
        $('.maxLabel').hide();
        $('.bottom-icon').removeClass('icon-shangjiantou').addClass('icon-xiajiantou')
        this.AJAX('/api/work/smallLabel?category='+$(ele).html(),function (data) {
            console.log(data);
            var list=data.data.result,s='';
            if(data.data.resultCode==200){
                for(var i=0;i<list.length;i++){
                    s+='<a onclick="DetailAjax.selSmallLable(this)">'+list[i]+'</a>'
                }
                $('.smallLabel-val').html(list[0]);
                $('.smallLabel').html(s);
            }
        })
    },

    selSmallLable:function (ele) {
        var _this=this;
        $('.smallLabel-val').html($(ele).html());
        $('.smallLabel').hide();
        $('.bottom-icon').removeClass('icon-shangjiantou').addClass('icon-xiajiantou');
        if($(ele).html()=='其他'){
            $('.smallLabel-val').hide();
            $('.elseLabel').show().focus();
            $('.smallLabel-wrap').find('.bottom-icon').hide();
            $('.elseLabel').blur(function () {
                _this.inputBlur(this);
            })
        }else{

        }
    },

    inputBlur:function (ele) {
        if($(ele).val()==''){
            $('.smallLabel-val').html('其他');
        }else{
            $('.smallLabel-val').html($(ele).val());
        }
        $('.smallLabel-wrap').find('.bottom-icon').show()
        $('.smallLabel-val').show();
        $('.elseLabel').hide();
    },

    openLockFun:function () {
        if(!isLogin()){
            $('.modle-login').show();
            showLogin();
            return;
        };
        if(ajax_flag){
            return
        }
        ajax_flag=true;
        $.ajax({
            url: '/api/work/subscribe',
            type: 'post',
            data:{
                workSeqNo:workSeqNo,
                status:'subscribe'
            },
            success:function (data) {
                if(data.data.resultCode==200){
                    $hint.open(data.data.resultMsg)
                    setTimeout(function () {
                        window.location.href="/item/"+$('#workItemID').val()
                    },1500)

                }else{
                    $hint.open(data.data.resultMsg)
                }
                ajax_flag=false;
            }
        });

    },

    //评分
    starNum:function () {
        $('.score-num-star li').each(function (p1,p2) {
            if($('.score-num-result').html()%1==0){
                if(p1< $('.score-num-result').html()){
                    $(p2).find('span').removeClass('star-hs').addClass("star-js")
                }
            }else{
                if(p1< Math.ceil($('.score-num-result').html()-1)){
                    $(p2).find('span').removeClass('star-hs').addClass("star-js")
                }else if(p1==Math.ceil($('.score-num-result').html())-1){
                    $(p2).find('span').removeClass('star-hs').addClass("star-jsb")
                }
            }

        })
    },

    getBaiDuZs:function () {
        this.AJAX('/api/work/monitorContent?workSeqNo='+workSeqNo,function (data) {
            if(data.data.resultCode==200) {
                console.log(data.data);
                $('.monitor-loading').hide();
                $('.bqbg_text').html(data.data.result.monitorContent);
                if(data.data.result.monitorContent && data.data.result.monitorContent.length>64){
                    $('.open_aside_txt').show()
                }
                $('.monitorZS-wrap').show();
            }else{

            }
        },function () {
           return;
        },true)
    },

    labelArray:[]

};


$('.monitor-nav').find('li').click(function () {
    if($(this).hasClass('active')){
        return;
    };
    DetailAjax.changeMonitorNav(this);
    $('.monitor-content').find('.'+$(this).data('type')).addClass('active').siblings().removeClass('active')
    if($(this).data('type')=='tvPlay'){
        DetailAjax.tvPlay(this);
    }else if($(this).data('type')=='trend'){
        DetailAjax.trendAjax(this);
        layer.photos({
            photos: '#layer-photos-demo1'
            ,anim: 0 //0-6的选择，指定弹出图片动画类型，默认随机（请注意，3.0之前的版本用shift参数）
        });

    }else if($(this).data('type')=='crowd'){
        DetailAjax.crowdAjax(this);
        layer.photos({
            photos: '#layer-photos-demo2'
            ,anim: 0 //0-6的选择，指定弹出图片动画类型，默认随机（请注意，3.0之前的版本用shift参数）
        });
    }else if($(this).data('type')=='copyRight'){
        var myChart = echarts.init(document.getElementById('copyRight'));
        DetailAjax.showWrap(this);
        DetailAjax.copyRightAjax(myChart,this)
    }else if($(this).data('type')=='tvEvaluating'){
        DetailAjax.tvEvaluatingAjax(this)
    }else if($(this).data('type')=='cinema'){
        DetailAjax.cinemaAjax(this);
    }else if($(this).data('type')=='downBt'){
        DetailAjax.downBt(this);
    }else if($(this).data('type')=='movieEvaluating'){
        DetailAjax.movieEvaluating(this)
    }else if($(this).data('type')=='moviePlay'){
        weekNumChart.showLoading();
        DetailAjax.moviePlay(this)
    }else if($(this).data('type')=='sentiment'){
        DetailAjax.sentimentAjax(this)
    }else if($(this).data('type')=='musicPlay'){
        DetailAjax.musicPlay(this);
    }else if($(this).data('type')=='platformRanking'){
        DetailAjax.platformRanking(this)
    }else if($(this).data('type')=='textPlay'){
        DetailAjax.textPlay(this)
    }else if($(this).data('type')=='webApp'){
        DetailAjax.webApp(this)
    }else if($(this).data('type')=='platfromList'){
        DetailAjax.platfromList(this);

    };
});

if( $('.workDetailType').val()=='电影' || $('.workDetailType').val()=='卡通电影' ){
    DetailAjax.cinemaAjax( $("li[data-type='cinema']"));
    cinemaVue=new Vue({
        el:'#cinemaVue',
        data:{
            historyList:[],
            cinemaNum:'—',
            cinemaToday:'—',
            cinemaRanking:'—',
            audience:'—',
            showStatus:false,
            releaseStatus:'',
        },
        methods:{
            creatList:function (data) {
                this.cinemaNum=(data.data.result.boxTotal==""?"—":data.data.result.boxTotal);
                this.cinemaRanking=(data.data.result.boxRanking==""?"—":data.data.result.boxRanking);
                this.cinemaToday=(data.data.result.todayBox==""?"—":data.data.result.todayBox);
                this.audience=(data.data.result.audience==""?"—":data.data.result.audience);
                this.historyList=data.data.result.history;
                this.releaseStatus=data.data.result.status;
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
            changeShow:function (str) {
                this.showStatus=str;
                console.log(str)
            }
        }
    });
}else if($('.workDetailType').val()=='电视剧' || $('.workDetailType').val()=='体育赛事' || $('.workDetailType').val()=='动画片' || $('.workDetailType').val()=='综艺' || $('.workDetailType').val()=='短视频' || $('.workDetailType').val()=='纪录片'){
    DetailAjax.tvPlay( $("li[data-type='tvPlay']"))
}else if($('.workDetailType').val()=='录音制品' || $('.workDetailType').val()=='MV' ){
    DetailAjax.musicPlay( $("li[data-type='musicPlay']"))
}else if($('.workDetailType').val()=='小说' || $('.workDetailType').val()=='漫画'){
    DetailAjax.textPlay( $("li[data-type='textPlay']"))
}else{
    var myChart = echarts.init(document.getElementById('copyRight'));
    // DetailAjax.showWrap(this);
    DetailAjax.copyRightAjax(myChart,this)
    DetailAjax.trendAjax(myChart,$("li[data-type='trend']"));
    $(".monitor-content").find('.copyRight').addClass('active')
}

//随即颜色
function getColor(params) {
    // build a color map as your need.
    var r=Math.floor(Math.random()*256);
    var g=Math.floor(Math.random()*256);
    var b=Math.floor(Math.random()*256);
    return "rgb("+r+','+g+','+b+")";//所有方法的拼接都可以用ES6新特性`其他字符串{$变量名}`替换
}
//获取URL参数
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg); //匹配目标参数
    if (r != null) return unescape(r[2]); return null; //返回参数值
}

$(function () {

    if($('#from').val()=="'dy'"){
        if(!isLogin()){
            $('.modle-login').show();
            showLogin();
            return;
        };
        $('.dy-module').show()
    }
    DetailAjax.starNum();
    DetailAjax.getBaiDuZs();
    //评分渲染
    $('.score-num-line li').each(function () {
        var _width=$(this).find('.score-num-value').data('num');
        $(this).find('a span').css({"width":_width})
    });

    var date1 = new Date();
    date1.setDate(new Date().getDate()-7);
    var times = date1.getFullYear()+"-"+(date1.getMonth()+1)+"-"+date1.getDate();
    $('#start1').val(times);
    $('#endTime').html(new Date().getFullYear()+"-"+(new Date().getMonth()+1)+"-"+new Date().getDate());

    $('.otherWeb-container').find(".swiper-slide").each(function () {
        $(this).css({"background-color":getColor()})
    });
    
    $('.ue').each(function () {
        var s=UE.getEditor($(this).attr('id'),{
            maximumWords:60000
        })
    });

    // // 日期插件
    var start = {
        elem: '#start1',
        format: 'YYYY-MM-DD',
        max: laydate.now(-7), //最大日期
        start: laydate.now(-7),  //开始日期
        istoday: false,
        fixed: true,
        choose: function(datas){
            weekNumChart.showLoading();
            var date2 = new Date(datas);
            date2.setDate(new Date(datas).getDate()+7);
            var times = date2.getFullYear()+"-"+(date2.getMonth()+1)+"-"+date2.getDate();
            $('#endTime').html(times);
            $.ajax({
                url: '/api/work/playCount/analysis?workSeqNo='+workSeqNo+'&startTime='+datas+'&endTime='+times,
                type: 'get',
                success: function(data){
                    if( data.data.result.play.length<1){
                        $('#weekNum').hide();
                        $('.no-weekNum').html('暂无数据分析').show();
                        return;
                    }
                    $('#weekNum').show();
                    $('.no-weekNum').html('').hide();
                    weekNumChart.hideLoading();
                    var categories=[];
                    var dataList=[],legendData=[],maxNum=0;
                    data.data.result.play.forEach(function (x,index) {
                        var num=[];
                        legendData.push(x.name);
                        x.measures.forEach(function (u,index1) {
                            if(index==0){
                                categories.push(u.date);
                            }
                            num.push(u.total);
                            maxNum+=parseInt(u.total);
                        });
                        var s= {
                            name:x.name,
                            type:'bar',
                            stack: '总量',
                            itemStyle:{

                            },
                            data:num
                        };
                        dataList.push(s);
                    });
                    weekNumChart.setOption({
                        legend: {
                            data: legendData
                        },
                        yAxis:{
                            data:  categories
                        },
                        series: dataList
                    });
                }
            });
        }
    };
    if(document.getElementById('start1')){
        laydate(start);
    }


    //编辑基本信息
    $('.openEditor').click(function () {
        if(!isLogin()){
            $('.modle-login').show();
            showLogin();
            return;
        };
        $('.basicIfo-div').hide();
        $('#basicIfoForm').show();
        var data=[],newData=[];
        $('#basicInfo-ul li').each(function (u,index) {
            data.push({key:$(this).find("span:first-child").html(),val:$(this).find("span:last-child").html()})
            newData.push({key:$(this).find("span:first-child").html(),val:$(this).find("span:last-child").html()})
        });
        EditorVue.info=data;
        EditorVue.newData=newData;
        EditorVue.dataName=$(this).data('name');
        EditorVue.dataId=$(this).data('id');
    });
    var EditorVue=new Vue({
        el:'#basicIfoForm',
        data:{
            info:[],
            addInfo:[],
            addData:[],
            newData:[],
            dataId:null,
            dataName:null,
            EditorStatus:true,
            saveStatus:true,
            saveAddStatus:true
        },
        methods:{
            detailInfo:function (index) {
                this.info.splice(index,1)
            },
            saveEditor:function () {
                var _this=this;
                _this.saveAddStatus=true;
                _this.saveStatus=true;
                if(this.addInfo.length>0){
                    this.addInfo.forEach(function (u,index) {

                        if(u.key=='' || u.val==''){
                            _this.saveStatus=false
                        }
                    });
                }
                this.info.forEach(function (u,index) {
                    if(u.key=='' || u.val==''){

                        _this.saveAddStatus=false
                    }
                });
                if(_this.saveStatus&&_this.saveAddStatus){
                    _this.addData=_this.info;
                    _this.addInfo.forEach(function (u,index) {
                        _this.addData.push(u)
                    });
                    _this.addInfo=[];
                    _this.info=_this.addData;
                    if(this.info.length<1){
                        $hint.open('修改内容不能为空');
                    }else{
                        ajax(JSON.stringify(_this.addData),_this.dataName,_this.dataId,function () {
                            $('#basicInfo-wrap').html($('#Editor-basicInfo').html())
                            $('.basicIfo-div').show();
                            $('#basicIfoForm').hide();
                            var s='';
                            _this.addData.forEach(function (u,index) {
                                s+=('<li><span>'+u.key+'</span><span>'+u.val+'</span></li>')
                            });
                            $('#basicInfo-ul').html(s)
                            $hint.open('修改已经提交，请等待审核');
                        })
                    }
                }else{
                    $hint.open('修改内容不能为空');
                }

            },
            cancelEditor:function () {
                $('.basicIfo-div').show();
                $('#basicIfoForm').hide();
            },
            editorInfo:function () {
                this.EditorStatus=true;
            },
            addBasicInfo: function () {
                this.addInfo.push({key:"",val:""});
            },
            detailAddInfo:function (item,index) {
                this.addInfo.splice(index,1)
            }
        }
    });
    //修改名字
    $('.updateName').click(function(){
        if(!isLogin()){
            $('.modle-login').show();
            showLogin();
            return;
        };
        var _this=this;
        $('.cancelUpdateName').addClass('inline_block');
        if($(this).find('span').html()=="编辑"){
            $('.label-wrap').css({'display':'inline-block'});
            $('.maxLabel-val').html($('.tips-div').find('a:first-child').html());
            $('.smallLabel-val').html($('.tips-div').find('a:nth-child(2)').html());
            $('.tips-div').find('a:nth-child(1)').hide();
            $('.tips-div').find('a:nth-child(2)').hide();
            $('.maxLabel-val').unbind();
            $('.smallLabel-val').unbind();
            $.ajax({
                url: '/api/work/label',
                type: 'get',
                success:function (data) {
                    var list=data.data.result,s='',l='';
                    DetailAjax.labelArray=list;
                    if(data.data.resultCode==200){
                        for(var i=0;i<list.length;i++){
                            s+='<a onclick="DetailAjax.selMaxLable(this)">'+list[i].type+'</a>';
                            if(list[i].type==$('.tips-div').find('a:first-child').html()){
                                for(var j=0;j<list[i].tags.length;j++){
                                    l+='<a onclick="DetailAjax.selSmallLable(this)">'+list[i].tags[j]+'</a>';
                                }
                                $('.smallLabel').html(l)
                            }
                        };
                        $('.maxLabel').html(s)
                    }
                }
            });
            $(this).find('span').html("保存");
            $('.workName').hide();
            $('.updateNameVal').show();
            $('.workTitle-wrap').find('span').hide();
            $('.workTitle-input').show();
            $(".para-synopsis").find("p").hide();
            $(".eSynopsisInfo").show();
            //编辑标签
            $('.maxLabel-val').click(function (event) {
                event.stopPropagation();
                DetailAjax.clickMaxLabel();
            });
            $('.smallLabel-val').click(function (event) {
                event.stopPropagation();
                DetailAjax.clickSmallLabel();
            });
            $(document).click(function () {
                $('.label-btn').next().slideUp();
                $('.label-btn').next().attr('value',1);
                $('.bottom-icon').removeClass('icon-shangjiantou').addClass('icon-xiajiantou')
            });

            $('.addTip-input').show();
            $('.tips-div').find('a').click(function () {
                updateTips(this)
            });
            $('.save-tips').click(function () {
                if(isNull($('.update-tips').val())){
                    $hint.open('标签名字不能为空');
                    return;
                }
                $(nowTips).html($('.update-tips').val());
                $('.tips-module').hide()
            });
            $('.detail-tips').click(function () {
                $(nowTips).remove();
                $('.tips-module').hide()
            });
        }else if($(this).find('span').html()=="保存"&&!isNull($('.updateWorkTitleVal').val())){
            var $name=$('.updateNameVal').val();
            var $title=$('.workTitle-input').val();
            var $txt=$(".eSynopsisInfo").val();
            var tips=[];
            $('.tips-div').find('a').each(function (p1,p2) {
                if(p1>1){
                    tips.push($(this).html())
                }
            });
            if($name==''){
                $hint.open('作品名字不能为空');
                return;
            }
            if($txt==''){
                $hint.open('作品简介不能为空');
                return;
            }
            console.log(ajax_flag)
            if(ajax_flag){
                return
            }
            ajax_flag=true;
            $.ajax({
                url: '/api/work/init/edit',
                type: 'post',
                data:{
                    workSeqNo:workSeqNo,
                    workName:$name,
                    workTitle:$title,
                    synopsis:$txt,
                    type:$('.smallLabel-val').html(),
                    category:$('.maxLabel-val').html(),
                    tags:tips.join()
                },
                success:function (data) {
                    if(data.status){
                        if(data.data.resultCode==200){
                            $('.label-wrap').css({'display':'none'});
                            $('.tips-div').find('a:nth-child(1)').show().html($('.maxLabel-val').html());
                            $('.tips-div').find('a:nth-child(2)').show().html($('.smallLabel-val').html());
                            $('.cancelUpdateName').removeClass('inline_block');
                            $('.workName').show().html($name);
                            $('.updateNameVal').hide();
                            $('.workTitle-wrap').find('span').show().html($title);
                            $('.workTitle-input').hide();
                            $(".para-synopsis").find("p").show().html($txt);
                            $(".eSynopsisInfo").hide();
                            $hint.open(data.data.resultMsg);
                            $(_this).find('span').html('编辑');
                            $('.addTip-input').hide();
                            $('.tips').find('a').unbind();
                            $('.save-tips').unbind();
                            $('.detail-tips').unbind();
                        }else{
                            $hint.open(data.data.resultMsg);
                        }
                    }else{
                        $hint.open(data.resultMsg);
                    }
                    ajax_flag =false;
                }
            })
        }else if($(this).html()=="保存"&&isNull($('.updateWorkTitleVal').val())){
            $hint.open('修改内容不能为空');
        }
    });



    //取消修改名字
    $('.cancelUpdateName').click(function () {
        $(this).removeClass('inline_block');
        $('.label-wrap').css({'display':'none'});
        $('.tips-div').find('a:nth-child(1)').show().html();
        $('.tips-div').find('a:nth-child(2)').show().html();
        $(this).prev().find('span').html("编辑");
        $('.workName').show();
        $('.updateNameVal').hide();
        $('.workTitle-wrap').find('span').show();
        $('.workTitle-input').hide();
        $(".para-synopsis").find("p").show();
        $(".eSynopsisInfo").hide();
        var s='';
        $('.tips-ul').find('li').each(function (p1,p2) {
            if(p1==0){
                s+='<a class="active" data-index="'+p1+'">'+$(this).html()+'</a>'
            }else{
                s+='<a data-index="'+p1+'">'+$(this).html()+'</a>'
            }
        })
        console.log(s);
        $('.tips-div').html(s);
        //编辑标签
        $('.addTip-input').hide();
    })

    //增加标签
    $('.addTip-input').click(function () {
        if($('.addTip-wrap').find('input').length>0){
            $hint.open('添加标签不能为空')
            return;
        }
        var t='<input type="text" id="addTip-val" class="addTip-val" onblur="addTips(this)">';
        $('.addTip-btn').show();
        $('.addTip-wrap').append(t);
        $('#addTip-val')[0].focus();
    })

    var coverImgContent="",webfilepath='';
    var api_domain = "http://tmpfs.banquanbaike.com.cn/",
        chunkSize = 4*1024*1024,
        $list = $("#recommended-works"),
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
        if(coverImgContent!==" "){
            console.log(coverImgContent.toString(),"传给后台的值");
            console.log(webfilepath,"shangchaun de zhi ")
            ajax(coverImgContent.toString(),$('#filePicker').data('name'),$('#filePicker').data('id'),function () {
                $hint.open('上传成功，请等待审核');
                $list.append('<li><a style="background-image: url('+webfilepath+')"></a></li>')
            });

        }else{
            layer.alert('请添加上传的封面图片');
        }

    });


    $("#test").click(function () {
        console.log(uploader.getFile())
    });
    $("#ctlBtn").click(function(){
        uploader.upload();
    });
    $('#cancel').click(function () {
        $('.modle-addcoverImg').hide();
    });

    //编辑其他信息
    $('.other-editor').click(function () {
        if(!isLogin()){
            $('.modle-login').show();
            showLogin();
            return;
        }
        var uId=$(this).data('num');
        var oldContent=$('#ue_'+uId).siblings('.para-other').html();
        var dataId=$(this).data('id');
        var dataName=$(this).data('name');
        var content=UE.getEditor('ue_'+uId).getContent();
        var _this=this;
        if($(this).html()=="编辑") {
            $(this).html("保存");
            $(_this).prev().removeClass('none');
            $('#ue_'+uId).show();
            $(_this).parent().next().hide();
            UE.getEditor('ue_'+uId).setContent(oldContent);
            // if(!UE.getEditor('ue_'+uId).hasContents()){
            //     UE.getEditor('ue_'+uId).setContent(oldContent, true);
            // }
        }else{
            ajax(content,dataName,dataId,function () {
                $(_this).html("编辑");
                $(_this).prev().addClass('none');
                $('#ue_'+uId).hide();
                $(_this).parent().next().show().html(UE.getEditor('ue_'+uId).getContent());
                $hint.open('修改已经提交，请等待审核');
            })
        }

    });
    //取消编辑其他信息
    $('.cancel-other').click(function () {
        var uId=$(this).data('num');
        $('#ue_'+uId).hide();
        $(this).addClass('none');
        $(this).next().html("编辑");
        $(this).parent().next().show();
    })


    //添加网站
    $('.add-otherWeb').click(function () {
        if(!isLogin()){
            $('.modle-login').show();
            showLogin();
            return;
        };
        $('.web-module').show();
    })
    $('.web-module').find('ul').find('a').click(function () {
        $('.web-module').find('ul').find('a').each(function () {
            $(this).removeClass('active');
        });
        $(this).addClass('active');
        $('.web-module').find('.web-copy').val($(this).data('type'))
    });
    $('.save-web').click(function () {
        var dataName= $('.add-otherWeb').data('name'),
            dataId= $('.add-otherWeb').data('id');
        if( $('.web-module').find('.add-webName').val()==''){
            $hint.open('网站名字不能为空');
            return;
        }
        if( $('.web-module').find('.add-webUrl').val()==''){
            $hint.open('网站地址不能为空');
            return;
        }
        if(ajax_flag){
            return
        }
        ajax_flag=true;
        $.ajax({
            url: '/api/work/website/edit',
            type: 'post',
            data:{
                workSeqNo:workSeqNo,
                websiteName:$('.addWebSite').find('.add-webName').val(),
                url:$('.addWebSite').find('.add-webUrl').val(),
                hasCopy:$('.addWebSite').find('.web-copy').val(),
                editType:'add',
                chapterId:dataId
            },
            success:function (data) {
                if(data.data.resultCode==200){
                    $hint.open('提交成功，请您耐心等待审核');
                    $('.web-module').hide();
                    $('.addWebSite').find('.add-webName').val('');
                    $('.addWebSite').find('.add-webUrl').val('');
                    $('.addWebSite').find('.web-copy').val('other');
                    $('.radio-ul').find('a').each(function (p1,p2) {
                        $(this).removeClass('active');
                        if(p1==2){
                            $(this).addClass('active');
                        }
                    })
                }else{
                    $hint.open(data.data.resultMsg)
                }
                ajax_flag=false;
            }
        });
    })

    //修改網站
    $('.updateWeb-module').find('ul').find('a').click(function () {
        $('.updateWeb-module').find('ul').find('a').each(function () {
            $(this).removeClass('active');
        });
        $(this).addClass('active');
        $('.updateWeb-module').find('.web-copy').val($(this).data('type'))
    });
    function checkCopy(type) {
        $('.updateWeb-module').find('ul').find('a').each(function (p1,p2) {
            $(this).removeClass('active');
            var _this=$(this);
            if(type=='other'&&p1==2){
                _this.addClass('active');
            }
            if(type=='false'&&p1==1){
                _this.addClass('active');
            }
            if(type=='true'&&p1==0){
                _this.addClass('active');
            }
        })
    }
    $('.web-list').find('li').find('i').click(function () {
        if(!isLogin()){
            $('.modle-login').show();
            showLogin();
            return;
        };
       var _name=$(this).prev().html();
       var _web=$(this).prev().attr('href');
       $('.updateWeb-module').find('.add-webName').val(_name);
       $('.updateWeb-module').find('.add-webUrl').val(_web);
       $('.updateWeb-module').find('.old-name').val(_name);
       var dataType=$(this).prev().data('copy');
       if(dataType==true){
           checkCopy('true')
       };
       if(dataType==false){
            checkCopy('false')
       };
       if(dataType=='other' || dataType==''){
            checkCopy('other')
       };
       $('.updateWeb-module').show();

    });
    $('.update-web').click(function () {
        var dataName=$('.add-otherWeb').data('name'),
            dataId=$('.add-otherWeb').data('id');
        if($('.update-webName').val()==''){
            $hint.open('网站名字不能为空');
            return;
        }
        if($('.update-webUrl').val()==''){
            $hint.open('网站地址不能为空');
            return;
        }
        if(ajax_flag){
            return
        }
        ajax_flag=true;
        $.ajax({
            url: '/api/work/website/edit',
            type: 'post',
            data:{
                workSeqNo:workSeqNo,
                websiteName:$('.update-webName').val(),
                url:$('.update-webUrl').val(),
                hasCopy:$('.update-copy').val(),
                oldName:$('.old-name').val(),
                editType:'update',
                chapterId:dataId
            },
            success:function (data) {
                if(data.data.resultCode==200){
                    $hint.open('提交成功，请您耐心等待审核');
                    $('.updateWeb-module').hide();
                    $('.update-webName').val('');
                    $('.update-webUrl').val('');
                    $('.old-name').val('');
                    $('.update-copy').val('other');
                    $('.updateWeb-module').find('ul').find('a').each(function (p1,p2) {
                        $(this).removeClass('active');
                        if(p1==2){
                            $(this).addClass('active');
                        }
                    })
                }else{
                    $hint.open(data.data.resultMsg)
                }
                ajax_flag=false;
            }
        });
    })
    $('.detail-web').click(function () {
        var dataName=$('.add-otherWeb').data('name'),
            dataId=$('.add-otherWeb').data('id');
        if(ajax_flag){
            return
        }
        ajax_flag=true;
        $.ajax({
            url: '/api/work/website/edit',
            type: 'post',
            data:{
                workSeqNo:workSeqNo,
                websiteName:$('.old-name').val(),
                editType:'del',
                chapterId:dataId
            },
            success:function (data) {
                if(data.data.resultCode==200){
                    $hint.open('提交成功，请您耐心等待审核');
                    $('.updateWeb-module').hide();
                    $('.update-webName').val('');
                    $('.update-webUrl').val('');
                    $('.old-name').val('');
                    $('.update-copy').val('other');
                    $('.updateWeb-module').find('ul').find('a').each(function (p1,p2) {
                        $(this).removeClass('active');
                        if(p1==2){
                            $(this).addClass('active');
                        }
                    })
                }else{
                    $hint.open(data.data.resultMsg)
                }
                ajax_flag=false;
            }
        });
    });
    
    //评分
    $('.score-star li').hover(function () {
        if($('.score-star').data('status')){
            return;
        }
        var _index=$(this).data('score')-1;
        $('.score-result').html($(this).data('text'));
        $('.score-star li').each(function (p1,p2) {
            if(p1<=_index){
                $(p2).find('i').css({"color":"#F8C137"})
            }
        })
    },function () {
        console.log($('.score-star').data('status'))
        if($('.score-star').data('status')){
            return;
        }
        $('.score-star li').each(function (p1,p2) {
            $(this).find('i').css({"color":"#CCCCCC"})
        });
        $('.score-result').html('');
    });

    $('.score-star li').click(function () {
        if($('.score-star').data('status')){
            return;
        }
        var _index=$(this).data('score')-1;
        $('.score-star').attr('data-status','true');
        $('.score-result').html($(this).data('text'));
        $('.score-star li').each(function (p1,p2) {
            if(p1<=_index){
                $(p2).find('i').css({"color":"#F8C137"})
            }
        });
        if(ajax_flag){
            return
        }
        ajax_flag=true;
        $.ajax({
            url: '/score/work/add/score',
            type: 'post',
            data:{
                workSeqNo:workSeqNo,
                score:$(this).data('score')
            },
            success:function (data) {
                console.log(data.data)
                if(data.data.resultCode==200){
                    $hint.open('评价成功');
                    $('.score-num-result').html(data.data.result.avgScore);
                    $('.totalScoreMen').html(data.data.result.totalScoreMen);
                    DetailAjax.starNum();
                    $('.score-five').find('.score-num-value').html(data.data.result.fiveStar+'%');
                    $('.score-four').find('.score-num-value').html(data.data.result.fourStar+'%');
                    $('.score-three').find('.score-num-value').html(data.data.result.threeStar+'%');
                    $('.score-two').find('.score-num-value').html(data.data.result.twoStar+'%');
                    $('.score-one').find('.score-num-value').html(data.data.result.oneStar+'%');
                    $('.score-five').find('a span').css({"width":data.data.result.fiveStar+'px'});
                    $('.score-four').find('a span').css({"width":data.data.result.fourStar+'px'});
                    $('.score-three').find('a span').css({"width":data.data.result.threeStar+'px'});
                    $('.score-two').find('a span').css({"width":data.data.result.twoStar+'px'});
                    $('.score-one').find('a span').css({"width":data.data.result.oneStar+'px'});
                }else{
                    $hint.open(data.data.resultMsg);
                    $('.score-star').attr('data-status','false');
                }
                ajax_flag=false;
            }
        });
    });

    //关注
    $('.get-dy').click(function () {
        if(!isLogin()){
            $('.modle-login').show();
            showLogin();
            return;
        };
        $('.dy-module').show()
    })
    $('.get-dyBtn').click(function () {
        if(ajax_flag){
            return
        }
        ajax_flag=true;
        $.ajax({
            url: '/api/work/subscribe',
            type: 'post',
            data:{
                workSeqNo:workSeqNo,
                status:'subscribe'
            },
            success:function (data) {
                if(data.data.resultCode==200){
                    window.location.href="/item/"+$('#workItemID').val()
                }else{
                    $hint.open(data.data.resultMsg)
                }
                ajax_flag=false;
            }
        });
    })
    $('.forget-dy').click(function () {
        if(ajax_flag){
            return
        }
        ajax_flag=true;
        $.ajax({
            url: '/api/work/subscribe',
            type: 'post',
            data:{
                workSeqNo:workSeqNo,
                status:'cancel_subscribe'
            },
            success:function (data) {
                if(data.data.resultCode==200){
                    window.location.href="/item/"+$('#workItemID').val()
                }else{
                    $hint.open(data.data.resultMsg)
                }
                ajax_flag=false;
            }
        });
    })
    $('.open-forgetWrap').click(function () {
        $('.forget-dy-wrap').show();
    })
    $('.cancel-forget').click(function () {
        $('.forget-dy-wrap').hide();
    })
    //增加信息
    $('.add-infoBtn').click(function () {
        if(!isLogin()){
            $('.modle-login').show();
            showLogin();
            return;
        }
        $(".para-addinfo").show();
        $('.addpara-title').find('input').val('');
        var s='每个版权都有他的版权故事，例如创作背景、创作过程，以及版权衍生的各种乐事、趣闻我们诚邀您为版权编录这些故事。'
        addue.setContent('<p style="color: rgb(153, 153, 153); font-size: 12px;">每个版权都有他的版权故事，例如创作背景、创作过程，以及版权衍生的各种乐事、趣闻我们诚邀您为版权编录这些故事。</p>')
    });
    addue.addListener('focus',function(editor){
        if(addue.getContent()=='<p style="color: rgb(153, 153, 153); font-size: 12px;">每个版权都有他的版权故事，例如创作背景、创作过程，以及版权衍生的各种乐事、趣闻我们诚邀您为版权编录这些故事。</p>'){
            addue.setContent('')
        }
    });
    addue.addListener('blur',function(editor){
        console.log(addue.getContent()=="")
        if(addue.getContent()==""){
            addue.setContent('<p style="color: rgb(153, 153, 153); font-size: 12px;">每个版权都有他的版权故事，例如创作背景、创作过程，以及版权衍生的各种乐事、趣闻我们诚邀您为版权编录这些故事。</p>')
        }
    });

    $('.cancelInfoBtn').click(function () {
        $(".para-addinfo").hide();
        $('.add-infoBtn').show();
    })
    $('.addinfoBtn').click(function () {
        var dataName=$('.addpara-title').find('input').val();
        if(dataName.length>64){
            $hint.open('新增章节标题字数不能超过64个');
            return;
        }
        if(addue.getContentLength()>60000){
            $hint.open('新增章节编辑内容字数超出最大允许值');
            return;
        }

        var dataId='';
        var content=addue.getContent();
        if(content=='<p style="color: rgb(153, 153, 153); font-size: 12px;">每个版权都有他的版权故事，例如创作背景、创作过程，以及版权衍生的各种乐事、趣闻我们诚邀您为版权编录这些故事。</p>'){
            $hint.open('修改内容不能为空');
            return;
        };
        if(isNull(content)){
            $hint.open('修改内容不能为空');
        }else {
            ajax(content, dataName, dataId, function () {
                $hint.open('修改已经提交，请等待审核');
                $(".para-addinfo").hide();
                var t='<div class="para-item">'+
                           '<div class="para-title">'+
                                '<h2>'+dataName+'</h2>' +
                           '</div>'+
                           '<div class="para para-other <%=x.code%>">'+content+'</div>'+
                      '</div>';
                $('.para-otherExp').append(t);
            })
        }
    });
});
function measureTitle(data) {
    console.log('-------------------'+data)
    if(data=='小说' || data=='动漫'){
        return '阅读总量'
    }else{
        return '播放总量'
    }
}
function unitConversion(num) {
    if(num>100000000){
        return  (num/100000000).toFixed(2)+'亿';
    }else if(num>10000){
        return  (num/10000).toFixed(2)+'万';
    }else{
        return  num;
    }
}
//修改标签
var nowTips=null;
function updateTips(e) {
    nowTips=$(e);
    if($(e).hasClass('active')){
        $('.modle-tips').find('.detail-tips').hide();
    }else{
        $('.modle-tips').find('.detail-tips').show()
    }
    $('.update-tips').val($(e).html());
    $('.tips-module').show()
}
//增加标签
function addTips(e) {
    if($(e).val()!=''){
        var t='<a onclick="updateTips(this)">'+$(e).val()+'</a>';
        $(e).remove();
        $('.tips-div').append(t);
    }else{
        $(e).remove();
    }
}
//验证非空
function isNull( str ){
    if ( str == "" ) return true;
    var regu = "^[ ]+$";
    var re = new RegExp(regu);
    return re.test(str);
}
function isURL(str){
    return !!str.match(/(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/g);
}
function delCoverImg(e,file) {
    uploader.removeFile( file,true );
    $(e).parent().remove()
}

function ajax(content,dataName,dataId,callback) {
    if(ajax_flag){
        return
    }
    ajax_flag=true;
    $.ajax({
        url: '/api/work/chapter/edit',
        type: 'post',
        data:{
            workSeqNo:workSeqNo,
            content:content,
            name:dataName,
            chapterId:dataId
        },
        success:function (data) {
            if(data.status){
                if(data.data.resultCode==200){
                    callback();
                }else{
                    $hint.open(data.data.resultMsg);
                }
                ajax_flag =false;
            }else{
                $hint.open(data.resultMsg);
                ajax_flag =false;
            }
        }
    });
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


//封面詳情
$('#recommended-works').find('a').click(function () {
    $('.modle-coverImg').find('.big_coverImg').attr('src',$(this).data('src'));
    $('.modle-coverImg').show();
});
$('.del_coverImg').click(function () {
    if(ajax_flag){
        return
    }
    ajax_flag=true;
    $.ajax({
        url: '/api/work/del/cover',
        type: 'post',
        data:{
            workSeqNo:workSeqNo,
            chapterId:$('#filePicker').data('id'),
            url:$('.big_coverImg').attr('src')
        },
        success:function (data) {
            if(data.status){
                if(data.data.resultCode==200){
                    $('.modle-coverImg').find('.big_coverImg').attr('src','');
                    $('.modle-coverImg').hide();
                    $hint.open(data.data.resultMsg+'请等待审核');
                }else{
                    $hint.open(data.data.resultMsg);
                }
                ajax_flag =false;
            }else{
                $hint.open(data.resultMsg);
                ajax_flag =false;
            }
        }
    });
})