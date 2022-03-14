// pages/secondhandWall/secondhandWall.js
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
        goods_list: [{
            "avatar": "/images/avatar1.jpg",
            "name": "自顾",
            "publish_time": "2021.2.21 16:45",
            "level": "5",
            'goods_name': '工程经济与项目管理',
            'price': 10,
            'image': '/images/goods1.jpg',
            "counteroffer": "不可还价"
        }, {
            "avatar": "/images/avatar1.jpg",
            "name": "小蔡",
            "publish_time": "2021.2.21 16:45",
            "level": "5",
            'goods_name': '电吉他',
            'price': 140,
            'image': '/images/goods2.jpg',
            "counteroffer": "可还价"
        }, {
            "avatar": "/images/avatar1.jpg",
            "name": "fansi",
            "publish_time": "2021.2.21 16:45",
            "level": "5",
            'goods_name': '二手书',
            'price': 20,
            'image': '/images/goods3.jpg',
            "counteroffer": "可还价"
        }, {
            "avatar": "/images/avatar1.jpg",
            "name": "自顾",
            "publish_time": "2021.2.21 16:45",
            "level": "5",
            'goods_name': '二手书',
            'price': 20,
            'image': '/images/goods4.jpg',
            "counteroffer": "不可还价"
        }, {
            "avatar": "/images/avatar1.jpg",
            "name": "自顾",
            "publish_time": "2021.2.21 16:45",
            "level": "5",
            'goods_name': '全新手表',
            'price': 120,
            'image': '/images/goods1.jpg',
            "counteroffer": "可还价"
        }, {
            "avatar": "/images/avatar1.jpg",
            "name": "自顾",
            "publish_time": "2021.2.21 16:45",
            "level": "5",
            'goods_name': '九成新手表',
            'price': 30,
            'image': '/images/goods2.jpg',
            "counteroffer": "可还价"
        }, {
            "avatar": "/images/avatar1.jpg",
            "name": "自顾",
            "publish_time": "2021.2.21 16:45",
            "level": "5",
            'goods_name': '通往天堂的路',
            'price': 15,
            'image': '/images/goods2.jpg',
            "counteroffer": "可还价"
        }, {
            "avatar": "/images/avatar1.jpg",
            "name": "自顾",
            "publish_time": "2021.2.21 16:45",
            "level": "5",
            'goods_name': '全新山地自行车',
            'price': 500,
            'image': '/images/goods3.jpg',
            "counteroffer": "可还价"
        }],
        goods_need_list: [{
            "avatar": "/images/avatar1.jpg",
            "name": "自顾",
            "publish_time": "2021.2.21 16:45",
            "level": "5",
            'goods_name': '工程经济与项目管理',
            'min_price': 10,
            'max_price': 10,
            'image': '/images/goods1.jpg'
        }, {
            "avatar": "/images/avatar1.jpg",
            "name": "自顾",
            "publish_time": "2021.2.21 16:45",
            "level": "5",
            'goods_name': '全新山地自行车',
            'min_price': 300,
            'max_price': 600,
            'image': '/images/goods2.jpg'
        }, {
            "avatar": "/images/avatar1.jpg",
            "name": "自顾",
            "publish_time": "2021.2.21 16:45",
            "level": "5",
            'goods_name': '二手书',
            'min_price': 5,
            'max_price': 10,
            'image': '/images/goods3.jpg'
        }, {
            "avatar": "/images/avatar1.jpg",
            "name": "自顾",
            "publish_time": "2021.2.21 16:45",
            "level": "5",
            'goods_name': '二手书',
            'min_price': 5,
            'max_price': 10,
            'image': '/images/goods4.jpg'
        }, {
            "avatar": "/images/avatar1.jpg",
            "name": "自顾",
            "publish_time": "2021.2.21 16:45",
            "level": "5",
            'goods_name': '全新手表',
            'min_price': 20,
            'max_price': 50,
            'image': '/images/goods1.jpg'
        }, {
            "avatar": "/images/avatar1.jpg",
            "name": "自顾",
            "publish_time": "2021.2.21 16:45",
            "level": "5",
            'goods_name': '九成新手表',
            'min_price': 50,
            'max_price': 100,
            'image': '/images/goods3.jpg'
        }, {
            "avatar": "/images/avatar1.jpg",
            "name": "自顾",
            "publish_time": "2021.2.21 16:45",
            "level": "5",
            'goods_name': '电吉他',
            'min_price': 50,
            'max_price': 120,
            'image': '/images/goods2.jpg'
        }, {
            "avatar": "/images/avatar1.jpg",
            "name": "自顾",
            "publish_time": "2021.2.21 16:45",
            "level": "5",
            'goods_name': '通往天堂的路',
            'min_price': 10,
            'max_price': 15,
            'image': '/images/goods4.jpg'
        }]
    },

    // 搜索事件
    bindsearch(e) {
        console.log("搜索")
    },

    // 标题点击事件
    handleTabsItemChange(e) {
        // 获取被点击的标题的索引
        const {
            index
        } = e.detail;
        // 修改原数组
        let {
            tabs
        } = this.data;
        tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
        // 赋值到data中
        this.setData({
            tabs
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