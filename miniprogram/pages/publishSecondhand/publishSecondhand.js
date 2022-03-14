// pages/publishSecondhand/publishSecondhand.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        tabs: [{
                id: 0,
                value: "出售",
                isActive: true
            },
            {
                id: 1,
                value: "求购",
                isActive: false
            }
        ],
        images: [],
    },

    // 标题点击事件
    handleTabsItemChange(e) {
        // 获取被点击的标题的索引
        const {index} = e.detail;
        // 修改原数组
        let {tabs} = this.data;
        tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
        // 赋值到data中
        this.setData({
            tabs
        })
    },

    uploadImage(e) {
        var that = this;
        const maxImageNumber = 9;
        wx.chooseImage({
            count: maxImageNumber, //选取一张图片
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success(res) {
                const tempFilePath = res.tempFilePaths
                if (that.data.images.length + tempFilePath.length > maxImageNumber) {
                    wx.showModal({
                        content: "最多上传" + maxImageNumber + "张图片！"
                    })
                } else {
                    that.setData({
                        images: [...that.data.images, ...tempFilePath]
                    })
                }
            }
        })
    },

    previewImage(e) {
        var that = this;
        let imageurl = e.currentTarget.dataset.imageurl;
        wx.previewImage({
            urls: that.data.images,
            current: imageurl,
        })
    },

    deleteImage(e) {
        const deleteImageUrl = e.currentTarget.dataset.imageurl;
        var imageArr = this.data.images;
        for (let i = 0; i < imageArr.length; i++) {
            if (imageArr[i] == deleteImageUrl) {
                imageArr.splice(i, 1);
                break;
            }
        }
        this.setData({
            images: imageArr
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