import {
    cloudRequest,
    formatTime,
    getAstro,
    getLevel,
    tips,
} from '../../utils/util.js'
Page({
    /**
     * 页面的初始数据
     */
    data: {
        user_id: "",
        user: {},

        //是否有我的日常
        hasDaily: false,
        //我的日常列表
        dailyList: [],
        type: ['表白墙', '食堂意见墙', '二手交易墙', '失物招领墙', ]
    },

    // 获取用户信息
    getUserInfo() {
        var that = this;
        cloudRequest({
            name: 'checkUser',
            data: {
                user_id: that.data.user_id
            },
        }).then(res => {
            if (res.result.errCode == 0) {
                let userInfo = res.result.data.user;
                userInfo.level = getLevel(userInfo.experienceValue); //通过经验值获取等级
                userInfo.constellation = getAstro(userInfo.birthday); //通过生日获取星座
                userInfo.date = that.countDown(userInfo.signTime); //通过注册时间获取已加入天数
                that.setData({
                    user: userInfo
                })
            } else {
                tips("出错了", 2000, "error");
            }
        })
    },

    // 获取已加入天数
    countDown: function (time) {
        //1 当前总毫秒
        var nowTime = +new Date(); //返回的是当前时间总的毫秒数
        //2 2022年元旦的总毫秒
        var inputTime = +new Date(time); //返回得是用户输入时间总的毫秒数
        // 3 剩余总毫秒
        var times = nowTime - inputTime; //times是剩余时间总的毫秒数
        // 4 毫秒转为秒-除1000
        times /= 1000;
        // 5 秒数转为天时分秒 公式如下：
        //计算天（秒数/60/60/24）
        var d = Math.floor(times / 60 / 60 / 24);
        return d + 1;
    },

    // 获取用户的发布信息
    getItsMessages() {
        var that = this;
        cloudRequest({
            name: 'checkAllMineMessage',
            data: {
                user_id: that.data.user_id
            },
        }).then(res => {
            console.log(res)
            if (res.result.errCode == 0) {
                let message = res.result.data.message;
                message.forEach(element => {
                    element.publish_time = formatTime(element.publish_time)
                });
                that.setData({
                    hasDaily: true,
                    dailyList: message
                })
            } else if (res.result.errCode == 3) {
                that.setData({
                    hasDaily: false,
                })
            } else {
                tips("出错了~", 2000, "error")
            }
        })
    },

    // 导航到消息详情页
    navigateToWallDetail(e) {
        var message_id = e.currentTarget.dataset.messageid;
        var wall_type = e.currentTarget.dataset.walltype;
        if (wall_type == 0) { //表白墙
            wx.navigateTo({
                url: '../../pages/vindicateWallDetail/vindicateWallDetail?_id=' + message_id,
            })
        } else if (wall_type == 1) { //食堂意见墙
            wx.navigateTo({
                url: '../../pages/opnionWallDetail/opnionWallDetail?_id=' + message_id,
            })
        } else if (wall_type == 2) { //二手交易墙
            wx.navigateTo({
                url: '../../pages/secondWallDetail/secondWallDetail?_id=' + message_id,
            })
        } else if (wall_type == 3) { //失物招领墙
            wx.navigateTo({
                url: '../../pages/lostfindWallDetail/lostfindWallDetail?_id=' + message_id,
            })
        }
    },

    redirectTosixin: function () {
        if (getApp().globalData.userInfo == null) {
            tips("请先登录哦~");
            return;
        }
        var that = this;
        wx.navigateTo({
            url: '/pages/talk/talk?userId=' + that.data.user_id,
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.data.user_id = options.user_id;
        this.getUserInfo();
        this.getItsMessages();
    }
})