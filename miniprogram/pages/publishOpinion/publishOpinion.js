const {
    tips,
    confirm,
    cloudRequest,
    cloudUploadImage,
    isNull
} = require("../../utils/util");
// pages/publishOpinion/publishOpinion.js
Page({
    /**
     * 页面的初始数据
     */
    data: {
        images: [],
        canteens: ['所有食堂', '一食堂', '三食堂', '四食堂', '五食堂', '六食堂', '八食堂', '九食堂', '东苑餐厅', '西苑餐厅', '民族餐厅', '研究生食堂'],
        index: 0,
        content: "", // 文本内容
        mark: "", // 评分
        selectedStatus: false, // 控制picker组件字体颜色
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

    // 选择食堂
    selectCanteen: function (e) {
        this.setData({
            index: e.detail.value,
            selectedStatus: true
        })
    },

    // 文本内容输入
    bindInputContent(e) {
        this.data.content = e.detail.value
    },

    // 评分输入
    bindInputMark(e) {
        this.setData({
            mark: e.detail.value
        })
    },

    // 提交发布
    bindsumbit(e) {
        if (getApp().globalData.userInfo == null) {
            tips("请先登录哦~");
            return;
        }
        let that = this;
        var markReg = /^[0-5](.[0-9])?$/ //评分正则表达式
        if (isNull(this.data.content)) {
            tips("发布内容不能为空！")
        } else if (isNull(this.data.mark)) {
            tips("评分不能为空！")
        } else if (!markReg.test(that.data.mark)) {
            tips("请输入正确的评分 0.0-5.0")
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
                    let canteen = that.data.index == 0 ? null : that.data.canteens[that.data.index]
                    // 获取当前时间戳
                    let timestamp = Date.parse(new Date());
                    let upImagesId = []; // 存放上传到云端后的图片fileID
                    if (that.data.images.length != 0) { //若有图片
                        new Promise((resolve, reject) => {
                            this.data.images.forEach(element => {
                                let imageName = element.split('/').pop(); //获取图片名称
                                cloudUploadImage({ // 上传图片到云端存储
                                    cloudPath: "opinionwallImages/" + imageName, // 在云端的路径
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
                                    module: "vindicate_opnionMessage", //对表白墙进行操作
                                    action: "add", //进行增加操作
                                    params: {
                                        publish_time: timestamp, //发布时间戳
                                        text_content: that.data.content, //文本内容
                                        images_content: upImagesId, //云端图片文件ID
                                        canteen: canteen, //食堂
                                        mark: that.data.mark, //评分
                                        like_number: 0, //点赞数
                                        collect_number: 0, //收藏数
                                        comment_number: 0, //评论数
                                        type: 1, // 墙类型
                                    }
                                }
                            }, true, "发布中").then(res => {
                                tips("发布成功", 1000, "success").then(res => {
                                    setTimeout(function () {
                                        wx.redirectTo({
                                            url: '../opinionWall/opinionWall',
                                        })
                                    }, 1000)
                                });
                            })
                        })
                    } else { //若无图片
                        cloudRequest({
                            name: "wallsFunction",
                            data: {
                                module: "vindicate_opnionMessage", //对食堂意见墙进行操作
                                action: "add", //进行增加操作
                                params: {
                                    publish_time: timestamp, //发布时间戳
                                    text_content: that.data.content, //文本内容
                                    images_content: upImagesId, //云端图片文件ID
                                    canteen: canteen, //食堂
                                    mark: that.data.mark, //评分
                                    like_number: 0, //点赞数
                                    collect_number: 0, //收藏数
                                    comment_number: 0, //评论数
                                    type: 1, // 墙类型
                                }
                            }
                        }, true, "发布中").then(res => {
                            tips("发布成功", 1000, "success").then(res => {
                                setTimeout(function () {
                                    wx.redirectTo({
                                        url: '../opinionWall/opinionWall',
                                    })
                                }, 1000)
                            });
                        })
                    }
                } else {
                    confirm("包含违规文字信息，请修改后发布", false);
                }
            })


        }
    }
})