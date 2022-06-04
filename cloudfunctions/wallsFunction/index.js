// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
// 获取数据库的引用
const db = cloud.database();
var openid = "";
const _ = db.command
const $ = db.command.aggregate
var userTable = db.collection('user');
// 云函数入口函数
exports.main = async (event, context) => {
    openid = cloud.getWXContext().OPENID;
    // module 决定对哪一个 墙 进行操作
    switch (event.module) {
        case 'vindicate_opnionMessage': {
            return vindicate_opnionMessage(event)
        }
        case 'secondhandMessage': {
            return secondhandMessage(event)
        }
        case 'lostfindMessage': {
            return lostfindMessage(event)
        }
        default: {
            return '模块不存在'
        }
    }
}

// 增加经验
async function incExperienceValue(experValue) {
    userTable.where({
        openid: openid
    }).update({
        data: {
            experienceValue: _.inc(experValue)
        }
    })
}

// 用户被点赞数+1或-1
async function incLikedNumber(message_id, count) {
    var likedUserId = "";
    var vindicate_opnoinTable = db.collection("vindicate_opnionMessage");
    vindicate_opnoinTable.doc(message_id).get().then(res => {
        likedUserId = res.data.user_id;
        userTable.where({
            openid: likedUserId
        }).update({
            data: {
                liked_number: _.inc(count)
            }
        })
    })
}

// 用户被评论数+1
async function incCommentedNumber(message_id) {
    var commentedUserId = "";
    var table = db.collection("vindicate_opnionMessage");
    table.doc(message_id).get().then(res => {
        commentedUserId = res.data.user_id;
        userTable.where({
            openid: commentedUserId
        }).update({
            data: {
                commented_number: _.inc(1)
            }
        })
    })
}

