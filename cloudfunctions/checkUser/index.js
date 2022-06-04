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

    var user_id;
    if(event.user_id != null){
        user_id = event.user_id;
    }else{
        user_id = wxContext.OPENID;
    }

    //根据用户openid获取数据
    var user;
    const db = cloud.database()
    await db.collection('user')
        .where({
            openid: user_id
        }).get().then(res => {
            console.log('获取用户信息操作成功')
            user = res.data[0] //查询结果不管几条,返回的都是数组
        })
    //如果没有获取到,则返回告诉前端没有此用户
    if (user == undefined) {
        var result = {}
        result.errCode = 2;
        result.errMsg = "该用户尚未注册"
        var data = {}
        result.data = data
        return result
    }

    //返回前端
    var result = {}
    result.errCode = 0;
    result.errMsg = "查询用户信息成功"
    var data = {}
    data.user = user
    result.data = data
    return result
}