var myBread = echarts.init(document.getElementById('bread'));
var option1 = {
    title : {
        /*text: '2017.03.05',*/
        /*subtext: '2017.03.05',*/
        x:'center',
        y:'62%',
        textStyle:{
            color:'#333',
            fontsize:10,
            fontWeight:'normal'
        }
    },
    tooltip : {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    grid: {
        width: '90%', height: '20%'
    },
    series : [
        {
            name: '评论数',
            type: 'pie',
            radius : '94%',
            center: ['46%', '50%'],
            data:[
                {value:21800, name:'优酷',xAxis: '周三'},
                {value:18750, name:'爱奇艺'},
                {value:21509, name:'乐视视频'},
                {value:30150, name:'搜狐视频'},
                {value:41390, name:'腾讯视频'}
            ],
            labelLine: {
                normal: {
                    show: false
                }
            },
            label: {
                normal: {
                    show: false
                }
            },
            itemStyle: {
                emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                },
                normal: {
                    color: function(params) {
                        // build a color map as your need.
                        var colorList = [
                            '#687FFF', '#5BB5F4', '#60CFBB', '#F27C7C','#F5A623'];
                        return colorList[params.dataIndex]
                    }
                }
            }
        }
    ]
};
myBread.setOption(option1);