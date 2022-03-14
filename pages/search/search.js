// pages/search/search.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        historyConetent:['历史记录1','历史记录2','历史记录3','历史记录','历史记录5','历史记录6'],
        hotSearchWord:['热搜词','热搜词','热搜词','热搜词','热搜词','热搜词','热搜词','热搜词','热搜词',],
        showStatus:false,
        showHistory:true
    },

    showMoreHistory(e){
        var historyConetent = [];
        if(!this.data.showStatus){
            historyConetent = ['历史记录1','历史记录2','历史记录3','历史记录','历史记录5','历史记录6','历史记录7','历史记录8','历史记录9','历史记录10'];
            this.setData({showStatus:true})
        }else{
            historyConetent = ['历史记录1','历史记录2','历史记录3','历史记录','历史记录5','历史记录6'];
            this.setData({showStatus:false})
        }
        this.setData({historyConetent})
    },

    binddelete(e){
        var historyConetent = [];
        this.setData({historyConetent,showHistory:false})
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