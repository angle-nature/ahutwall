// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()

// 获取数据库的引用
const db = cloud.database();
var commentsTable = db.collection('comments')
// 云函数入口函数
exports.main = async (event, context) => {
    openid = cloud.getWXContext().OPENID;
    // module 决定对哪一个 墙 进行操作
    switch (event.module) {
        case 'without_reply_limit': {
            return without_reply_limit(event)
        }
        case 'with_reply': {
            return with_reply(event)
        }
        default: {
            return '模块不存在'
        }
    }
}

async function without_reply_limit(event) {
    return await commentsTable.aggregate().match({
        message_id: event.message_id
    }).sort({
        comment_time: 1
    }).end()
}

async function with_reply(event) {
    console.log(event)
    return await commentsTable.aggregate().lookup({ // 根据userid 联合查询 用户信息
        from: 'reply',
        localField: '_id',
        foreignField: 'comment_id',
        as: 'replys',
    }).match({
        message_id: event.message_id
    }).sort({
        comment_time: 1
    }).end()
}