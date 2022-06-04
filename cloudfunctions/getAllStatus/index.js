// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
// 获取数据库的引用
const db = cloud.database();
const _ = db.command;

// 云函数入口函数
exports.main = async (event, context) => {
    var openId = cloud.getWXContext().OPENID;
    // 查询官网通知的最新一条
    let noticeLatest = await db.collection("official_notice").where({
        all: null
    }).orderBy('publish_time', 'desc').limit(1).get().then(res => {
        return res.data[0];
    })

    let likeList = await db.collection("vindicate_opinion-like").where({
        message_user_id: openId,
        isLooked: false,
        user_id: _.neq(openId)
    }).get().then(res => {
        return res.data;
    })

    let commentList = await db.collection("comments").where({
        message_user_id: openId,
        isLooked: false,
        user_id: _.neq(openId)
    }).get().then(res => {
        return res.data;
    })

    let replyList = await db.collection("reply").where({
        to_uid: openId,
        comment_user_isLooked: false,
        from_uid: _.neq(openId)
    }).get().then(res => {
        return res.data;
    })

    // 只有是管理员时才会查询举报集合
    let reportList = [];
    if (event.admin) {
        reportList = await db.collection("report").where({
            isLooked: false,
        }).get().then(res => {
            return res.data;
        })
    }

    return {
        noticeLatest: noticeLatest,
        likeList: likeList,
        commentList: commentList,
        replyList: replyList,
        reportList: reportList
    }
}