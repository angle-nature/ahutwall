// pages/contact/contact.js
import {
    cloudRequest,
    cloudUploadImage,
    cloudDeleteImage,
    tips,
    formatTime
} from '../../utils/util.js'
const app = getApp();

/**
 * 初始化数据
 */
Page({
    /**
     * 页面的初始数据
     */
    data: {
        userId: "",
        openId: "",
        content: "",
        watch: {},
        messageList: [],
        toView: 'msg_0',
        textareaHeight: 20,
        keybordHeight: 0,
        leftUserInfo: {},
        rightAvatar: app.globalData.userInfo.avatarUrl,
        showMaskLayer: false,
        index: 0,
        animationData: {}
    },

    // 输入评论
    bindCommentInput: function (e) {
        this.setData({
            content: e.detail.value
        })
    },

    getKeybordHeight(e) {
        var that = this;
        let keybordHeight = e.detail.height;
        this.setData({
            keybordHeight: keybordHeight,
        })
        this.setData({
            toView: 'msg_' + (that.data.messageList.length - 1)
        })

        let animation = wx.createAnimation({
            duration: "50",
            timingFunction: "ease",
        })
        animation.translateY(-keybordHeight).step();

        this.setData({
            animationData: animation.export()
        })
    },

    goToBottom(e) {
        var that = this;
        this.setData({
            keybordHeight: 0,
            toView: 'msg_' + (that.data.messageList.length - 1)
        })

        let animation = wx.createAnimation({
            duration: "100",
            timingFunction: "ease",
        })

        animation.translateY(0).step();

        this.setData({
            animationData: animation.export()
        })
    },

    getTextareaHeight(e) {
        var that = this;
        this.setData({
            textareaHeight: e.detail.height,
            toView: 'msg_' + (that.data.messageList.length - 1)
        })
    },

    //加载聊天信息
    loadMessage() {
        var that = this;
        cloudRequest({
            name: "messageList",
            data: {
                userId: this.data.userId
            }
        }, false).then(res => {
            const db = wx.cloud.database();
            const _ = db.command
            var openId = that.data.openId;
            var openId = getApp().globalData.userInfo.openid;
            var userId = that.data.userId;
            db.collection('message')
                .where(_.or([{
                    _openid: openId,
                    userId: userId,
                }, {
                    _openid: userId,
                    userId: openId,
                }]))
                .watch({
                    onChange: (snapshot) => {
                        let messageList = snapshot.docs[0].Message;
                        if (messageList.length != 0) {
                            messageList[0].talkTime = formatTime(messageList[0].createTime);
                            for (let i = 1; i < messageList.length; i++) {
                                //计算时间差
                                let subTime = messageList[i].createTime - messageList[i - 1].createTime;
                                if ((subTime / (1000 * 60)) > 5)
                                    messageList[i].talkTime = formatTime(messageList[i].createTime);
                                else
                                    messageList[i].talkTime = ""
                            }
                        }
                        that.setData({
                            messageList: messageList,
                            toView: 'msg_' + (messageList.length - 1)
                        })
                    },
                    onError: function (err) {
                        console.error('the watch closed because of error', err)
                    }
                })
        })
    },

    //获取聊天对象信息
    loadUserinfo() {
        var that = this;
        cloudRequest({
            name: "checkUser",
            data: {
                user_id: that.data.userId
            }
        }, false).then(res => {
            if (res.result.errCode == 0) {
                let user = res.result.data.user;
                this.setData({
                    leftUserInfo: user
                })
                //设置导航栏标题为 聊天对象昵称
                wx.setNavigationBarTitle({
                    title: user.nickName,
                })
            }
        })
    },

    previewImage: function (e) {
        // 当前图片url
        let currentImageUrl = e.currentTarget.dataset.imagesrc;
        wx.previewImage({
            current: currentImageUrl,
            urls: [currentImageUrl]
        })
    },

    //发送消息
    send(e) {
        var that = this;
        cloudRequest({
            name: "addMessage",
            data: {
                userId: that.data.userId,
                content: that.data.content,
                type: "text"
            }
        }, false).then(res => {
            this.setData({
                content: ""
            })
        })
    },

    //发送图片
    sendImage(e) {
        var that = this;
        wx.chooseImage({
            count: 9,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success(res) {
                const tempFilePath = res.tempFilePaths //本地临时路径
                new Promise((resolve, reject) => {
                    let upImagesId = []; //存储上传至云端后的fileID
                    tempFilePath.forEach(element => {
                        let imageName = element.split('/').pop(); //获取图片名称
                        cloudUploadImage({ // 上传图片到云端存储
                            cloudPath: "chat/" + that.data.openId + "/" + imageName, // 在云端的路径
                            tempPath: element // 本地临时路径
                        }, true).then(res => {
                            upImagesId.push(res.fileID)
                            if (upImagesId.length == tempFilePath.length) {
                                resolve(upImagesId)
                            }
                        }).catch(err => {
                            if (upImagesId.length == tempFilePath.length) {
                                reject("出错了！！")
                            }
                        })
                    });
                }).then(res => {
                    res.forEach(imageID => {
                        cloudRequest({
                            name: "addMessage",
                            data: {
                                userId: that.data.userId,
                                content: imageID,
                                type: "image"
                            }
                        }, true, "发送中")
                    })
                }).catch(err => {
                    console.log(err)
                })
            },
            complete: (res) => {
                that.goToBottom()
            }
        })
    },

    showBox(e) {
        let index = e.currentTarget.dataset.index;
        let showBox = "messageList[" + index + "].showBox";
        this.setData({
            [showBox]: true,
            showMaskLayer: true,
            index: index
        })
    },

    hideBox(e) {
        let showBox = "messageList[" + this.data.index + "].showBox";
        this.setData({
            [showBox]: false,
            showMaskLayer: false
        })
    },

    //复制文本内容
    copyMessage(e) {
        var that = this;
        let content = e.currentTarget.dataset.content;
        wx.setClipboardData({
            data: content,
            success: function () {
                that.hideBox();
                tips("已复制");
            }
        })
    },

    //撤回消息
    deleteMessage(e) {
        var that = this;
        const db = wx.cloud.database()
        const _ = db.command
        let content = e.currentTarget.dataset.content; //根据content匹配删除Message数组指定元素
        let type = e.currentTarget.dataset.type; //如果是删除的图片还需将存储中的图片删除
        var userId = this.data.userId;
        cloudRequest({
            name: "deleteMessage",
            data: {
                userId: userId,
                content: content
            }
        }, true, "撤回中").then(res => {
            that.setData({
                showMaskLayer: false
            })
            if (type == "image") {
                cloudDeleteImage([content], false)
            }
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            userId: options.userId,
            openId: app.globalData.userInfo.openid,
        });
        this.loadMessage()
        this.loadUserinfo()
        let that = this;
        setTimeout(function () {
            that.setData({
                toView: 'msg_' + (that.data.messageList.length - 1)
            })
        }, 800)
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

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