// 表白墙/食堂意见墙 增删改查
async function vindicate_opnionMessage(event) {
    var vindicate_opnoinTable = db.collection('vindicate_opnionMessage');
    switch (event.action) {
        case 'add': { // 发布动态
            return await vindicate_opnoinTable.add({
                data: {
                    ...event.params,
                    user_id: openid
                }
            }).then(res => {
                // 发布动态 增加50经验值
                incExperienceValue(50)
            })
        }
        case 'delete': { // 删除动态
            let commentsTable = db.collection('comments');
            let replyTable = db.collection('reply');
            let likeTable = db.collection('vindicate_opinion-like');
            let collectTable = db.collection('vindicate_opinion-collect');
            await commentsTable.where({ //删除回复
                message_id: event.params._id
            }).get().then(res => {
                res.data.forEach(element => {
                    replyTable.where({
                        comment_id: element._id
                    }).remove()
                });
            })
            await commentsTable.where({ //删除评论
                message_id: event.params._id
            }).remove()
            await likeTable.where({ //删除点赞
                message_id: event.params._id
            }).remove()
            await collectTable.where({ //删除收藏
                message_id: event.params._id
            }).remove()
            return await vindicate_opnoinTable.doc(event.params._id).remove() //删除消息
        }
        case 'get': { // 获取动态-分页获取
            let {
                pageSize, //一页的大小
                pageNumber, //页号
                type, //墙类型
                canteen
            } = event.params;
            // 按发布时间降序 查找指定页号，一页指定数量的记录集合
            return await vindicate_opnoinTable.aggregate().lookup({ // 根据userid 联合查询 用户信息
                from: 'user',
                localField: 'user_id',
                foreignField: 'openid',
                as: 'userInfo',
            }).lookup({ //联合查询点赞表
                from: 'vindicate_opinion-like',
                let: {
                    message_id: '$_id',
                },
                pipeline: $.pipeline()
                    .match(_.expr($.and([
                        $.eq(['$message_id', '$$message_id']),
                        $.eq(['$user_id', openid])
                    ])))
                    .project({
                        _id: 0,
                        like_time: 0,
                        message_id: 0,
                        user_id: 0,
                        isLooked: 0
                    })
                    .done(),
                as: 'likeList',
            }).lookup({ //联合查询收藏表
                from: 'vindicate_opinion-collect',
                let: {
                    message_id: '$_id',
                },
                pipeline: $.pipeline()
                    .match(_.expr($.and([
                        $.eq(['$message_id', '$$message_id']),
                        $.eq(['$user_id', openid])
                    ])))
                    .project({
                        _id: 0,
                        collect_time: 0,
                        message_id: 0,
                        user_id: 0,
                        isLooked: 0
                    })
                    .done(),
                as: 'collectList',
            }).lookup({ //联合查询评论表
                from: 'comments',
                localField: '_id',
                foreignField: 'message_id',
                as: 'comments',
            }).match({
                type: type,
                canteen: canteen,
            }).sort({
                publish_time: -1 //从大到小
            }).skip((pageNumber - 1) * pageSize).limit(pageSize).end()
        }
        case 'getById': {
            return await vindicate_opnoinTable.aggregate().lookup({ // 根据userid 联合查询 用户信息
                from: 'user',
                localField: 'user_id',
                foreignField: 'openid',
                as: 'userInfo',
            }).lookup({ //联合查询点赞表
                from: 'vindicate_opinion-like',
                let: {
                    message_id: '$_id',
                },
                pipeline: $.pipeline()
                    .match(_.expr($.and([
                        $.eq(['$message_id', '$$message_id']),
                        $.eq(['$user_id', openid])
                    ])))
                    .project({
                        _id: 0,
                        like_time: 0,
                        message_id: 0,
                        user_id: 0,
                        isLooked: 0
                    })
                    .done(),
                as: 'likeList',
            }).lookup({ //联合查询收藏表
                from: 'vindicate_opinion-collect',
                let: {
                    message_id: '$_id',
                },
                pipeline: $.pipeline()
                    .match(_.expr($.and([
                        $.eq(['$message_id', '$$message_id']),
                        $.eq(['$user_id', openid])
                    ])))
                    .project({
                        _id: 0,
                        collect_time: 0,
                        message_id: 0,
                        user_id: 0,
                        isLooked: 0
                    })
                    .done(),
                as: 'collectList',
            }).match({
                _id: event.params._id,
            }).end()
        }
        case 'like': { // 进行点赞
            let {
                count,
                _id,
                message_user_id
            } = event.params; // count = 1 or -1 即点赞或取消点赞
            return await vindicate_opnoinTable.doc(_id).update({
                data: {
                    // 点赞数自增1或自减1
                    like_number: _.inc(count)
                }
            }).then(res => {
                let likeTable = db.collection('vindicate_opinion-like');
                if (count == 1) {
                    let timestamp = Date.parse(new Date()); //点赞时间戳
                    likeTable.add({
                        data: {
                            message_id: _id, //消息id
                            user_id: openid, //点赞用户id
                            message_user_id: message_user_id, //发布消息用户id
                            like_time: timestamp, //点赞时间戳
                            isLooked: false //发布消息用户是否已读
                        }
                    }).then(res => {
                        incExperienceValue(10);
                        incLikedNumber(_id, 1);
                    })
                } else if (count == -1) {
                    likeTable.where({
                        message_id: _id,
                        user_id: openid,
                    }).remove().then(res => {
                        incExperienceValue(-10);
                        incLikedNumber(_id, -1);
                    })
                }
            })
        }
        case 'collect': { // 收藏
            let {
                count,
                _id,
                type
            } = event.params; // count = 1 or -1 即点赞或取消点赞
            return await vindicate_opnoinTable.doc(_id).update({
                data: {
                    // 收藏数自增1或自减1
                    collect_number: _.inc(count)
                }
            }).then(res => {
                let collectTable = db.collection('vindicate_opinion-collect');
                if (count == 1) {
                    let timestamp = Date.parse(new Date()); //收藏时间戳
                    collectTable.add({
                        data: {
                            message_id: _id, //消息id
                            type: type, //墙类型
                            user_id: openid, //收藏用户id
                            collect_time: timestamp, //收藏时间戳
                            isLooked: false //发布消息用户是否已读
                        }
                    }).then(res => {
                        incExperienceValue(20)
                    })
                } else if (count == -1) {
                    collectTable.where({
                        message_id: _id,
                        user_id: openid,
                    }).remove().then(res => {
                        // 发布动态 增加50经验值
                        incExperienceValue(-20)
                    })
                }
            })
        }
        case 'comment': { // 评论动态
            let {
                _id, //消息id
                content, //评论内容
                message_user_id
            } = event.params;
            return await vindicate_opnoinTable.doc(_id).update({
                data: {
                    // 评论数 +1
                    comment_number: db.command.inc(1),
                }
            }).then(res => {
                let timestamp = Date.parse(new Date()); //收藏时间戳
                let commentsTable = db.collection('comments');
                let userInfo = {};
                userTable.aggregate().match({
                    openid: openid
                }).project({
                    _id: 0,
                    avatarUrl: 1,
                    nickName: 1,
                    experienceValue: 1
                }).end().then(res => {
                    userInfo = res.list[0]
                    commentsTable.add({
                        data: {
                            user_avatarUrl: userInfo.avatarUrl,
                            user_nickName: userInfo.nickName,
                            user_experienceValue: userInfo.experienceValue,
                            message_id: _id, //消息id
                            user_id: openid, //评论用户id
                            comment_time: timestamp, //收藏时间戳
                            message_user_id: message_user_id,
                            content: content, //评论内容
                            isLooked: false //发布消息用户是否已读
                        }
                    }).then(res => {
                        incExperienceValue(10);
                        incCommentedNumber(_id);
                    })
                })
            })
        }
        case 'deleteComment': { // 删除评论
            let {
                message_id,
                comment_id //评论id
            } = event.params;
            let commentsTable = db.collection('comments');
            let replyTable = db.collection('reply');
            return await replyTable.where({ //先删除该评论下的回复
                comment_id: comment_id
            }).count().then(res => {
                let comment_number = res.total + 1;
                replyTable.where({ //先删除该评论下的回复
                    comment_id: comment_id
                }).remove().then(res => { //再删除评论
                    commentsTable.doc(comment_id).remove();
                    vindicate_opnoinTable.doc(message_id).update({
                        data: {
                            comment_number: _.inc(-comment_number),
                        }
                    })
                })
            })
        }
        case 'reply': { //回复
            let {
                message_id, //消息id
                comment_id, //评论id
                reply_id, //被回复的id
                reply_type, //回复类型
                to_userid, //被回复的用户openid
                content //回复内容
            } = event.params;
            return await vindicate_opnoinTable.doc(message_id).update({
                data: {
                    // 评论数 +1
                    comment_number: db.command.inc(1),
                }
            }).then(res => {
                let replyTable = db.collection('reply');
                let timestamp = Date.parse(new Date()); //收藏时间戳
                let from_userInfo = {};
                let to_userInfo = {};
                userTable.aggregate().match({
                    openid: openid
                }).project({
                    _id: 0,
                    avatarUrl: 1,
                    nickName: 1,
                    experienceValue: 1
                }).end().then(res => {
                    from_userInfo = res.list[0]
                    userTable.aggregate().match({
                        openid: to_userid
                    }).project({
                        _id: 0,
                        avatarUrl: 1,
                        nickName: 1,
                        experienceValue: 1
                    }).end().then(res => {
                        to_userInfo = res.list[0]
                        replyTable.add({
                            data: {
                                from_user_avatarUrl: from_userInfo.avatarUrl,
                                from_user_nickName: from_userInfo.nickName,
                                from_user_experienceValue: from_userInfo.experienceValue,
                                to_user_avatarUrl: to_userInfo.avatarUrl,
                                to_user_nickName: to_userInfo.nickName,
                                to_user_experienceValue: to_userInfo.experienceValue,
                                comment_id: comment_id, //评论id
                                reply_id: reply_id, //被回复的id
                                reply_type: reply_type, //回复类型
                                from_uid: openid, //回复用户
                                to_uid: to_userid, //被回复用户
                                time: timestamp, //回复时间戳
                                content: content, //评论内容
                                comment_user_isLooked: false, //被回复用户是否已读
                            }
                        }).then(res => {
                            incExperienceValue(10);
                            incCommentedNumber(message_id);
                        })
                    })
                })
            })
            break;
        }
        case 'deleteReply': { //删除回复
            let {
                message_id,
                reply_id //评论id
            } = event.params;
            return await vindicate_opnoinTable.doc(message_id).update({
                data: {
                    // 评论数 -1
                    comment_number: db.command.inc(-1),
                }
            }).then(res => {
                let replysTable = db.collection('reply');
                replysTable.doc(reply_id).remove();
            })
        }
    }
}

