// pages/lostfindWallDetail/lostfindWallDetail.js
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
            'goods_name': '学生卡',
            'images': ['/images/goods4.jpg', '/images/goods1.jpg', '/images/goods2.jpg', ],
            'lost_place': '图书馆至G3宿舍楼的路上',
            'lost_time': '3月2日 12点左右',
            'detail': '中午回寝室的时候丢的，这对我来说真的很重要，希望捡到的同学能联系我，定有重谢。'
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