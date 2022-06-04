const {
    cloudRequest
} = require("../../utils/util");

// pages/massage/massage.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        officialNotice: {},
        noticeStatus: false,
        likeNumber: 0,
        commentNumber: 0,
        replyNumber: 0,
        reportNumber: 0,
        admin: false
    },

    getAllStatus(e) {
        var that = this;
        cloudRequest({
            name: "getAllStatus",
            data: {
                admin: that.data.admin
            }
        }, false).then(res => {
            that.setData({
                officialNotice: res.result.noticeLatest,
                likeNumber: res.result.likeList.length,
                commentNumber: res.result.commentList.length,
                replyNumber: res.result.replyList.length,
                reportNumber: res.result.reportList.length,
            })
            if (res.result.noticeLatest != null) {
                let currentTime = new Date().getTime(); //当前时间戳
                let publishTime = new Date(res.result.noticeLatest.publish_time).getTime(); //获取最新通知发布时间戳
                let subtractTime = currentTime - publishTime; //计算出时间差
                let days = Math.floor(subtractTime / (24 * 3600 * 1000)) //计算出相差天数
                if (days <= 2) { //如果时间差在两天之内 即显示new
                    that.setData({
                        noticeStatus: true
                    })
                }
            }
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

        if (getApp().globalData.userInfo != null && 'admin' in getApp().globalData.userInfo) {
            this.setData({
                admin: true
            })
        }
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
        this.getAllStatus();
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
        this.getAllStatus();
        wx.stopPullDownRefresh()
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