// 二手交易墙
async function secondhandMessage(event) {
    var secondhandTable = db.collection('secondhandMessage');
    switch (event.action) {
        case 'add': { // 发布动态
            return await secondhandTable.add({
                data: {
                    ...event.params,
                    user_id: openid
                }
            }).then(res => {
                // 发布动态 增加50经验值
                incExperienceValue(50)
            })
        }
        case 'delete': { // 删除动态
            let collectTable = db.collection('secondhand-collect');
            return await collectTable.where({ //删除收藏
                message_id: event.params._id
            }).remove().then(res => {
                secondhandTable.doc(event.params._id).remove();
            })
        }
        case 'get': { // 获取动态-分页获取
            let {
                pageSize, //一页的大小
                pageNumber, //页号
                kind, // 出售/求购
                searchKey //搜索关键词
            } = event.params;
            return await secondhandTable.aggregate().lookup({ // 根据userid 联合查询 用户信息
                from: 'user',
                localField: 'user_id',
                foreignField: 'openid',
                as: 'userInfo',
            }).match({
                kind: kind,
                goods_name: {
                    $regex: '.*' + searchKey + '.*',
                    $options: 'i' //不区分大小写
                }
            }).sort({
                publish_time: -1 //从大到小
            }).skip((pageNumber - 1) * pageSize).limit(pageSize).end()
        }
        case 'getById': {
            return await secondhandTable.aggregate().lookup({ // 根据userid 联合查询 用户信息
                from: 'user',
                localField: 'user_id',
                foreignField: 'openid',
                as: 'userInfo',
            }).lookup({ //联合查询收藏表
                from: 'secondhand-collect',
                let: {
                    message_id: '$_id',
                },
                pipeline: $.pipeline()
                    .match(_.expr($.and([
                        $.eq(['$message_id', '$$message_id']),
                        $.eq(['$user_id', openid])
                    ])))
                    .project({
                        _id: 0,
                        collect_time: 0,
                        message_id: 0,
                        user_id: 0,
                        isLooked: 0
                        // isCollect: $.and(true, true)
                    })
                    .done(),
                as: 'collectList',
            }).match({
                _id: event.params._id,
            }).end()
        }
        case 'collect': { // 收藏
            let {
                count,
                _id
            } = event.params;
            return await secondhandTable.doc(_id).update({
                data: {
                    // 收藏数自增1或自减1
                    collect_number: db.command.inc(count)
                }
            }).then(res => {
                let collectTable = db.collection('secondhand-collect');
                if (count == 1) {
                    let timestamp = Date.parse(new Date()); //收藏时间戳
                    collectTable.add({
                        data: {
                            message_id: _id, //消息id
                            user_id: openid, //收藏用户id
                            collect_time: timestamp, //收藏时间戳
                            isLooked: false //发布消息用户是否已读
                        }
                    }).then(res => {
                        incExperienceValue(20)
                    })
                } else if (count == -1) {
                    collectTable.where({
                        message_id: _id,
                        user_id: openid,
                    }).remove().then(res => {
                        incExperienceValue(-20)
                    })
                }
            })
        }
    }
}

