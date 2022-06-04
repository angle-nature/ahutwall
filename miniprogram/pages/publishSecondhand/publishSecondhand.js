// pages/publishSecondhand/publishSecondhand.js
import {
    tips,
    cloudRequest,
    cloudUploadImage,
    isNull,
    confirm
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
        images: [],
        type: 0, //发布类型
        content: "", //文本内容
        goods_name: "", //商品名称
        price: "", //出售价格
        max_price: "", //预期最高价格
        min_price: "" //预期最低价格
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
            price: "",
            max_price: "",
            min_price: ""
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

    // 价格输入
    bindInputPrice(e) {
        this.data.price = e.detail.value;
    },

    // 最高价格输入
    bindInputMaxPrice(e) {
        this.data.max_price = e.detail.value;
    },

    // 最低价格输入
    bindInputMinPrice(e) {
        this.data.min_price = e.detail.value;
    },

    // 提交发布
    bindsumbit(e) {
        if (getApp().globalData.userInfo == null) {
            tips("请先登录哦~");
            return;
        }
        let that = this;
        var priceReg = /^[1-9][0-9]{0,8}(.[0-9]{1,2})?$/ //价格正则表达式
        if (isNull(this.data.content)) {
            tips("发布内容不能为空！")
        } else if (isNull(this.data.goods_name)) {
            tips("商品名称不能为空！")
        } else if (this.data.type == 0 && isNull(this.data.price)) {
            tips("价格不能为空！")
        } else if (this.data.type == 0 && !priceReg.test(that.data.price)) {
            tips("请填写正确的价格！至多精确到两位小数")
        } else if (this.data.type == 1 && (isNull(this.data.max_price) || isNull(this.data.min_price))) {
            tips("价格不能为空！")
        } else if (this.data.type == 1 && (!priceReg.test(that.data.max_price) || !priceReg.test(that.data.min_price))) {
            tips("请填写正确的价格！至多精确到两位小数")
        } else if (this.data.type == 1 && (parseFloat(that.data.max_price) < parseFloat(that.data.min_price))) {
            tips("预期最高价格小于最低价格！")
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
            },true,"内容检测中").then(res => {
                if (res.result.result.label == 100) {
                    // 获取当前时间戳
                    let timestamp = Date.parse(new Date());
                    let upImagesId = []; // 存放上传到云端后的图片fileID
                    new Promise((resolve, reject) => {
                        this.data.images.forEach(element => {
                            let imageName = element.split('/').pop(); //获取图片名称
                            cloudUploadImage({ // 上传图片到云端存储
                                cloudPath: "secondhandwallImages/" + imageName, // 在云端的路径
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
                        let tempParams = {}
                        if (that.data.type == 0) {
                            tempParams = {
                                publish_time: timestamp, //发布时间戳
                                text_content: that.data.content, //文本内容
                                images_content: upImagesId, //云端图片文件ID
                                goods_name: that.data.goods_name, //商品名称
                                price: that.data.price, //出售价格
                                collect_number: 0, //收藏数
                                kind: 0, // 发布类型-出售
                                type: 2 //墙类型
                            }
                        } else if (that.data.type == 1) {
                            tempParams = {
                                publish_time: timestamp, //发布时间戳
                                text_content: that.data.content, //文本内容
                                images_content: upImagesId, //云端图片文件ID
                                goods_name: that.data.goods_name, //商品名称
                                max_price: that.data.max_price, //预期最高价格
                                min_price: that.data.min_price, //预期最低价格
                                collect_number: 0, //收藏数
                                kind: 1, // 发布类型-求购
                                type: 2 //墙类型
                            }
                        }
                        cloudRequest({
                            name: "wallsFunction",
                            data: {
                                module: "secondhandMessage", //对二手交易墙进行操作
                                action: "add", //进行增加操作
                                params: tempParams
                            }
                        },true,"发布中").then(res => {
                            tips("发布成功", 1000, "success").then(res => {
                                setTimeout(function () {
                                    wx.redirectTo({
                                        url: '../secondhandWall/secondhandWall',
                                    })
                                }, 1000)
                            });
                        })
                    })
                } else {
                    confirm("包含违规文字信息，请修改后发布", false);
                }
            })
        }
    }
})