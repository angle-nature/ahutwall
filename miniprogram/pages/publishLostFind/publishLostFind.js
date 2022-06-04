// pages/publishLostFind/publishLostFind.js
import {
    tips,
    confirm,
    cloudRequest,
    cloudUploadImage,
    isNull
} from '../../utils/util.js'
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
        images: [],
        content: "", //文本内容
        goods_name: "", //物品名称
        lost_time: "", // 丢失/拾取时间
        lost_place: "", // 丢失/拾取地点
        type: 0 //发布类型 找回/归还
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
            type: index,
            content: "",
            goods_name: "",
            lost_time: "",
            lost_place: ""
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

    // 文本内容输入
    bindInputContent(e) {
        this.data.content = e.detail.value;
    },

    // 商品名称输入
    bindInputGoodsName(e) {
        this.data.goods_name = e.detail.value;
    },

    // 商品名称输入
    bindInputLostTime(e) {
        this.data.lost_time = e.detail.value;
    }, // 商品名称输入

    bindInputLostPlace(e) {
        this.data.lost_place = e.detail.value;
    },

    // 提交发布
    bindsumbit(e) {
        if (getApp().globalData.userInfo == null) {
            tips("请先登录哦~");
            return;
        }
        let that = this;
        if (isNull(this.data.content)) {
            tips("发布内容不能为空！")
        } else if (isNull(this.data.goods_name)) {
            tips("物品名称不能为空！")
        } else if (this.data.type == 0 && isNull(this.data.lost_time)) {
            tips("丢失时间不能为空！")
        } else if (this.data.type == 0 && isNull(this.data.lost_place)) {
            tips("丢失地点不能为空！")
        } else if (this.data.type == 1 && isNull(this.data.lost_time)) {
            tips("拾取时间不能为空！")
        } else if (this.data.type == 1 && isNull(this.data.lost_place)) {
            tips("拾取地点不能为空！")
        } else if (this.data.images.length == 0) {
            tips("请上传至少一张图片！")
        } else {
            cloudRequest({
                name: "securityCheck",
                data: {
                    type: 0, //检测文本
                    params: {
                        scene: 3,
                        content: that.data.content
                    }
                }
            }, true, "内容检测中").then(res => {
                if (res.result.result.label == 100) {
                    // 获取当前时间戳
                    let timestamp = Date.parse(new Date());
                    let upImagesId = []; // 存放上传到云端后的图片fileID
                    new Promise((resolve, reject) => {
                        this.data.images.forEach(element => {
                            let imageName = element.split('/').pop(); //获取图片名称
                            cloudUploadImage({ // 上传图片到云端存储
                                cloudPath: "lostfindwallImages/" + imageName, // 在云端的路径
                                tempPath: element // 本地临时路径
                            }).then(res => {
                                upImagesId.push(res.fileID)
                                if (upImagesId.length == that.data.images.length) {
                                    resolve(res)
                                }
                            }).catch(err => {
                                if (upImagesId.length == that.data.images.length) {
                                    reject(res)
                                }
                            })
                        });
                    }).then(res => {
                        cloudRequest({
                            name: "wallsFunction",
                            data: {
                                module: "lostfindMessage", //对失物招领墙进行操作
                                action: "add", //进行增加操作
                                params: {
                                    publish_time: timestamp, //发布时间戳
                                    text_content: that.data.content, //文本内容
                                    images_content: upImagesId, //云端图片文件ID
                                    goods_name: that.data.goods_name, //物品名称
                                    lost_time: that.data.lost_time, //丢失/拾取时间
                                    lost_place: that.data.lost_place, //丢失/拾取地点
                                    collect_number: 0, //收藏数
                                    kind: that.data.type, // 发布类型-找回/归还
                                    type: 3 //墙类型
                                }
                            }
                        }, true, "发布中").then(res => {
                            tips("发布成功", 1000, "success").then(res => {
                                setTimeout(function () {
                                    wx.redirectTo({
                                        url: '../lostfindWall/lostfindWall',
                                    })
                                }, 1000)
                            })
                        })
                    })
                } else {
                    confirm("包含违规文字信息，请修改后发布", false);
                }
            })
        }
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