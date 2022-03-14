// pages/mine/mine.js
const app = getApp()
// 1、引入脚本
// import * as echarts from '../../components/ec-canvas/ec-canvas';

// function initChart(canvas, width, height, dpr) {
//     const chart = echarts.init(canvas, null, {
//         width: width,
//         height: height,
//         devicePixelRatio: dpr // 解决小程序视图模糊的问题
//     });
//     canvas.setChart(chart);

//     var option = {
//         title: {
//             text: '', // 主标题文本，支持使用 \n 换行
//             top: 0, // 定位 值: 'top', 'middle', 'bottom' 也可以是具体的值或者百分比
//             left: 'center', // 值: 'left', 'center', 'right' 同上
//             textStyle: { // 文本样式
//                 fontSize: 16,
//                 fontWeight: 600,
//                 color: '#000'
//             }
//         },
//         // 设置图表的位置
//         grid: {
//             x: 5, // 左间距
//             y: 40, // 上间距
//             x2: 8, // 右间距
//             y2: 10, // 下间距
//             containLabel: true // grid 区域是否包含坐标轴的刻度标签, 常用于『防止标签溢出』的场景
//         },
//         // dataZoom 组件 用于区域缩放
//         dataZoom: [{
//             type: 'inside',
//             xAxisIndex: [0], // 设置 dataZoom-inside 组件控制的 x 轴
//             // 数据窗口范围的起始和结束百分比  范围: 0 ~ 100
//             start: 0,
//             end: 30
//         }],
//         tooltip: {
//             trigger: 'axis', // 触发类型, axis: 坐标轴触发
//             axisPointer: {
//                 type: 'none' // 指示器类型，可选 'line'、'shadow'、'none'、'cross'
//             },
//             // 提示框浮层内容格式器，支持字符串模板和回调函数两种形式
//             // 折线（区域）图、柱状（条形）图、K线图 : {a}（系列名称），{b}（类目值），{c}（数值）, {d}（无）
//             formatter: '{b}\n{a0}: {c0}万\n{a1}: {c1}%'
//         },
//         xAxis: {
//             // 坐标轴轴线
//             axisLine: {
//                 lineStyle: {
//                     type: 'solid', // 坐标轴线线的类型 'solid', 'dashed', 'dotted'
//                     width: 1, // 坐标轴线线宽, 不设置默认值为 1
//                     color: '#000' // 坐标轴线线的颜色
//                 }
//             },
//             // 坐标轴刻度
//             axisTick: {
//                 show: false
//             },
//             // 分隔线
//             splitLine: {
//                 show: false
//             },
//             // 坐标轴刻度标签
//             axisLabel: {
//                 fontSize: 12, // 文字的字体大小
//                 color: '#000', // 刻度标签文字的颜色
//                 // 使用函数模板   传入的数据值 -> value: number|Array,
//                 formatter: '{value}'
//             },
//             data: ['上官婉儿', '王昭君', '老夫子', '狄仁杰', '墨子', '盘古', '猪八戒', '伽罗', '李信', '云中君', '瑶', '米莱迪']
//         },
//         yAxis: [{
//                 type: 'value', // 坐标轴类型,   'value' 数值轴，适用于连续数据
//                 name: '单位/bu', // 坐标轴名称
//                 nameLocation: 'end', // 坐标轴名称显示位置 'start', 'middle' 或者 'center', 'end'
//                 nameTextStyle: { // 坐标轴名称的文字样式
//                     align: 'center', // 文字水平对齐方式，默认自动,可选 'left'、'center'、'right'
//                     fontSize: 12, // 坐标轴名称文字的字体大小
//                     fontStyle: 'normal', // 坐标轴名称文字字体的风格, 可选 'normal'、'italic'、'oblique'
//                     // 坐标轴名称文字字体的粗细, 可选 'normal'、'bold'、'bolder'、'lighter'、100 | 200 | 300 | 400...
//                     fontWeight: 'normal'
//                 },
//                 nameGap: 15, // 坐标轴名称与轴线之间的距离
//                 // 坐标轴刻度
//                 axisTick: {
//                     show: true // 是否显示坐标轴刻度 默认显示
//                 },
//                 // 坐标轴轴线
//                 axisLine: { // 是否显示坐标轴轴线 默认显示
//                     show: true, // 是否显示坐标轴轴线 默认显示
//                     lineStyle: { // 坐标轴线线的颜色
//                         color: '#000'
//                     }
//                 },
//                 // 坐标轴在图表区域中的分隔线
//                 splitLine: {
//                     show: false // 是否显示分隔线。默认数值轴显示
//                 },
//                 // 坐标轴刻度标签
//                 axisLabel: {
//                     show: true, // 是否显示刻度标签 默认显示
//                     fontSize: 13, // 文字的字体大小
//                     color: '#000', // 刻度标签文字的颜色
//                     // 使用字符串模板，模板变量为刻度默认标签 {value}
//                     formatter: '{value}'
//                 }
//             },
//             // 右侧Y轴
//             {
//                 // 坐标轴刻度
//                 axisTick: {
//                     show: true // 是否显示坐标轴刻度 默认显示
//                 },
//                 // 坐标轴轴线
//                 axisLine: { // 是否显示坐标轴轴线 默认显示
//                     show: true, // 是否显示坐标轴轴线 默认显示
//                     lineStyle: { // 坐标轴线线的颜色
//                         color: '#000'
//                     }
//                 },
//                 // 坐标轴在图表区域中的分隔线
//                 splitLine: {
//                     show: false // 是否显示分隔线 默认数值轴显示
//                 },
//                 axisLabel: {
//                     show: true,
//                     fontSize: 13,
//                     color: '#000',
//                     // 使用字符串模板，模板变量为刻度默认标签 {value}
//                     formatter: '{value}%'
//                 }
//             }
//         ],
//         // 系列列表
//         series: [{
//                 type: 'bar', // 系列类型
//                 name: '场次', // 系列名称, 用于tooltip的显示, legend 的图例筛选
//                 barMaxWidth: 12, // 柱条的最大宽度，不设时自适应
//                 barGap: 0, // 不同系列的柱间距离, 为百分比  默认值为30%
//                 // 图形上的文本标签
//                 label: {
//                     show: false,
//                     fontSize: 13,
//                     color: '#fff'
//                 },
//                 // 图形样式
//                 itemStyle: {
//                     // 柱条的颜色, 这里是渐变色, 默认从全局调色盘 option.color 获取颜色
//                     color: {
//                         type: 'linear',
//                         x: 0,
//                         y: 0,
//                         x2: 0,
//                         y2: 1,
//                         colorStops: [{
//                             offset: 0,
//                             color: '#FAB363' // 0% 处的颜色
//                         }, {
//                             offset: 1,
//                             color: '#FB7C2B' // 100% 处的颜色
//                         }]
//                     },
//                     barBorderRadius: [10, 10, 0, 0] // 圆角半径, 单位px, 支持传入数组分别指定 4 个圆角半径
//                 },
//                 // 系列中的数据内容数组
//                 data: [200, 330, 400, 600, 830, 650, 690, 430, 550, 420, 420, 320]
//             },
//             {
//                 type: 'line', // 系列类型
//                 name: '胜率', // 系列名称, 用于tooltip的显示, legend 的图例筛选
//                 symbol: 'circle', // 标记的图形
//                 symbolSize: 11, // 标记的大小
//                 yAxisIndex: 1, // 使用的 y 轴的 index，在单个图表实例中存在多个 y 轴的时候有用
//                 // 图形的样式
//                 itemStyle: {
//                     color: '#11abff'
//                 },
//                 // 线的样式, 修改 lineStyle 中的颜色不会影响图例颜色, 一般不设置线的样式
//                 lineStyle: {
//                     type: 'solid', // 线的类型 'solid', 'dashed', 'dotted'
//                     color: '#11abff'
//                 },
//                 // 图形上的文本标签
//                 label: {
//                     show: false,
//                     fontSize: 13,
//                     color: '#fff'
//                 },
//                 // 系列中的数据内容数组
//                 data: [20, 24, 33, 45, 63, 50, 42, 24, 23, 14, 20, 10]
//             }
//         ]
//     };
//     chart.setOption(option);
//     return chart;
// }
Page({
    /**
     * 页面的初始数据
     */
    data: {
        user: {
            avatarUrl: "/images/avatar1.jpg",
            nickName: "小花",
            gender: 1, //0为男性,1为女性
            level: 1,//根据经验值计算得出
            birthday:"2021-02-03",
            address:"北京 大兴区",
            constellation: "双鱼座",//星座-->根据生日月份计算得出
            date: 1,//已加入天数-->根据注册时间计算得出
            introduction: "我是一个粉刷匠，粉刷本领强。我要把那新房子，刷的更漂亮!!",
            loveNum: 16,
            remarkNum: 16,
            experienceValue:666,
        },
        isDaily: true,
        isStep: false,
        isCollect: false,
        isPoster: false,

        //三个选项点击后的style
        clickStyle: "font-size: 30rpx;border-bottom:10rpx  solid  #86BC9C;",
        //未点击的style
        unClickStyle: "font-size: 27rpx;border-bottom:none;",

        //赞/收藏  标题点击样式
        clickTitleStyle:"background-color:#84727C;",
        //未点击的style
        unClickTitleStyle:"background-color:transparent",
        //点击标题之后显示的内容

        //四种墙类别
        type:['表白墙','二手交易墙','失物招领墙','食堂意见墙'],
        //是否有我的日常
        hasDaily:true,
        //我的日常列表
        dailyList:[{
            creatMessage:"人之应当忘记自己而爱别人，这样才能安静、幸福和高尚",
            creatPic:"/images/avatar1.jpg",
            creatTime:"2022-02-13",
            type:0
        },{
            creatMessage:"出洗衣液，20r一盒，共两盒（可单买），在大润发买的，可小刀",
            creatPic:"/images/avatar1.jpg",
            creatTime:"2022-02-13",
            type:1
        },{
            creatMessage:"中午回寝室丢的，这对我来说真的特别重要，希望捡到的同学联系我，定有重谢",
            creatPic:"/images/avatar1.jpg",
            creatTime:"2022-02-13",
            type:2
        },{
            creatMessage:"九食堂二楼的菜，墙裂推荐！！！",
            creatPic:"/images/avatar1.jpg",
            creatTime:"2022-02-13",
            type:3
        }],
        //步数是否授权
        isAuthorizeWeRun: false,
        //过去一个月步数
        stepInfoList: [],
        //最新步数、平均步数、最大步数
        newStep: '',
        avgStep: '',
        maxStep: '',

        //是否有我的收藏
        hasCollect:false,

        // ec: {
        //     onInit: initChart // 初始化并设置
        // }
    },

    clickDaily: function () {
        this.setData({
            isDaily: true,
            isStep: false,
            isCollect: false,
            isPoster: false,
        })
    },
    clickStep: function () {
        this.setData({
            isDaily: false,
            isStep: true,
            isCollect: false,
            isPoster: false,
        })
    },
    clickCollect: function () {
        this.setData({
            isDaily: false,
            isStep: false,
            isCollect: true,
            isPoster: false,
        })
    },
    cilckPoster: function () {
        this.setData({
            isDaily: false,
            isStep: false,
            isCollect: false,
            isPoster: true,
        })
    },

    clickLevel:function(){
        var that=this
        wx.navigateTo({
            url: '/pages/level/level',
            success: function (res) {
                res.eventChannel.emit('acceptDataFromOpenedPage', {
                    user: that.data.user
                })
            }
        })
    },
    setUserInfo:function(){
        var that=this
        wx.navigateTo({
            url: '/pages/set/set',
            success: function (res) {
                res.eventChannel.emit('acceptDataFromOpenedPage', {
                    user: that.data.user
                })
            }
        })
    },
    /**
     * 检查授权
     */
    checkWerunAuthorize: function () {
        let that = this;
        console.log(that.data.isAuthorizeWeRun)
        wx.getSetting({
            success(res) {

                if (!res.authSetting['scope.werun']) {
                    wx.authorize({
                        scope: 'scope.werun',
                        success() {
                            // 用户已经同意小程序使用功能
                            that.setData({
                                isAuthorizeWeRun: true,
                            });
                            app.globalData.isAuthorizeWeRun = true
                            that.getWeRunData();
                        },
                        fail: res => {

                            console.log(res);
                            console.log("当初用户拒绝，再次发起授权")
                            wx.showModal({
                                title: '提示',
                                content: '需要您授权获取您的微信步数',
                                showCancel: false,
                                success: modalSuccess => {
                                    wx.openSetting({
                                        success(settingdata) {

                                            if (settingdata.authSetting['scope.werun']) {
                                                wx.showModal({
                                                    title: '提示',
                                                    content: '获取权限成功,再次点击获取',
                                                    showCancel: false,
                                                })
                                            } else {
                                                wx.showModal({
                                                    title: '提示',
                                                    content: '获取权限失败，将无法获取您的微信步数',
                                                    showCancel: false,
                                                })
                                            }
                                        },
                                        fail(failData) {
                                            console.log("failData", failData)
                                        },
                                        complete(finishData) {
                                            console.log("finishData", finishData)
                                        }
                                    })
                                }
                            })
                        }
                    })
                } else {
                    that.setData({
                        isAuthorizeWeRun: true,
                    })
                    app.globalData.isAuthorizeWeRun = true
                    that.getWeRunData(); //已经获得权限可以,进行相关操作
                }

            }
        });
    },

    /**
     * 获取微信运动数据
     */

    getWeRunData() {
        var that = this
        wx.getWeRunData({
            success(res) {
                console.log(res)
                wx.cloud.callFunction({
                    name: 'desrundata',
                    data: {
                        weRunData: wx.cloud.CloudID(res.cloudID) //直到云函数被替换
                    }
                }).then(res => {
                    console.log(res)
                    that.setData({
                        stepInfoList: res.result.data.stepInfoList,
                        maxStep: res.result.data.maxStep,
                        avgStep: res.result.data.avgStep,
                        newStep: res.result.data.stepInfoList[0].step
                    })
                })
            }
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this
        if (app.globalData.isAuthorizeWeRun) {
            that.getWeRunData()
        }
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})