// 失物招领墙
async function lostfindMessage(event) {
    var lostfindTable = db.collection('lostfindMessage');
    switch (event.action) {
        case 'add': { // 发布动态
            return await lostfindTable.add({
                data: {
                    ...event.params,
                    user_id: openid
                }
            }).then(res => {
                // 发布动态 增加50经验值
                incExperienceValue(50)
            })
        }
        case 'delete': { // 删除动态
            let collectTable = db.collection('lostfind-collect');
            return await collectTable.where({ //删除收藏
                message_id: event.params._id
            }).remove().then(res => {
                lostfindTable.doc(event.params._id).remove();
            })
        }
        case 'get': { // 获取动态-分页获取
            let {
                pageSize, //一页的大小
                pageNumber, //页号
                kind, // 出售/求购
                searchKey //搜索关键词
            } = event.params;
            return await lostfindTable.aggregate().lookup({ // 根据userid 联合查询 用户信息
                from: 'user',
                localField: 'user_id',
                foreignField: 'openid',
                as: 'userInfo',
            }).match({
                kind: kind,
                goods_name: {
                    $regex: '.*' + searchKey + '.*',
                    $options: 'i' //不区分大小写
                }
            }).sort({
                publish_time: -1 //从大到小
            }).skip((pageNumber - 1) * pageSize).limit(pageSize).end()
        }
        case 'getById': {
            return await lostfindTable.aggregate().lookup({ // 根据userid 联合查询 用户信息
                from: 'user',
                localField: 'user_id',
                foreignField: 'openid',
                as: 'userInfo',
            }).lookup({ //联合查询收藏表
                from: 'lostfind-collect',
                let: {
                    message_id: '$_id',
                },
                pipeline: $.pipeline()
                    .match(_.expr($.and([
                        $.eq(['$message_id', '$$message_id']),
                        $.eq(['$user_id', openid])
                    ])))
                    .project({
                        _id: 0,
                        collect_time: 0,
                        message_id: 0,
                        user_id: 0,
                        isLooked: 0
                    })
                    .done(),
                as: 'collectList',
            }).match({
                _id: event.params._id,
            }).end()
        }
        case 'collect': { // 收藏
            let {
                count,
                _id
            } = event.params; // count = 1 or -1 即点赞或取消点赞
            return await lostfindTable.doc(_id).update({
                data: {
                    // 收藏数自增1或自减1
                    collect_number: db.command.inc(count)
                }
            }).then(res => {
                let collectTable = db.collection('lostfind-collect');
                if (count == 1) {
                    let timestamp = Date.parse(new Date()); //收藏时间戳
                    collectTable.add({
                        data: {
                            message_id: _id, //消息id
                            user_id: openid, //收藏用户id
                            collect_time: timestamp, //收藏时间戳
                            isLooked: false //发布消息用户是否已读
                        }
                    }).then(res => {
                        incExperienceValue(20)
                    })
                } else if (count == -1) {
                    collectTable.where({
                        message_id: _id,
                        user_id: openid,
                    }).remove().then(res => {
                        incExperienceValue(-20)
                    })
                }
            })
        }
    }
}