// pages/messageDetail/messageDetail.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        message: {
            "messageId": 1,
            "isLiked": false,
            "isCollected": false,
            "official": true,
            "avatar": "/images/avatar1.jpg",
            "name": "自顾",
            "publish_time": "2021.2.21 16:45",
            "level": "5",
            "text_content": "倾诉所有的不愉快",
            "images_content": ['/images/AHUT2.jpeg'],
            "comments_number": 0,
            "like_number": 121,
            "collect_number": 120
        },
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
        animationDataMask: {} //遮罩层浮现动画
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
        var that = this;
        // let messageId = e.currentTarget.dataset.messageid;
        let message = this.data.message;
        message.isLiked = !message.isLiked;
        let animation = wx.createAnimation({
            duration: "100",
            timingFunction: "ease",
        })

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
        }
    },

    //收藏事件
    bindCollect: function (e) {
        var that = this;
        let messageId = e.currentTarget.dataset.messageid;
        let message = this.data.message;
        message.isCollected = !message.isCollected;

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
    },

    bindComment: function (e) {
        this.setData({
            showComment: true
        })
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
        console.log(this.data.commentInput)
    },

    // 获取键盘高度
    getKeybordHeight: function (e) {
        this.setData({
            inputHeight: e.detail.height
        })
    },

    bindShowBox: function (e) {
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

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

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

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})