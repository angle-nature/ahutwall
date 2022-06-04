// pages/comment/comment.js
const {
    cloudRequest,
    formatTime,
    tips
} = require("../../utils/util")
Page({

    /**
     * 页面的初始数据
     */
    data: {
        commentList: [],
        pageNumber: 1,
        pageSize: 15,
        isBottom: false,
        userInfo: getApp().globalData.userInfo
    },

    getCommentList(showLoading = true) {
        var that = this;
        cloudRequest({
            name: "getAppointList",
            data: {
                module: "commentList",
                pageNumber: that.data.pageNumber,
                pageSize: that.data.pageSize
            }
        }, showLoading).then(res => {
            let commentList = res.result.list;
            commentList.forEach(element => {
                element.comment_time = formatTime(element.comment_time)
            });
            that.setData({
                commentList: [...that.data.commentList, ...commentList],
                isBottom: commentList.length < that.data.pageSize ? true : false
            })
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getCommentList();
        cloudRequest({
            name: "updateLook",
            data: {
                module: "commentLooked"
            }
        }, true)
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
        if (!this.data.isBottom) {
            this.data.pageNumber++;
            this.getCommentList(true);
        } else {
            tips('到底啦！')
        }
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})