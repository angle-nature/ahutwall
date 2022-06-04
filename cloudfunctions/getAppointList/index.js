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
        case 'officialNoticeList': {
            return getOfficialNoticeList(event)
        }
        case 'likeList': {
            return getLikeList(event)
        }
        case 'commentList': {
            return getCommentList(event)
        }
        case 'replyList': {
            return getReplyList(event)
        }
        case 'privateLetter': {
            return getPrivateLetter(event)
        }
        case 'reportList': {
            return getReportList(event)
        }
        default: {
            return '模块不存在'
        }
    }
}
// 获取官方通知
async function getOfficialNoticeList(event) {
    let {
        pageNumber,
        pageSize
    } = event
    return await db.collection("official_notice").where({
        all: null
    }).orderBy('publish_time', 'desc').skip((pageNumber - 1) * pageSize).limit(pageSize).get().then(res => {
        console.log(res)
        return res.data;
    })
}

// 获取点赞列表
async function getLikeList(event) {
    let {
        pageNumber,
        pageSize
    } = event
    return await db.collection('vindicate_opinion-like').aggregate().lookup({
        from: 'user',
        localField: 'user_id',
        foreignField: 'openid',
        as: 'userInfo',
    }).lookup({
        from: 'vindicate_opnionMessage',
        let: {
            message_id: '$message_id',
        },
        pipeline: $.pipeline()
            .match(_.expr($.eq(['$_id', '$$message_id'])))
            .project({
                _id: 0,
                text_content: 1
            })
            .done(),
        as: 'message',
    }).match({
        message_user_id: openid,
        user_id: _.neq(openid)
    }).sort({
        like_time: -1 //从大到小
    }).skip((pageNumber - 1) * pageSize).limit(pageSize).end()
}

// 获取评论列表
async function getCommentList(event) {
    let {
        pageNumber,
        pageSize
    } = event
    return await db.collection('comments').aggregate().lookup({
        from: 'vindicate_opnionMessage',
        let: {
            message_id: '$message_id',
        },
        pipeline: $.pipeline()
            .match(_.expr($.eq(['$_id', '$$message_id'])))
            .project({
                _id: 0,
                text_content: 1
            })
            .done(),
        as: 'message',
    }).match({
        message_user_id: openid,
        user_id: _.neq(openid)
    }).sort({
        comment_time: -1 //从大到小
    }).skip((pageNumber - 1) * pageSize).limit(pageSize).end()
}

// 获取回复列表
async function getReplyList(event) {
    let {
        pageNumber,
        pageSize
    } = event
    return await db.collection('reply').aggregate().lookup({
        from: 'comments',
        let: {
            comment_id: '$comment_id',
        },
        pipeline: $.pipeline()
            .match(_.expr($.eq(['$_id', '$$comment_id'])))
            .project({
                _id: 0,
                message_id: 1
            })
            .done(),
        as: 'message',
    }).match({
        to_uid: openid,
        from_uid: _.neq(openid)
    }).project({
        _id: 0,
        from_user_avatarUrl: 1,
        from_user_experienceValue: 1,
        from_user_nickName: 1,
        time: 1,
        content: 1,
        message: 1,
    }).sort({
        time: -1 //从大到小
    }).skip((pageNumber - 1) * pageSize).limit(pageSize).end()
}

// 获取私信列表
async function getPrivateLetter(event) {
    let {
        pageNumber,
        pageSize
    } = event
    return await db.collection('message').aggregate().lookup({
        from: 'user',
        let: {
            openid: '$_openid',
            userId: '$userId'
        },
        pipeline: $.pipeline()
            .match(_.expr($.or([
                $.and([
                    $.eq([openid, '$$openid']),
                    $.eq(['$openid', '$$userId']),
                ]),
                $.and([
                    $.eq([openid, '$$userId']),
                    $.eq(['$openid', '$$openid']),
                ])
            ])))
            .project({
                _id: 0,
                avatarUrl: 1,
                nickName: 1,
                openid: 1
            })
            .done(),
        as: 'chatUser',
    }).match(_.or({
        _openid: openid,
        Message: _.neq([])
    }, {
        userId: openid,
        Message: _.neq([])
    })).skip((pageNumber - 1) * pageSize).limit(pageSize).end()
}

// 获取举报结果
async function getReportList(event) {
    let {
        pageNumber,
        pageSize
    } = event
    return await db.collection('report').aggregate().lookup({
        from: 'user',
        localField: 'user_id',
        foreignField: 'openid',
        as: 'userInfo',
    }).match({
        all: null
    }).sort({
        publish_time: -1 //从大到小
    }).skip((pageNumber - 1) * pageSize).limit(pageSize).end()
}