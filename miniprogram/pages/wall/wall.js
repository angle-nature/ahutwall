// pages/publish/publish.js
import {
    tips,
    cloudRequest,
    getLevel,
    getAstro
} from '../../utils/util.js'
const app = getApp()
Page({
    /**
     * 页面的初始数据
     */
    data: {
        AHUT_images: [
            '../../images/AHUT1.jpeg',
            '../../images/AHUT2.jpeg',
            '../../images/AHUT4.jpeg',
        ],
        animationData: {},
        animationData1: {},
        animationData2: {},
        animationData3: {},
        animationData4: {},
        animationStatus: false //false 表示关闭，true 表示展开
    },

    // 弹出发布菜单
    popMenu(e) {
        var animation = wx.createAnimation({
            duration: "200",
            timingFunction: "ease"
        })

        var animation1 = wx.createAnimation({
            duration: "400",
            timingFunction: "ease"
        })

        var animation2 = wx.createAnimation({
            duration: "400",
            timingFunction: "ease"
        })

        var animation3 = wx.createAnimation({
            duration: "400",
            timingFunction: "ease"
        })

        var animation4 = wx.createAnimation({
            duration: "400",
            timingFunction: "ease"
        })

        let realWidth = wx.getSystemInfoSync().windowWidth;
        let proportion = realWidth / 750;
        if (!this.data.animationStatus) {
            // animation.rotate(-180).step();
            animation.scale(0.95).step();
            animation1.translateX(-400 * proportion).opacity(1).step();
            animation2.translate(-300 * proportion, 0).opacity(1).step();
            animation3.translate(-200 * proportion, 0).opacity(1).step();
            animation4.translateX(-100 * proportion).opacity(1).step();
        } else {
            // animation.rotate(0).step();
            animation.scale(1).step();
            animation1.translateX(0).rotate(0).opacity(0).step();
            animation2.translate(0, 0).rotate(0).opacity(0).step();
            animation3.translate(0, 0).rotate(0).opacity(0).step();
            animation4.translateY(0).rotate(0).opacity(0).step();
        }

        this.setData({
            animationData: animation.export(),
            animationData1: animation1.export(),
            animationData2: animation2.export(),
            animationData3: animation3.export(),
            animationData4: animation4.export(),
            animationStatus: !this.data.animationStatus
        })
    },

    navigateToWall: function (e) {
        let type = e.currentTarget.dataset.type;
        let url = "";
        if (type == 0) {
            url = "/pages/vindicateWall/vindicateWall"
        } else if (type == 1) {
            url = "/pages/secondhandWall/secondhandWall"
        } else if (type == 2) {
            url = "/pages/lostfindWall/lostfindWall"
        } else if (type == 3) {
            url = "/pages/opinionWall/opinionWall"
        }
        wx.navigateTo({
            url: url,
        })
    },

    initUser() {
        var that = this;
        cloudRequest({
            name: 'checkUser',
            data: {},
        }, false).then(res => {
            if (res.result.errCode == 0) {
                that.data.user = res.result.data.user
                app.globalData.hasUserInfo = true
                app.globalData.userInfo = res.result.data.user
                var bir = res.result.data.user.birthday.toString()
                app.globalData.userInfo.birthday = bir.substr(0, 10)
                var constellation = getAstro(res.result.data.user.birthday)
                var level = getLevel(res.result.data.user.experienceValue)
                app.globalData.userInfo.constellation = constellation
                app.globalData.userInfo.level = level;
            } else if (res.result.errCode == 2) {
                //该用户尚未注册-->获取头像和昵称跳转至引导页
                console.log("该用户尚未注册")
            } else {
                tips("出错了", 2000, "error")
            }
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.initUser();
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {},

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {
        if (this.data.animationStatus) {
            this.popMenu();
        }
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