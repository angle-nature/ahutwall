const {
    tips,
    cloudRequest
} = require("../../utils/util");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        reportType: "",
        usedNumber: 0,
        reportContent: ""
    },

    bindTextareaInput(e) {
        var text = e.detail.value
        var number = text.length <= 200 ? text.length : 200;
        this.setData({
            reportContent: text,
            usedNumber: number
        })
    },

    bindsumbit(e) {
        if (this.data.usedNumber != 0) {
            var that = this;
            cloudRequest({
                name: "submitReport",
                data: {
                    reportType: that.data.reportType,
                    reportContent: that.data.reportContent,
                    message_id: that.data.message_id,
                    wallType: that.data.wallType
                }
            }).then(res => {
                tips("提交成功", 1000, 'success');
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
    onLoad: function (options) {
        this.setData({
            reportType: options.type,
            message_id: options.message_id,
            wallType: options.wallType
        })
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