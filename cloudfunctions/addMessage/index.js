// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: "cloud1-1gizdb5cdcea91b2"
})
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
    var openId = cloud.getWXContext().OPENID;
    var userId = event.userId;
    // let currentTime = new Date().getTime();
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
                Message: _.push({
                    openId: openId,
                    createTime: db.serverDate(),
                    userId: userId,
                    content: event.content,
                    type: event.type
                })
            }
        })
}