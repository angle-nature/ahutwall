const {
    tips,
    cloudRequest
} = require("../../utils/util");

// pages/publishNotice/publishNotice.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        noticeTitle: "",
        usedNumber: 0,
        usedTitleNumber: 0,
        noticeContent: ""
    },

    bindTitleInput(e) {
        var text = e.detail.value
        var number = text.length <= 30 ? text.length : 30;
        this.setData({
            noticeTitle: text,
            usedTitleNumber: number
        })
    },

    bindTextareaInput(e) {
        var text = e.detail.value
        var number = text.length <= 800 ? text.length : 800;
        this.setData({
            noticeContent: text,
            usedNumber: number
        })
    },

    bindsumbit(e) {
        if (this.data.usedNumber > 0 && this.data.usedTitleNumber > 0) {
            var that = this;
            cloudRequest({
                name: "publishOfficialNotice",
                data: {
                    noticeTitle: that.data.noticeTitle,
                    noticeContent: that.data.noticeContent
                }
            }).then(res => {
                tips("发布成功", 1000, 'success');
                setTimeout(function () {
                    wx.navigateBack({
                        delta: 1,
                    })
                }, 1000)
            })
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

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

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})