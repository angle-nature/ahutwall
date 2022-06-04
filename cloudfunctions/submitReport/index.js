// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
    var openId = cloud.getWXContext().OPENID;
    return await db.collection("report").add({
        data: {
            report_message_id: event.message_id,
            report_wall_type: event.wallType,
            report_type: event.reportType,
            report_content: event.reportContent,
            user_id: openId,
            isLooked: false,
            isDispose: 0,
            publish_time: db.serverDate()
        }
    })
}