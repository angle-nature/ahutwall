const {
    cloudRequest,
    tips,
    formatTime
} = require("../../utils/util")

// pages/inform/inform.js
Page({
    /**
     * 页面的初始数据
     */
    data: {
        noticList: [],
        pageNumber: 1,
        pageSize: 10,
        isBottom: false
    },

    getOfficialNotice(showLoading = true) {
        var that = this;
        cloudRequest({
            name: "getAppointList",
            data: {
                module: "officialNoticeList",
                pageNumber: that.data.pageNumber,
                pageSize: that.data.pageSize
            }
        }, showLoading).then(res => {
            let noticeList = res.result;
            noticeList.forEach(element => {
                element.publish_time = formatTime(element.publish_time);
            });
            that.setData({
                noticList: [...that.data.noticList, ...noticeList],
                isBottom: res.result.length < that.data.pageSize ? true : false
            })
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getOfficialNotice();
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
        // 1 判断还有没有下一页数据
        if (!this.data.isBottom) {
            this.data.pageNumber++;
            this.getOfficialNotice(true);
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