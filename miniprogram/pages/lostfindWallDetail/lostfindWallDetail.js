// pages/lostfindWallDetail/lostfindWallDetail.js
import {
    tips,
    cloudRequest,
    formatTime,
    getLevel
} from '../../utils/util.js'
Page({
    /**
     * 页面的初始数据
     */
    data: {
        message: [],
        animationData: {},
        _id: "",
        userInfo: getApp().globalData.userInfo,
        report_type: ['广告内容', '不友善内容', '反社会、反人类、反科学', '色情低俗', '违法违规', '侵权投诉', '其他'],
        showNote: false,
        animationDataMask: {},
        animation2: {}
    },

    bindShowBox: function (e) {
        if (getApp().globalData.userInfo == null) {
            tips("请先登录哦~");
            return;
        }
        var that = this
        this.setData({
            showNote: true
        })

        var animation1 = wx.createAnimation({
            duration: 200,
            timingFunction: 'ease-out'
        })

        var animation2 = wx.createAnimation({
            duration: 200,
            timingFunction: 'ease-out'
        })

        let realWidth = wx.getSystemInfoSync().windowWidth;
        let pxValueY = -730 * realWidth / 750;

        animation1.opacity(0.5).step();
        animation2.translateY(pxValueY).step();
        setTimeout(function () {
            that.setData({
                animationData2: animation2.export(),
                animationDataMask: animation1.export()
            })
        }, 100)
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

        animation1.opacity(0).step();
        animation2.translateY(0).step();

        var that = this
        this.setData({
            animationData2: animation2.export(),
            animationDataMask: animation1.export(),
        })
        setTimeout(function () {
            that.setData({
                showNote: false
            })
        }, 200)
    },

    getMessage() {
        var that = this;
        cloudRequest({
            name: "wallsFunction",
            data: {
                module: "lostfindMessage",
                action: "getById",
                params: {
                    _id: that.data._id
                }
            }
        }).then(res => {
            console.log(res)
            let message = res.result.list[0];
            message.publish_time = formatTime(message.publish_time) //将时间戳转换为日期格式
            message.userInfo[0].level = getLevel(message.userInfo[0].experienceValue) //将经验值转换为等级
            message.isCollected = message.collectList.length == 0 ? false : true; //是否收藏
            that.setData({
                message: message
            })
        })
    },

    // 预览大图
    previewImage: function (e) {
        // 当前图片url
        let currentImageUrl = e.currentTarget.dataset.imagesrc;
        // 当前图片所在图片组
        let currentImageList = this.data.message.images_content;
        wx.previewImage({
            current: currentImageUrl,
            urls: currentImageList
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
            animationData: animation.export()
        })
        setTimeout(function () {
            animation.scale(1).step();
            that.setData({
                message: message,
                animationData: animation.export()
            })
        }, 100)
        cloudRequest({
            name: "wallsFunction",
            data: {
                module: "lostfindMessage", //对表白墙进行操作
                action: "collect",
                params: {
                    count: count,
                    _id: that.data._id
                }
            }
        }, false).then(res => {
            message.collect_number = message.collect_number + count;
            this.setData({
                message
            })
        })
    },

    // 导航去他人个人资料界面
    bindNavigateToSixin() {
        var that = this;
        if (getApp().globalData.userInfo != null && etApp().globalData.userInfo.openid == this.data.message.user_id) {
            wx.switchTab({
                url: '../../pages/mine/mine',
            })
        } else { //非匿名状态
            wx.navigateTo({
                url: '../../pages/sixinjiemian/sixinjiemian?user_id=' + that.data.message.user_id,
            })
        }
    },

    // 点击我想要或我要出 跳转到聊天界面
    gotoTalk() {
        if (getApp().globalData.userInfo == null) {
            tips("请先登录哦~");
            return;
        }
        var that = this;
        if (getApp().globalData.userInfo.openid != this.data.message.user_id) {
            wx.navigateTo({
                url: '../../pages/talk/talk?userId=' + that.data.message.user_id,
            })
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            _id: options._id
        })
        this.getMessage();
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
    },
})