// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
    var openId = cloud.getWXContext().OPENID;
    return await db.collection("official_notice").add({
        data: {
            notice_title: event.noticeTitle,
            notice_content: event.noticeContent,
            user_id: openId,
            publish_time: db.serverDate()
        }
    })
}