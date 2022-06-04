// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
    // 根据用户提交的cloudid 获取对应的运动数据
    let weRunData = event.weRunData
    //处理运动数据
    var stepInfoList = weRunData.data.stepInfoList;
    //处理图表数据
    var graphics = stepInfoList;
    //设置toLocaleString中options参数
    var options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    };
    //计算最大步数和平均步数
    var sum = 0;
    var maxStep = 0;
    for (var i = 0; i < stepInfoList.length; i++) {
        var times = stepInfoList[i].timestamp
        var date = new Date(parseInt(times) * 1000)
        //格式化日期数据
        var year = date.getFullYear()
        var month = date.getMonth() + 1
        month = month < 10 ? '0' + month : month
        var day = date.getDate()
        day = day < 10 ? '0' + day : day
        var week = date.getDay()
        switch (week) {
            case 1:
                week = "周一";
                break;
            case 2:
                week = "周二";
                break;
            case 3:
                week = "周三";
                break;
            case 4:
                week = "周四";
                break;
            case 5:
                week = "周五";
                break;
            case 6:
                week = "周六";
                break;
            case 0:
                week = "周日";
                break;
        }
        date = year + '/' + month + '/' + day + ' ' + week
        stepInfoList[i].timestamp = date;

        var datestr = year + '-' + month + '-' + day
        graphics[i].timestamp = datestr

        sum += stepInfoList[i].step
        maxStep = Math.max(maxStep, stepInfoList[i].step)
    }
    var avgStep = parseInt(sum / stepInfoList.length)
    var result = {}
    result.errCode = 0;
    result.errMsg = "获取近一个月运动步数成功"

    var data = {}
    data.stepInfoList = stepInfoList
    data.graphics = graphics.reverse()
    data.avgStep = avgStep
    data.maxStep = maxStep
    result.data = data
    return result
}