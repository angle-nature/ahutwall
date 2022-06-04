// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
    //获取当前用户的openid
    const wxContext = cloud.getWXContext()

    //检测是否获取到用户的openid
    if (!wxContext.OPENID == undefined) {
        //没有获取-->返回执行结果
        var result = {}
        result.errCode = 1;
        result.errMsg = "未能正确获取到用户的openid,请退出小程序重试"

        var data = {}
        result.data = data

        return result
    }
    const db = cloud.database()

    var user_id;
    if (event.user_id != null) {
        user_id = event.user_id;
    } else {
        user_id = wxContext.OPENID;
    }

    //每次至多查询多少个反馈记录,至多为100、
    const MAX_LIMIT = 100
    //联合表总共有多少条记录
    var countResult = await db.collection('vindicate_opnionMessage').count()
    var total = countResult.total
    //计算出一共可以分多少页
    var pageCount = Math.ceil(total / MAX_LIMIT)

    var message = [];
    for (let i = 0; i < pageCount; i++) {
        if (user_id == wxContext.OPENID) {
            await db.collection('vindicate_opnionMessage')
                .orderBy('publish_time', 'desc')
                .skip(i * MAX_LIMIT)
                .limit(MAX_LIMIT)
                .where({
                    user_id: user_id,
                })
                .get().then(res => {
                    message = message.concat(res.data)
                })
        } else {
            await db.collection('vindicate_opnionMessage')
                .orderBy('publish_time', 'desc')
                .skip(i * MAX_LIMIT)
                .limit(MAX_LIMIT)
                .where({
                    user_id: user_id,
                    anonymityStatus: false
                })
                .get().then(res => {
                    message = message.concat(res.data)
                })
        }
    }

    //二手交易表总共有多少条记录
    countResult = await db.collection('secondhandMessage').count()
    total = countResult.total
    //计算出一共可以分多少页
    var tempCount = pageCount
    pageCount = Math.ceil(total / MAX_LIMIT)

    for (let i = 0; i < pageCount; i++) {
        await db.collection('secondhandMessage')
            .orderBy('publish_time', 'desc')
            .skip(i * MAX_LIMIT)
            .limit(MAX_LIMIT)
            .where({
                user_id: user_id
            })
            .get().then(res => {
                message = message.concat(res.data)
            })
    }

    //失物招领表总共有多少条记录
    countResult = await db.collection('lostfindMessage').count()
    total = countResult.total
    //计算出一共可以分多少页
    tempCount += pageCount
    pageCount = Math.ceil(total / MAX_LIMIT)

    for (let i = 0; i < pageCount; i++) {
        await db.collection('lostfindMessage')
            .orderBy('publish_time', 'desc')
            .skip(i * MAX_LIMIT)
            .limit(MAX_LIMIT)
            .where({
                user_id: user_id
            })
            .get().then(res => {
                message = message.concat(res.data)
            })
    }

    message.sort(function(message1,message2){
        return message2.publish_time - message1.publish_time;
    })

    if (message.length == 0) {
        var result = {}
        result.errCode = 3;
        result.errMsg = "该用户暂没有发表日常哦~"

        var data = {}
        data.message = message
        result.data = data

        return result
    } else {
        var result = {}
        result.errCode = 0;
        result.errMsg = "获取所有日常成功"

        var data = {}
        data.message = message
        result.data = data
        return result
    }
}

// function formulate(list) {
//     for (let i = 0; i < list.length; i++) {
//         var date = new Date(list[i].publish_time)
//         //格式化时间为 2022-02-15 23:45
//         var mon = date.getMonth() + 1;
//         mon = mon < 10 ? "0" + mon : mon;
//         var d = date.getDay();
//         d = d < 10 ? "0" + d : d;
//         var h = date.getHours() + 8;
//         if (h > 23) {
//             h -= 24
//         }
//         h = h < 10 ? "0" + h : h;
//         var m = date.getMinutes();
//         m = m < 10 ? "0" + m : m;
//         var s = date.getSeconds();
//         s = s < 10 ? "0" + s : s;
//         list[i].publish_time = date.getFullYear() + "-" + mon + "-" + d + " " + h + ":" + m + ":" + s
//     }
// }