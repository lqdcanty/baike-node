// 基于准备好的dom，初始化echarts实例
var myChart = echarts.init(document.getElementById('chart'));

// 指定图表的配置项和数据
var option = {
    title: {
        /*text: 'ECharts 入门示例'*/
    },
    grid: {
        width: '70%', height: '75%',top:"5%",left:"15%"
    },
    tooltip: {},
    legend: {

        data: ["优酷","爱奇艺","乐视视频","搜狐视频","腾讯视频"]
    },

    xAxis: [{
        type : 'category',
        show:true,
        data: ["优酷","爱奇艺","乐视视频","搜狐视频","腾讯视频"],
        axisLabel: {
            interval: 0,
            rotate: 45,
            margin: 2
        }
    }],
    yAxis: {
        logBase:10
    },
    series: [{
        name: '评论数',
        type: 'bar',
        barWidth: '45%',
        data: [21800,18750,21509,30150,41390],
        itemStyle: {
            normal: {
                color: function(params) {
                    // build a color map as your need.
                    var colorList = [
                        '#687FFF', '#5BB5F4', '#60CFBB', '#F27C7C','#F5A623'];
                    return colorList[params.dataIndex]
                }
            }
        }
    }]
};

// 使用刚指定的配置项和数据显示图表。
myChart.setOption(option);