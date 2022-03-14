// pages/lostfindWall/lostfindWall.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        tabs: [{
                id: 0,
                value: "找回",
                isActive: true
            },
            {
                id: 1,
                value: "归还",
                isActive: false
            }
        ],
        lost_goods: [{
            "avatar": "/images/avatar1.jpg",
            "name": "自顾",
            "publish_time": "2021.2.21 16:45",
            "level": "5",
            'goods_name':'学生卡',
            'image':'/images/goods1.jpg',
            'lost_place':'图书馆至G3宿舍楼的路上',
            'lost_time':'3月2日 12点左右',
            'detail':'中午回寝室的时候丢的，这对我来说真的很重要，希望捡到的同学能联系我，定有重谢哦史蒂夫纳什的念佛能否从i都市农夫你的发送就没法送佛那是烦恼是弄·1能打死哦那佛纳送的妇女·1阿斯顿次哦农夫的·'
        },{
            "avatar": "/images/avatar1.jpg",
            "name": "自顾",
            "publish_time": "2021.2.21 16:45",
            "level": "5",
            'goods_name':'学生卡',
            'image':'/images/goods2.jpg',
            'lost_place':'图书馆至G3宿舍楼的路上',
            'lost_time':'3月2日 12点左右',
            'detail':'中午回寝室的时候丢的，这对我来说真的很重要，希望捡到的同学能联系我，定有重谢'
        },{
            "avatar": "/images/avatar1.jpg",
            "name": "自顾",
            "publish_time": "2021.2.21 16:45",
            "level": "5",
            'goods_name':'学生卡',
            'image':'/images/goods3.jpg',
            'lost_place':'图书馆至G3宿舍楼的路上',
            'lost_time':'3月2日 12点左右',
            'detail':'中午回寝室的时候丢的，这对我来说真的很重要，希望捡到的同学能联系我，定有重谢'
        },{
            "avatar": "/images/avatar1.jpg",
            "name": "自顾",
            "publish_time": "2021.2.21 16:45",
            "level": "5",
            'goods_name':'学生卡',
            'image':'/images/goods2.jpg',
            'lost_place':'图书馆至G3宿舍楼的路上',
            'lost_time':'3月2日 12点左右',
            'detail':'中午回寝室的时候丢的，这对我来说真的很重要，希望捡到的同学能联系我，定有重谢'
        },{
            "avatar": "/images/avatar1.jpg",
            "name": "自顾",
            "publish_time": "2021.2.21 16:45",
            "level": "5",
            'goods_name':'学生卡',
            'image':'/images/goods4.jpg',
            'lost_place':'图书馆至G3宿舍楼的路上',
            'lost_time':'3月2日 12点左右',
            'detail':'中午回寝室的时候丢的，这对我来说真的很重要，希望捡到的同学能联系我，定有重谢'
        },{
            "avatar": "/images/avatar1.jpg",
            "name": "自顾",
            "publish_time": "2021.2.21 16:45",
            "level": "5",
            'goods_name':'学生卡',
            'image':'/images/goods2.jpg',
            'lost_place':'图书馆至G3宿舍楼的路上',
            'lost_time':'3月2日 12点左右',
            'detail':'中午回寝室的时候丢的，这对我来说真的很重要，希望捡到的同学能联系我，定有重谢'
        },{
            "avatar": "/images/avatar1.jpg",
            "name": "自顾",
            "publish_time": "2021.2.21 16:45",
            "level": "5",
            'goods_name':'学生卡',
            'image':'/images/goods1.jpg',
            'lost_place':'图书馆至G3宿舍楼的路上',
            'lost_time':'3月2日 12点左右',
            'detail':'中午回寝室的时候丢的，这对我来说真的很重要，希望捡到的同学能联系我，定有重谢'
        }],
    },

    // 搜索事件
    bindsearch(e){
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