// pages/opnionWallDetail/opnionWallDetail.js
import {
    tips,
    confirm,
    cloudRequest,
    cloudDeleteImage,
    formatTime,
    getLevel,
    isNull
} from '../../utils/util.js'
Page({
    /**
     * 页面的初始数据
     */
    data: {
        message: {},
        comments: [],
        report_type: ['广告内容', '不友善内容', '反社会、反人类、反科学', '色情低俗', '违法违规', '侵权投诉', '其他'],
        showComment: false,
        commentInput: "",
        inputHeight: 0,
        showbox: false,
        showNote: false,
        likeAnimationData: {}, //点赞动画
        collectAnimationData: {}, //收藏动画
        animationData1: {}, //删除弹窗动画
        animationData2: {}, //举报笔记弹窗动画
        animationDataMask: {}, //遮罩层浮现动画
        userInfo: getApp().globalData.userInfo, //用户id
        _id: "", //消息id
        comment_type: 0, //0：对消息进行评论；1：对评论进行回复；2：对回复进行回复
        comment_id: "", //评论id
        reply_id: "", //回复id
        reply_type: "", //回复类型
        to_uid: "", //被回复用户id
        placeholderText: "" //输入框中的显示文本
    },

    //获取动态
    getMessage(showLoading = true, title = "加载中") {
        var that = this;
        cloudRequest({
            name: "wallsFunction",
            data: {
                module: "vindicate_opnionMessage", //对表白墙进行操作
                action: "getById",
                params: {
                    _id: that.data._id
                }
            }
        }, showLoading, title).then(res => {
            let message = res.result.list[0];
            message.publish_time = formatTime(message.publish_time) //将时间戳转换为日期格式
            message.userInfo[0].level = getLevel(message.userInfo[0].experienceValue) //将经验值转换为等级
            message.isLiked = message.likeList.length == 0 ? false : true; //是否点赞
            message.isCollected = message.collectList.length == 0 ? false : true; //是否收藏
            that.setData({
                message: message
            })
            that.getComments(showLoading, title);
        })
    },

    //获取评论
    getComments(showLoading = true, title = "加载中") {
        var that = this;
        cloudRequest({
            name: "getComments",
            data: {
                module: "with_reply",
                message_id: that.data.message._id
            }
        }, showLoading, title).then(res => {
            let comments = res.result.list;
            comments.forEach(element => {
                element.comment_time = formatTime(element.comment_time) //将时间戳转换为日期格式
                element.user_level = getLevel(element.user_experienceValue);
                element.replys.forEach(reply => {
                    reply.time = formatTime(reply.time) //将时间戳转换为日期格式
                    reply.from_user_level = getLevel(reply.from_user_experienceValue)
                });
            });
            this.setData({
                comments: comments
            })
        })
    },

    // 预览大图
    previewImage: function (e) {
        // 当前图片url
        let currentImageUrl = e.currentTarget.dataset.imagesrc;
        // 当前图片所在图片组
        let currentImageList = e.currentTarget.dataset.imageurls;
        wx.previewImage({
            current: currentImageUrl,
            urls: currentImageList
        })
    },

    // 点赞事件
    bindLike: function (e) {
        if (getApp().globalData.userInfo == null) {
            tips("请先登录哦~");
            return;
        }
        var that = this;
        let message = this.data.message;
        message.isLiked = !message.isLiked;
        let animation = wx.createAnimation({
            duration: "100",
            timingFunction: "ease",
        })
        let count = 0;
        if (message.isLiked) {
            animation.rotateY(90).step();
            this.setData({
                likeAnimationData: animation.export()
            })
            setTimeout(function () {
                animation.rotateY(180).step();
                that.setData({
                    message: message,
                    likeAnimationData: animation.export()
                })
            }, 50)
            count = 1;
        } else {
            animation.rotateY(90).step();
            this.setData({
                likeAnimationData: animation.export()
            })
            setTimeout(function () {
                animation.rotateY(0).step();
                that.setData({
                    message: message,
                    likeAnimationData: animation.export()
                })
            }, 50)
            count = -1;
        }
        cloudRequest({
            name: "wallsFunction",
            data: {
                module: "vindicate_opnionMessage",
                action: "like",
                params: {
                    count: count,
                    _id: that.data._id,
                    message_user_id: that.data.message.user_id
                }
            }
        }, false).then(res => {
            message.like_number = message.like_number + count;
            this.setData({
                message
            })
        })
    },

    //收藏事件
    bindCollect: function (e) {
        if (getApp().globalData.userInfo == null) {
            tips("请先登录哦~");
            return;
        }
        var that = this;
        let message = this.data.message;
        message.isCollected = !message.isCollected;
        let count = message.isCollected ? 1 : (-1);
        let animation = wx.createAnimation({
            duration: "100",
            timingFunction: "ease",
        })

        animation.scale(0.5).step();
        this.setData({
            collectAnimationData: animation.export()
        })
        setTimeout(function () {
            animation.scale(1).step();
            that.setData({
                message: message,
                collectAnimationData: animation.export()
            })
        }, 100)
        cloudRequest({
            name: "wallsFunction",
            data: {
                module: "vindicate_opnionMessage", //对表白墙进行操作
                action: "collect",
                params: {
                    count: count,
                    _id: that.data._id,
                    type: 1
                }
            }
        }, false).then(res => {
            message.collect_number = message.collect_number + count;
            this.setData({
                message
            })
        })
    },

    bindComment: function (e) {
        if (getApp().globalData.userInfo == null) {
            tips("请先登录哦~");
            return;
        }
        let comment_type = e.currentTarget.dataset.comment_type;
        if (comment_type != 0) {
            let comment_id = e.currentTarget.dataset.comment_id;
            let reply_id = e.currentTarget.dataset.reply_id;
            let reply_type = e.currentTarget.dataset.reply_type;
            let to_uid = e.currentTarget.dataset.to_uid;
            let to_userName = e.currentTarget.dataset.to_username;
            this.setData({
                showComment: true,
                comment_type,
                comment_id,
                reply_id,
                reply_type,
                to_uid,
                placeholderText: "回复 @" + to_userName
            })
        } else {
            this.setData({
                showComment: true,
                comment_type
            })
        }
    },

    hideInput: function (e) {
        this.setData({
            showComment: false
        })
    },

    bindCommentInput: function (e) {
        this.setData({
            commentInput: e.detail.value
        })
    },

    sendComment: function (e) {
        var that = this;
        if (!isNull(this.data.commentInput)) {
            cloudRequest({
                name: "securityCheck",
                data: {
                    type: 0, //检测文本
                    params: {
                        scene: 2,
                        content: that.data.commentInput
                    }
                }
            }, true, "内容检测中").then(res => {
                if (res.result.result.label == 100) {
                    if (this.data.comment_type == 0) {
                        cloudRequest({
                            name: "wallsFunction",
                            data: {
                                module: "vindicate_opnionMessage", //对表白墙进行操作
                                action: "comment",
                                params: {
                                    _id: that.data._id,
                                    content: that.data.commentInput,
                                    message_user_id: that.data.message.user_id
                                }
                            }
                        }, true, "发送中").then(res => {
                            let message = that.data.message;
                            message.comment_number++;
                            that.setData({
                                message
                            })
                            that.getComments(false)
                        })
                    } else {
                        cloudRequest({
                            name: "wallsFunction",
                            data: {
                                module: "vindicate_opnionMessage", //对表白墙进行操作
                                action: "reply",
                                params: {
                                    message_id: that.data._id, //消息id
                                    comment_id: that.data.comment_id, //评论id
                                    reply_id: that.data.reply_id, //被回复的id
                                    reply_type: that.data.reply_type, //回复类型
                                    to_userid: that.data.to_uid, //被回复的用户openid
                                    content: that.data.commentInput //回复内容
                                }
                            }
                        }, true, "发送中").then(res => {
                            let message = that.data.message;
                            message.comment_number++;
                            that.setData({
                                message
                            })
                            that.getComments(false)
                        })
                    }
                } else {
                    confirm("包含违规文字，请修改！", false)
                }
            })

        } else {
            tips("评论不能为空哦~")
        }
    },

    // 获取键盘高度
    getKeybordHeight: function (e) {
        this.setData({
            inputHeight: e.detail.height
        })
    },

    bindShowBox: function (e) {
        if (getApp().globalData.userInfo == null) {
            tips("请先登录哦~");
            return;
        }
        var that = this
        var userType = e.currentTarget.dataset.usertype; //判断是动态作者点 还是 其他人点
        this.setData({
            showbox: true,
            showNote: true
        })
        var animation1 = wx.createAnimation({
            duration: 400,
            timingFunction: 'ease-out'
        })

        var animation2 = wx.createAnimation({
            duration: 400,
            timingFunction: 'ease-out'
        })

        var animation3 = wx.createAnimation({
            duration: 400,
            timingFunction: 'ease-out'
        })

        let realWidth = wx.getSystemInfoSync().windowWidth;
        let pxValueY1 = -190 * realWidth / 750;
        let pxValueY2 = -730 * realWidth / 750;

        animation1.translateY(pxValueY1).step();
        animation2.translateY(pxValueY2).step();
        animation3.opacity(0.5).step();

        if (userType == 1) // 自己点
            setTimeout(function () {
                that.setData({
                    animationData1: animation1.export(),
                    animationDataMask: animation3.export()
                })
            }, 100)
        else if (userType == 2) { // 他人点
            setTimeout(function () {
                that.setData({
                    animationData2: animation2.export(),
                    animationDataMask: animation3.export()
                })
            }, 100)
        }
    },

    bindHideBox: function (e) {
        var animation1 = wx.createAnimation({
            duration: 200,
            timingFunction: 'ease-out'
        })

        var animation2 = wx.createAnimation({
            duration: 200,
            timingFunction: 'ease-out'
        })

        var animation3 = wx.createAnimation({
            duration: 200,
            timingFunction: 'ease-out'
        })

        animation1.translateY(0).step();
        animation2.translateY(0).step();
        animation3.opacity(0).step();

        var that = this
        this.setData({
            animationData1: animation1.export(),
            animationData2: animation2.export(),
            animationDataMask: animation3.export(),
        })
        setTimeout(function () {
            that.setData({
                showbox: false,
                showNote: false
            })
        }, 200)
    },

    delete() {
        var that = this;
        cloudRequest({
            name: "wallsFunction",
            data: {
                module: "vindicate_opnionMessage",
                action: "delete",
                params: {
                    _id: this.data._id
                }
            }
        }, true, "删除中").then(res => {
            cloudDeleteImage(that.data.message.images_content).then(res => {
                tips("删除成功", 1000, "success").then(res => {
                    setTimeout(function () {
                        wx.navigateBack({
                            delta: 2,
                        })
                    }, 1000)
                })
            })
        })
    },

    deleteComment(e) {
        let user_id = e.currentTarget.dataset.to_uid;
        if (user_id == getApp().globalData.userInfo.openid) {
            confirm("删除评论？").then(res => {
                if (res.confirm) {
                    var that = this;
                    let comment_id = e.currentTarget.dataset.comment_id;
                    cloudRequest({
                        name: "wallsFunction",
                        data: {
                            module: "vindicate_opnionMessage", //对表白墙进行操作
                            action: "deleteComment",
                            params: {
                                message_id: that.data._id,
                                comment_id: comment_id
                            }
                        }
                    }, true, "删除中").then(res => {
                        that.getMessage(false)
                    })
                }
            })
        }
    },

    deleteReply(e) {
        let user_id = e.currentTarget.dataset.to_uid;
        if (user_id == getApp().globalData.userInfo.openid) {
            confirm("删除回复？").then(res => {
                if (res.confirm) {
                    var that = this;
                    let reply_id = e.currentTarget.dataset.reply_id;
                    cloudRequest({
                        name: "wallsFunction",
                        data: {
                            module: "vindicate_opnionMessage", //对表白墙进行操作
                            action: "deleteReply",
                            params: {
                                message_id: that.data._id,
                                reply_id: reply_id
                            }
                        }
                    }, true, "删除中").then(res => {
                        let message = that.data.message;
                        message.comment_number--;
                        that.setData({
                            message
                        })
                        that.getComments(false)
                    })
                }
            })
        }
    },

    // 导航去他人个人资料界面
    bindNavigateToSixin(e) {
        let to_userid = e.currentTarget.dataset.to_user;
        let to_type = e.currentTarget.dataset.to_type;
        if (to_type == 1) {
            if (getApp().globalData.userInfo != null && getApp().globalData.userInfo.openid == to_userid) {
                wx.switchTab({
                    url: '../../pages/mine/mine',
                })
            } else {
                wx.navigateTo({
                    url: '../../pages/sixinjiemian/sixinjiemian?user_id=' + to_userid,
                })
            }
        } else {
            if (to_userid != getApp().globalData.userInfo.openid) {
                wx.navigateTo({
                    url: '../../pages/sixinjiemian/sixinjiemian?user_id=' + to_userid,
                })
            }
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.data._id = options._id;
        this.getMessage()
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        this.getMessage()
        wx.stopPullDownRefresh()
    }
})