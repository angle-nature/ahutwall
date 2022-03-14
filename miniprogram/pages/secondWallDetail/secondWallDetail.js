// pages/secondWallDetail/secondWallDetail.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        type: 0,
        item: {
            "avatar": "/images/avatar1.jpg",
            "name": "自顾",
            "publish_time": "2021.2.21 16:45",
            "level": "5",
            'goods_name': '工程经济与项目管理',
            'price': "10",
            "min_price": "5",
            "max_price": "12",
            'images': ['/images/goods1.jpg', '/images/goods2.jpg', '/images/goods3.jpg', '/images/goods4.jpg'],
            "counteroffer": "不可还价",
            "detail": "全新书籍"
        }
    },

    // 预览大图
    previewImage: function (e) {
        // 当前图片url
        let currentImageUrl = e.currentTarget.dataset.imagesrc;
        // 当前图片所在图片组
        let currentImageList = this.data.item.images;
        wx.previewImage({
            current: currentImageUrl,
            urls: currentImageList
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            type: options.type
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