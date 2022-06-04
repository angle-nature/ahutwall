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
        likeList: [],
        pageNumber: 1,
        pageSize: 15,
        isBottom: false,
        userInfo: getApp().globalData.userInfo
    },

    getLikeList(showLoading = true) {
        var that = this;
        cloudRequest({
            name: "getAppointList",
            data: {
                module: "likeList",
                pageNumber: that.data.pageNumber,
                pageSize: that.data.pageSize
            }
        }, showLoading).then(res => {
            let likeList = res.result.list;
            likeList.forEach(element => {
                element.like_time = formatTime(element.like_time)
            });
            that.setData({
                likeList: [...that.data.likeList, ...likeList],
                isBottom: likeList.length < that.data.pageSize ? true : false
            })
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getLikeList();
        cloudRequest({
            name: "updateLook",
            data: {
                module: "likeLooked"
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
        // 1 判断还有没有下一页数据
        if (!this.data.isBottom) {
            this.data.pageNumber++;
            this.getLikeList(true);
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