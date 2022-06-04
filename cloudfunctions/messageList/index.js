// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
    var openId = cloud.getWXContext().OPENID;
    // 查询这两个用户是否已经建立过聊天--正查询
    let messageList = await db.collection("message")
        .where(_.or([{
            _openid: openId,
            userId: event.userId,
        }, {
            _openid: event.userId,
            userId: openId,
        }]))
        .get()
        .then(res => {
            console.log(res);
            return res
        })

    // 判断是否有过聊天 有就返回两个用户的聊天信息 即message数组
    if (messageList.data.length != 0) {
        return messageList.data[0].Message;
    } else { //创建新的聊天
        await db.collection("message").add({
            data: {
                Message: [],
                _openid: openId,
                userId: event.userId
            }
        })
        return []; //返回一个空数组 代表没有消息
    }
}