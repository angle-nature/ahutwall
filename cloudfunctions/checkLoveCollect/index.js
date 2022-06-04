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

    //检查是否传入必要参数
    if (event.type == undefined) {
        var result = {}
        result.errCode = 2
        result.errMsg = "未传必要参数,请重试"
        var data = {}
        result.data = data
        return result
    }
    const db = cloud.database()
    const _ = db.command
    const $ = db.command.aggregate
    return await db.collection('vindicate_opinion-collect').aggregate()
        .lookup({
            from: 'vindicate_opnionMessage',
            localField: 'message_id',
            foreignField: '_id',
            as: 'detail',
        }).match({
            user_id: wxContext.OPENID,
            type: event.type
        }).sort({
            collect_time: -1 //从大到小
        })
        .end()
        .then(res => {
            if (res.list.length == 0) {
                var result = {}
                result.errCode = 3;
                result.errMsg = "该用户暂没有收藏哦~"

                var data = {}
                result.data = data

                return result
            } else {
                var collects = res.list
                var result = {}
                result.errCode = 0;
                result.errMsg = "查询用户收藏成功"
                var data = {}
                data.collects = collects
                result.data = data
                return result
            }
        })
        .catch(err => console.error(err))
}