// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
    var openId = cloud.getWXContext().OPENID;
    var userId = event.userId;
    return await db.collection("message")
        .where(_.or([{
            _openid: openId,
            userId: userId,
        }, {
            _openid: userId,
            userId: openId,
        }]))
        .update({
            data: {
                Message: _.pull({
                    content: _.eq(event.content)
                })
            },
        })
}