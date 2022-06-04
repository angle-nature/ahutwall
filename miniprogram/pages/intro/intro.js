// pages/intro/intro.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        introduction: "",
        num: 0,
    },
    iptIntro: function (e) {
        let intro = e.detail.value;
        var num = intro.length
        if (num <= 30) {
            this.setData({
                introduction: e.detail.value,
                num: num
            })
        }
    },
    confirmIntro: function () {
        var that = this
        wx.setStorage({
            key: 'introduction',
            data: that.data.introduction,
        })
        wx.navigateBack({
            delta: 1,
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let intro = options.introduction;
        var num = options.introduction.length;
        this.setData({
            introduction: intro,
            num: num
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