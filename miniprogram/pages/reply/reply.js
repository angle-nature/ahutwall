// pages/reply/reply.js
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
        replyList: [],
        pageNumber: 1,
        pageSize: 15,
        isBottom: false
    },

    getReplyList(showLoading = false) {
        var that = this;
        cloudRequest({
            name: "getAppointList",
            data: {
                module: "replyList",
                pageNumber: that.data.pageNumber,
                pageSize: that.data.pageSize
            }
        }, showLoading).then(res => {
            let replyList = res.result.list;
            replyList.forEach(element => {
                element.time = formatTime(element.time)
            });
            that.setData({
                replyList: [...that.data.replyList, ...replyList],
                isBottom: replyList.length < that.data.pageSize ? true : false
            })
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.getReplyList();
        cloudRequest({
            name: "updateLook",
            data: {
                module: "replyLooked"
            }
        }, true)
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {
        if (!this.data.isBottom) {
            this.data.pageNumber++;
            this.getReplyList(true);
        } else {
            tips('到底啦！')
        }
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})