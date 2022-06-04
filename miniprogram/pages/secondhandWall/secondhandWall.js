// pages/secondhandWall/secondhandWall.js
import {
    tips,
    cloudRequest,
    formatTime,
    getLevel
} from '../../utils/util.js'
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
        messages: [],
        isBottom: false,
        isTounchedBottom: false,
        searchKey: "" //搜索关键词
    },

    params: {
        pageSize: 10,
        pageNumber: 1,
        kind: 0 // 出售/求购
    },

    // 搜索事件
    bindsearch(e) {
        this.data.messages = []; //先清空
        this.data.searchKey = e.detail.searchKey;
        this.getMessages();
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
            tabs,
            messages: [],
            isTounchedBottom: false
        })
        this.params.kind = index;
        this.getMessages();
    },

    getMessages() {
        var that = this;
        cloudRequest({
            name: "wallsFunction",
            data: {
                module: "secondhandMessage",
                action: "get",
                params: {
                    ...that.params,
                    searchKey: that.data.searchKey
                }
            }
        }).then(res => {
            let messages = res.result.list;
            messages.forEach(element => {
                element.publish_time = formatTime(element.publish_time) //将时间戳转换为日期格式
                element.userInfo[0].level = getLevel(element.userInfo[0].experienceValue) //将经验值转换为等级
            });
            if (messages.length < that.params.pageSize) {
                this.setData({
                    isBottom: true,
                    messages: [...that.data.messages, ...messages]
                })
            } else {
                this.setData({
                    messages: [...that.data.messages, ...messages]
                })
            }
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getMessages();
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        this.data.messages = []
        this.params.pageNumber = 1;
        this.setData({
            searchKey: ""
        })
        this.getMessages()
        wx.stopPullDownRefresh()
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        this.setData({
            isTounchedBottom: true
        })
        if (!this.data.isBottom) {
            this.params.pageNumber++;
            this.getMessages()
        }
    }
})