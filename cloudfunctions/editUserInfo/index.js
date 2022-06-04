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
    if (event.gender == undefined) {
        var result = {}
        result.errCode = 2
        result.errMsg = "未传必要参数,请重试"
        var data = {}
        result.data = data
        return result
    } else if (event.birthday == undefined) {
        var result = {}
        result.errCode = 2
        result.errMsg = "未传必要参数,请重试"
        var data = {}
        result.data = data
        return result
    } else if (event.address == undefined) {
        var result = {}
        result.errCode = 2
        result.errMsg = "未传必要参数,请重试"
        var data = {}
        result.data = data
        return result
    } else if (event.introduction == undefined) {
        var result = {}
        result.errCode = 2
        result.errMsg = "未传必要参数,请重试"
        var data = {}
        result.data = data
        return result
    }
    //根据用户openid修改数据
    const db = cloud.database()
    await db.collection('user')
        .where({
            openid: wxContext.OPENID
        })
        .update({
            data: {
                //生日
                birthday: new Date(event.birthday),
                //性别
                gender: event.gender,
                //地区
                address: event.address,
                //个人简介
                introduction : event.introduction,
            }
        }).then(res => {
            console.log("更新用户信息成功")
            console.log(res)
            console.log(res.stats.updated)
        })
    //返回前端
    var result = {}
    result.errCode = 0;
    result.errMsg = "更新用户信息成功"
    return result
}