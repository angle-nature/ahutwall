import {
    tips,
    confirm,
    cloudRequest,
    formatTime,
    getLevel,
    isNull
} from '../../utils/util.js'
Page({
    data: {
        // 表白墙所有动态
        messages: [],
        showComment: false, //弹出评论输入框状态
        commentInput: "", //评论内容
        inputHeight: 0, //键盘高度
        scrollTop: 0, //页面滚动离顶部的距离
        likeAnimationData: {}, //点赞动画
        collectAnimationData: {}, //收藏动画
        animationIndex: 0, //具体哪条动态的动画
        isBottom: false, //判断数据是否全部加载完
        isTounchedBottom: false,
        comment_message_id: "", //要评论的消息id
        comment_index: 0 //评论的消息所在index
    },

    params: {
        pageSize: 10,
        pageNumber: 1,
        type: 0 // 类型选择表白墙
    },

    // 获取表白墙动态
    getMessages() {
        var that = this;
        cloudRequest({
            name: "wallsFunction",
            data: {
                module: "vindicate_opnionMessage", //对表白墙进行操作
                action: "get",
                params: that.params
            }
        }).then(res => {
            let messages = res.result.list;
            for (let i = 0; i < messages.length; i++) {
                messages[i].publish_time = formatTime(messages[i].publish_time) //将时间戳转换为日期格式
                messages[i].userInfo[0].level = getLevel(messages[i].userInfo[0].experienceValue) //将经验值转换为等级
                messages[i].isLiked = messages[i].likeList.length == 0 ? false : true; //是否点赞
                messages[i].isCollected = messages[i].collectList.length == 0 ? false : true; //是否收藏
            }
            if (messages.length < that.params.pageSize) {
                this.setData({
                    isBottom: true,
                    messages: [...that.data.messages, ...messages]
                })
            } else {
                this.setData({
                    messages: [...that.data.messages, ...messages]
                })
            }
        })
    },

    //查看动态详情
    lookDetail: function (e) {
        let _id = e.currentTarget.dataset._id;
        wx.navigateTo({
            url: '/pages/vindicateWallDetail/vindicateWallDetail?_id=' + _id
        })
    },

    onPageScroll(e) {
        // 获取滚动条到顶部的距离
        this.setData({
            scrollTop: e.scrollTop
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
        let _id = e.currentTarget.dataset._id;
        let index = e.currentTarget.dataset.index;
        this.setData({
            animationIndex: index
        })

        let messages = this.data.messages;
        messages[index].isLiked = !messages[index].isLiked;

        let animation = wx.createAnimation({
            duration: "100",
            timingFunction: "ease",
        })
        let count = 0;
        if (messages[index].isLiked) {
            animation.rotateY(90).step();
            this.setData({
                likeAnimationData: animation.export()
            })
            setTimeout(function () {
                animation.rotateY(180).step();
                that.setData({
                    messages: messages,
                    likeAnimationData: animation.export()
                })
            }, 50)
            count = 1
        } else {
            animation.rotateY(90).step();
            this.setData({
                likeAnimationData: animation.export()
            })
            setTimeout(function () {
                animation.rotateY(0).step();
                that.setData({
                    messages: messages,
                    likeAnimationData: animation.export()
                })
            }, 50)
            count = -1
        }
        cloudRequest({
            name: "wallsFunction",
            data: {
                module: "vindicate_opnionMessage", //对表白墙进行操作
                action: "like",
                params: {
                    count: count,
                    _id: _id,
                    message_user_id: that.data.messages[index].user_id
                }
            }
        }, false).then(res => {
            messages[index].like_number = messages[index].like_number + count;
            this.setData({
                messages
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
        let _id = e.currentTarget.dataset._id;
        let index = e.currentTarget.dataset.index;
        this.setData({
            animationIndex: index
        })
        let messages = this.data.messages;
        messages[index].isCollected = !messages[index].isCollected;
        let count = messages[index].isCollected ? 1 : (-1);
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
                messages: messages,
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
                    _id: _id,
                    type: 0
                }
            }
        }, false)
    },

    // 展示评论输入框
    bindComment: function (e) {
        if (getApp().globalData.userInfo == null) {
            tips("请先登录哦~");
            return;
        }
        let _id = e.currentTarget.dataset._id;
        let index = e.currentTarget.dataset.index;
        this.setData({
            showComment: true,
            comment_message_id: _id,
            comment_index: index
        })
    },

    hideInput: function (e) {
        this.setData({
            showComment: false
        })
    },

    // 输入评论
    bindCommentInput: function (e) {
        this.setData({
            commentInput: e.detail.value
        })
    },

    // 发送评论
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
            }, false).then(res => {
                if (res.result.result.label == 100) {
                    cloudRequest({
                        showLoading: true,
                        name: "wallsFunction",
                        data: {
                            module: "vindicate_opnionMessage", //对表白墙进行操作
                            action: "comment",
                            params: {
                                _id: that.data.comment_message_id,
                                content: that.data.commentInput,
                                message_user_id: that.data.messages[that.data.comment_index].user_id
                            }
                        }
                    }, true, "发送中").then(res => {
                        cloudRequest({
                            name: "getComments",
                            data: {
                                module: "without_reply_limit",
                                message_id: that.data.comment_message_id,
                            }
                        }, true, "发送中").then(res => {
                            let messages = that.data.messages;
                            messages[that.data.comment_index].comments = res.result.list;
                            messages[that.data.comment_index].comment_number++;
                            that.setData({
                                messages
                            })
                        })
                    })
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

    onLoad: function (options) {
        this.getMessages();
    },

    onShow: function () {},

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        this.data.messages = []
        this.params.pageNumber = 1;
        this.getMessages();
        wx.stopPullDownRefresh()
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        this.setData({
            isTounchedBottom: true
        })
        // 1 判断还有没有下一页数据
        if (!this.data.isBottom) {
            this.params.pageNumber++;
            this.getMessages()
        }
    },
})