// pages/privateletter/privateletter.js
const {
    cloudRequest,
    tips,
    formatTime
} = require("../../utils/util")
Page({
    /**
     * 页面的初始数据
     */
    data: {
        privateLetterList: [],
        pageNumber: 1,
        pageSize: 10,
        isBottom: false
    },

    getPrivateLetter(showLoading = true) {
        var that = this;
        cloudRequest({
            name: "getAppointList",
            data: {
                module: "privateLetter",
                pageNumber: that.data.pageNumber,
                pageSize: that.data.pageSize
            }
        }, showLoading).then(res => {
            let privateLetterList = res.result.list;
            privateLetterList.forEach(element => {
                element.messageLatest = element.Message[element.Message.length - 1]; //添加最新一条信息
                element.messageLatest.createTime = formatTime(element.messageLatest.createTime);
            });
            that.setData({
                privateLetterList: [...that.data.privateLetterList, ...privateLetterList],
                isBottom: privateLetterList.length < that.data.pageSize ? true : false
            })
        })
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
        this.data.pageNumber = 1;
        this.data.privateLetterList = [];
        this.getPrivateLetter(true);
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
        this.data.pageNumber = 1;
        this.data.privateLetterList = [];
        this.getPrivateLetter();
        wx.stopPullDownRefresh()
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        if (!this.data.isBottom) {
            this.data.pageNumber++;
            this.getPrivateLetter(true);
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