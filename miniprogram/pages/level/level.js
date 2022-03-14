// pages/level/level.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        user:"",
        level_list:[10,650,1350,3150,4850,9540,21600]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this;
        const eventChannel = this.getOpenerEventChannel()
        eventChannel.on('acceptDataFromOpenedPage', function (data) {
            that.setData({
                user: data.user,
            });
        })
        console.log(that.data.user)
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