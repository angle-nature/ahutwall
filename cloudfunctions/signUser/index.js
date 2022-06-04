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
    if (event.avatarUrl == undefined) {
        var result = {}
        result.errCode = 2
        result.errMsg = "未传必要参数,请重试"
        var data = {}
        result.data = data
        return result
    } else if (event.gender == undefined) {
        var result = {}
        result.errCode = 2
        result.errMsg = "未传必要参数,请重试"
        var data = {}
        result.data = data
        return result
    } else if (event.nickName == undefined) {
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
    }
    //构造要添加的数据
    to_add_data = {
        //头像
        avatarUrl: event.avatarUrl,
        //性别
        gender: event.gender,
        //昵称
        nickName: event.nickName,
        //生日
        birthday: new Date(event.birthday),
        //地址
        address: "",
        //经验值
        experienceValue: 100,
        //个人简介
        introduction: "",
        //创建者的openid
        openid: wxContext.OPENID,
        //注册时间
        signTime: new Date(),
        //被点赞数
        liked_number:0,
        //被评论数
        commented_number:0
    }
    var add_result = {}
    const db = cloud.database()
    await db.collection('user')
        .add({
            data: to_add_data
        }).then(res => {
            console.log("创建用户成功")
            console.log(res)
            add_result = res._id
        })

    //查询用户最新信息
    await db.collection('user')
        .where({
            openid: wxContext.OPENID
        }).field({
            nickName: true,
            avatarUrl: true,
            gender: true,
            signTime: true,
            birthday: true,
            introduction: true,
            address: true,
            experienceValue: true,
            liked_number:true,
            commented_number:true,
        }).get().then(res => {
            console.log("获取用户最新信息成功")
            console.log(res.data)
            user = res.data[0]
        })
    //返回前端
    var result = {}
    result.errCode = 0;
    result.errMsg = "新增用户成功"
    var data = {}
    data.user = user
    result.data = data
    return result

}