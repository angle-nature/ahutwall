// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
// 获取数据库的引用
const db = cloud.database();
var openid = "";
const _ = db.command
const $ = db.command.aggregate
// 云函数入口函数
exports.main = async (event, context) => {
    openid = cloud.getWXContext().OPENID;
    switch (event.module) {
        case 'likeLooked': {
            return updateLikeLooked(event)
        }
        case 'commentLooked': {
            return updateCommentLooked(event)
        }
        case 'replyLooked': {
            return updateReplyLooked(event)
        }
        case 'reportLooked': {
            return updateReportLooked(event)
        }
        case 'reportDispose': {
            return updateReportDispose(event)
        }
        default: {
            return '模块不存在'
        }
    }
}

async function updateLikeLooked(event) {
    return await db.collection('vindicate_opinion-like').where({
        message_user_id: openid
    }).update({
        data: {
            isLooked: true
        }
    })
}

async function updateCommentLooked(event) {
    return await db.collection('comments').where({
        message_user_id: openid
    }).update({
        data: {
            isLooked: true
        }
    })
}

async function updateReplyLooked(event) {
    return await db.collection('reply').where({
        to_uid: openid
    }).update({
        data: {
            comment_user_isLooked: true
        }
    })
}

async function updateReportLooked(event) {
    return await db.collection('report').where({
        all: null
    }).update({
        data: {
            isLooked: true
        }
    })
}

async function updateReportDispose(event) {
    return await db.collection('report').where({
        report_message_id: event.messageId
    }).update({
        data: {
            isDispose: event.isDispose
        }
    })
}