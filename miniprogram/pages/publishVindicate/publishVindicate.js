// pages/publish/publish.js
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
        usedNumber: 0,
        images: [],
        content: "",
        maxContentLength: 1000, //文本框最大输入字数
    },

    // 选取图片
    uploadImage(e) {
        var that = this;
        const maxImageNumber = 9;
        wx.chooseImage({
            count: maxImageNumber, //选取一张图片
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success(res) {
                const tempFilePaths = res.tempFilePaths
                if (that.data.images.length + tempFilePaths.length > maxImageNumber) {
                    wx.showModal({
                        content: "最多上传" + maxImageNumber + "张图片！"
                    })
                } else {
                    //进行图片安全检测
                    tempFilePaths.forEach(element => {
                        cloudRequest({
                            name: "securityCheck",
                            data: {
                                type: 1, //检测图片
                                params: {
                                    imageUrl: element
                                }
                            }
                        }, true, "图片检测中").then(res => {
                            console.log(res)
                            if (res.result.errCode == 0) { //图片内容正常
                                that.setData({
                                    images: [...that.data.images, element]
                                })
                            } else {
                                confirm("图片包含敏感信息！不予上传");
                            }
                        })
                    });
                }
            }
        })
    },

    // 预览大图
    previewImage(e) {
        var that = this;
        let imageurl = e.currentTarget.dataset.imageurl;
        wx.previewImage({
            urls: that.data.images,
            current: imageurl,
        })
    },

    // 删除图片
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

    // 输入文本
    bindinput(e) {
        var text = e.detail.value
        var number = text.length <= this.data.maxContentLength ? text.length : this.data.maxContentLength;
        this.setData({
            content: text,
            usedNumber: number
        })
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
                if (res.result.result.label == 100) { //通过
                    //获取当前时间戳
                    let timestamp = Date.parse(new Date());
                    let upImagesId = []; // 存放上传到云端后的图片fileID
                    if (that.data.images.length != 0) {
                        new Promise((resolve, reject) => {
                            this.data.images.forEach(element => {
                                let imageName = element.split('/').pop(); //获取图片名称
                                cloudUploadImage({ // 上传图片到云端存储
                                    cloudPath: "vindicatewallImages/" + imageName, // 在云端的路径
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
                                        like_number: 0, //点赞数
                                        collect_number: 0, //收藏数
                                        comment_number: 0, //评论数
                                        type: 0, // 墙类型
                                    }
                                }
                            }, true, "发布中").then(res => {
                                tips("发布成功", 1000, "success").then(res => {
                                    setTimeout(function () {
                                        wx.redirectTo({
                                            url: '../vindicateWall/vindicateWall',
                                        })
                                    }, 1000)
                                });
                            })
                        })
                    } else {
                        cloudRequest({
                            name: "wallsFunction",
                            data: {
                                module: "vindicate_opnionMessage", //对表白墙进行操作
                                action: "add", //进行增加操作
                                params: {
                                    publish_time: timestamp, //发布时间戳
                                    text_content: that.data.content, //文本内容
                                    images_content: upImagesId, //云端图片文件ID
                                    like_number: 0, //点赞数
                                    collect_number: 0, //收藏数
                                    comment_number: 0, //评论数
                                    type: 0, // 墙类型
                                }
                            }
                        }, true, "发布中").then(res => {
                            tips("发布成功", 1000, "success").then(res => {
                                setTimeout(function () {
                                    wx.redirectTo({
                                        url: '../vindicateWall/vindicateWall',
                                    })
                                }, 1000)
                            });
                        })
                    }
                } else { //不通过
                    confirm("包含违规文字信息，请修改后发布", false);
                }
            })
        }
    }
})