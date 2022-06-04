// pages/reportResult/reportResult.js
const {
    cloudRequest,
    tips,
    formatTime,
    cloudDeleteImage
} = require("../../utils/util")

Page({

    /**
     * 页面的初始数据
     */
    data: {
        reportList: [],
        pageNumber: 1,
        pageSize: 10,
        isBottom: false,
    },

    getReportList(showLoading = false) {
        var that = this;
        cloudRequest({
            name: "getAppointList",
            data: {
                module: "reportList",
                pageNumber: that.data.pageNumber,
                pageSize: that.data.pageSize
            }
        }, showLoading).then(res => {
            let reportList = res.result.list;
            reportList.forEach(element => {
                element.publish_time = formatTime(element.publish_time);
            });
            that.setData({
                reportList: [...that.data.reportList, ...reportList],
                isBottom: res.result.list.length < that.data.pageSize ? true : false
            })
        })
    },

    gotoWallDetail(e) {
        let wallType = e.currentTarget.dataset.walltype;
        let messageId = e.currentTarget.dataset.messageid;
        let isDispose = e.currentTarget.dataset.isdispose;
        if (isDispose != 1) { //如果消息未被删除才能导航
            if (wallType == 0) {
                wx.navigateTo({
                    url: '../vindicateWallDetail/vindicateWallDetail?_id=' + messageId,
                })
            } else if (wallType == 1) {
                wx.navigateTo({
                    url: '../opnionWallDetail/opnionWallDetail?_id=' + messageId,
                })
            } else if (wallType == 2) {
                wx.navigateTo({
                    url: '../secondWallDetail/secondWallDetail?_id=' + messageId,
                })
            } else if (wallType == 3) {
                wx.navigateTo({
                    url: '../lostfindWallDetail/lostfindWallDetail?_id=' + messageId,
                })
            }
        }
    },

    deleteReportedMessage(e) {
        var that = this;
        let wallType = e.currentTarget.dataset.walltype;
        let messageId = e.currentTarget.dataset.messageid;
        let type = e.currentTarget.dataset.type; //0:删除发布；1：驳回举报，不删除发布
        cloudRequest({
            name: "updateLook",
            data: {
                module: "reportDispose",
                messageId: messageId,
                isDispose: type
            }
        }).then(res => {
            that.data.pageNumber = 1;
            that.data.reportList = [];
            that.getReportList();
            if (type == 1) { //删除发布
                let modules = ['vindicate_opnionMessage', 'vindicate_opnionMessage', 'secondhandMessage', 'lostfindMessage']
                cloudRequest({ //查询图片路径
                    name: "wallsFunction",
                    data: {
                        module: modules[wallType],
                        action: "getById",
                        params: {
                            _id: messageId
                        }
                    }
                }).then(res => {
                    let imagesPath = res.result.list[0].images_content;
                    cloudRequest({
                        name: "wallsFunction",
                        data: {
                            module: modules[wallType],
                            action: "delete",
                            params: {
                                _id: messageId
                            }
                        }
                    }).then(res => {
                        // 删除图片
                        cloudDeleteImage(imagesPath)
                    })
                })
            }
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.getReportList();
        cloudRequest({
            name: "updateLook",
            data: {
                module: "reportLooked"
            }
        }, false)
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {
        if (!this.data.isBottom) {
            this.data.pageNumber++;
            this.getReplyList(true);
        } else {
            tips('到底啦！')
        }
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})