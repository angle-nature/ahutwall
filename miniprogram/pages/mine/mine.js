import {
    tips,
    cloudRequest,
    cloudDeleteImage,
    formatTime,
    getAstro,
    getLevel
} from '../../utils/util.js'
const app = getApp()

Page({
    /**
     * 页面的初始数据
     */
    data: {
        user: {
            "avatarUrl": "../../images/default_avatar.png",
            "level": "0",
            "nickName": "点击头像登录",
            "constellation": "魔羯座",
            "liked_number": 0,
            "commented_number": 0,
            "introduction": "登录后即可解锁更多功能哦~",
            "signDate": 0
        },
        isDaily: true,
        isStep: false,
        isCollect: false,

        //三个选项点击后的style
        clickStyle: "font-size: 30rpx;border-bottom:10rpx  solid  #86BC9C;",
        //未点击的style
        unClickStyle: "font-size: 27rpx;border-bottom:none;",

        //赞/收藏  标题点击样式
        clickTitleStyle: "background-color:#fff;box-shadow: 3rpx 3rpx 10rpx 3rpx rgba(0, 0, 0, 0.1); height:40rpx",
        //未点击的style
        unClickTitleStyle: "background-color:transparent",
        //四种墙标题是否点击
        isLoveCollect: true,
        isSecondHandCollect: false,
        isLostAndFoundCollect: false,
        isCanteenCommentCollect: false,

        // 日常数据
        dailyList: [],

        //四种墙类别
        type: ['表白墙', '食堂意见墙', '二手交易墙', '失物招领墙', ],
        //是否有我的日常
        hasDaily: true,
        //步数是否授权
        isAuthorizeWeRun: false,
        //过去一个月步数
        stepInfoList: [],
        //最新步数、平均步数、最大步数
        newStep: 0,
        avgStep: 0,
        maxStep: 10000,

        //是否有表白墙收藏
        hasLoveCollect: false,
        //表白墙收藏
        loveCollectList: [],

        //是否有食堂意见墙墙收藏
        hasCanteenCommentCollect: false,
        //食堂意见墙收藏
        canteenCommentCollectList: [],

        //是否有失物招领墙收藏
        hasLostCollect: false,
        //失物招领墙收藏
        lostCollectList: [],

        //是否有二手交易墙收藏
        hasSecondCollect: false,
        //二手交易墙收藏
        secondCollectList: [],

        startX: '',
        startY: '',

        walls: ['vindicate_opnionMessage', 'vindicate_opnionMessage', 'secondhandMessage', 'lostfindMessage'],
        showRoseChart: true,
        roseChart: {
            onInit: () => {}
        }
    },

    onInitChart(F2, config, data) {
        // Step 1: 创建 Chart 对象
        const chart = new F2.Chart(config);
        var that = this;
        // Step 2: 载入数据源
        chart.source(data, {
            step: {
                tickCount: 10, // 坐标轴上刻度点的个数
                min: 0, // 手动指定value字段最小值
                max: that.data.maxStep // 手动指定value字段最大值
            },
            timestamp: {
                type: 'timeCat', // 指定date字段为时间类型
                range: [0, 0.9], // 占x轴90%
                tickCount: 3 // 坐标轴上刻度点的个数
            }
        });

        // Step 3:使用图形语法进行图表的绘制
        // 注意：f2是移动端图表库，只有在移动端才能显示图例
        chart.tooltip({
            custom: true, // 是否自定义 tooltip 提示框
            showXTip: true, // 是否展示 X 轴的辅助信息
            showYTip: true, // 是否展示 Y 轴的辅助信息
            snap: true, // 是否将辅助线准确定位至数据点
            crosshairsType: 'xy', // 辅助线的种类
            crosshairsStyle: { // 配置辅助线的样式
                lineDash: [2], // 点线的密度
                stroke: 'rgba(255, 0, 0, 0.25)',
                lineWidth: 2
            }
        });

        // 坐标轴配置（此处是为date对应的坐标轴进行配置）
        chart.axis('timestamp', {
            label: function label(text, index, total) {
                const textCfg = {
                    textAlign: 'center'
                };
                // 第一个点左对齐，最后一个点右对齐，其余居中，只有一个点时左对齐
                if (index === 0) {
                    textCfg.textAlign = 'left';
                } else if (index === total - 1) {
                    textCfg.textAlign = 'right';
                }
                textCfg.text = text; // textCfg.text 支持文本格式化处理
                return textCfg;
            }
        });
        // 点按照 x 轴连接成一条线，构成线图
        chart.line().position('timestamp*step');

        // Step 4: 渲染图表
        chart.render();
        // 注意：需要把chart return 出来
        return chart;
    },

    clickDaily: function () {
        this.setData({
            isDaily: true,
            isStep: false,
            isCollect: false,
        })
    },
    clickStep: function () {
        this.setData({
            isDaily: false,
            isStep: true,
            isCollect: false,
        })
    },
    clickCollect: function () {
        this.setData({
            isDaily: false,
            isStep: false,
            isCollect: true,
        })
        if (this.data.isLoveCollect) {
            this.cilckLoveCollect();
        } else if (this.data.isSecondHandCollect) {
            this.clickSecondHand();
        } else if (this.data.isLostAndFoundCollect) {
            this.clickLostAndFound();
        } else if (this.data.isCanteenCommentCollect) {
            this.clickCanteenComment();
        }
    },

    cilckLoveCollect: function () {
        this.setData({
            isLoveCollect: true,
            isSecondHandCollect: false,
            isLostAndFoundCollect: false,
            isCanteenCommentCollect: false,
        })
        var that = this
        cloudRequest({
            name: 'checkLoveCollect',
            data: {
                type: 0,
            }
        }, false).then(res => {
            if (res.result.errCode == 0) {
                let collects = res.result.data.collects;
                collects.forEach(element => {
                    element.collect_time = formatTime(element.collect_time);
                });
                that.setData({
                    hasLoveCollect: true,
                    loveCollectList: collects
                })
            } else if (res.result.errCode == 3) {
                that.setData({
                    hasLoveCollect: false,
                })
            } else {
                tips("出错了~", 2000, "error");
            }
        })
    },
    clickSecondHand: function () {
        this.setData({
            isLoveCollect: false,
            isSecondHandCollect: true,
            isLostAndFoundCollect: false,
            isCanteenCommentCollect: false,
        })
        var that = this
        //调用云函数-->查找二手交易墙收藏
        cloudRequest({
            name: 'checkSecondhandCollect',
            data: {},
        }, false).then(res => {
            if (res.result.errCode == 0) {
                let collects = res.result.data.collects;
                collects.forEach(element => {
                    element.collect_time = formatTime(element.collect_time);
                });
                that.setData({
                    hasSecondCollect: true,
                    secondCollectList: collects
                })
            } else if (res.result.errCode == 3) {
                that.setData({
                    hasSecondCollect: false,
                })
            } else {
                tips("出错了~", 2000, "error");
            }
        })
    },
    clickLostAndFound: function () {
        this.setData({
            isLoveCollect: false,
            isSecondHandCollect: false,
            isLostAndFoundCollect: true,
            isCanteenCommentCollect: false,
        })
        var that = this
        cloudRequest({
            name: 'checkLostCollect',
            data: {},
        }, false).then(res => {
            if (res.result.errCode == 0) {
                let collects = res.result.data.collects;
                collects.forEach(element => {
                    element.collect_time = formatTime(element.collect_time);
                });
                that.setData({
                    hasLostCollect: true,
                    lostCollectList: collects
                })
            } else if (res.result.errCode == 3) {
                that.setData({
                    hasLostCollect: false,
                })
            } else {
                tips("出错了~", 2000, "error");
            }
        })
    },
    clickCanteenComment: function () {
        this.setData({
            isLoveCollect: false,
            isSecondHandCollect: false,
            isLostAndFoundCollect: false,
            isCanteenCommentCollect: true,
        })
        var that = this
        cloudRequest({
            name: 'checkLoveCollect',
            data: {
                type: 1,
            },
        }, false).then(res => {
            if (res.result.errCode == 0) {
                let collects = res.result.data.collects;
                collects.forEach(element => {
                    element.collect_time = formatTime(element.collect_time);
                });
                that.setData({
                    hasCanteenCommentCollect: true,
                    canteenCommentCollectList: collects
                })
            } else if (res.result.errCode == 3) {
                that.setData({
                    hasCanteenCommentCollect: false,
                })
            } else {
                tips("出错了~", 2000, "error");
            }
        })
    },

    clickLevel: function () {
        if (getApp().globalData.userInfo == null) {
            return;
        }
        var that = this
        wx.navigateTo({
            url: '/pages/level/level',
            success: function (res) {
                res.eventChannel.emit('acceptDataFromOpenedPage', {
                    user: that.data.user
                })
            }
        })
    },

    setUserInfo: function () {
        if (getApp().globalData.userInfo == null) {
            return;
        }
        wx.navigateTo({
            url: '/pages/set/set',
        })
    },

    getUserProfile(e) {
        var that = this;
        if (!app.globalData.hasUserInfo) {
            wx.getUserProfile({
                desc: '用于完善用户资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
                success: (res) => {
                    let nickName = res.userInfo.nickName;
                    let avatarUrl = res.userInfo.avatarUrl;
                    cloudRequest({
                        name: 'signUser',
                        data: {
                            avatarUrl: avatarUrl,
                            gender: "0",
                            nickName: nickName,
                            birthday: "2000-01-01"
                        }
                    }, true, "登录中").then(res => {
                        if (res.result.errCode == 0) {
                            let userInfo = res.result.data.user;
                            app.globalData.hasUserInfo = true;
                            app.globalData.userInfo = userInfo;
                            app.globalData.userInfo.birthday = "2000-01-01";
                            app.globalData.userInfo.constellation = getAstro(userInfo.birthday);
                            app.globalData.userInfo.level = getLevel(userInfo.experienceValue);
                            that.setData({
                                user: app.globalData.userInfo
                            })
                            that.initSteps();
                            that.checkAllMyMessages();
                        } else {
                            tips("出错了", 2000, "error")
                        }
                    })
                }
            })
        }
    },

    //手指触摸动作开始 记录起点X坐标
    touchstart: function (e) {
        //开始触摸时 重置所有删除
        let data = this._touchstart(e, this.data.dailyList)
        this.setData({
            dailyList: data
        })
    },

    //滑动事件处理
    touchmove: function (e) {
        let data = this._touchmove(e, this.data.dailyList)
        this.setData({
            dailyList: data
        })
    },

    //删除事件
    del: function (e) {
        var index = e.currentTarget.dataset.index;
        var msg = this.data.dailyList[index]
        var that = this
        wx.showModal({
            title: '提示',
            content: '确认要删除此条信息么？',
            success: function (res) {
                if (res.confirm) {
                    //调用云函数-->查找表白墙收藏
                    cloudRequest({
                        name: 'wallsFunction',
                        data: {
                            module: that.data.walls[msg.type],
                            action: 'delete',
                            params: {
                                _id: msg._id
                            }
                        },
                    }, true, "删除中").then(res => {
                        that.data.dailyList.splice(index, 1)
                        that.setData({
                            dailyList: that.data.dailyList
                        })
                        tips("删除成功", 1000, "success")
                        cloudDeleteImage(msg.images_content, false)
                        if (that.data.dailyList.length == 0) {
                            that.setData({
                                hasDaily: false
                            })
                        }
                    })
                }
            }
        })
    },
    _touchstart: function (e, items) {
        //开始触摸时 重置所有删除
        items.forEach(function (v, i) {
            if (v.isTouchMove) //只操作为true的
                v.isTouchMove = false;
        })
        this.setData({
            startX: e.changedTouches[0].clientX,
            startY: e.changedTouches[0].clientY
        })
        return items
    },

    _touchmove: function (e, items) {
        var startX = this.data.startX
        var startY = this.data.startY
        var index = e.currentTarget.dataset.index, //当前索引
            touchMoveX = e.changedTouches[0].clientX, //滑动变化坐标
            touchMoveY = e.changedTouches[0].clientY, //滑动变化坐标
            //获取滑动角度
            angle = this._angle({
                X: startX,
                Y: startY
            }, {
                X: touchMoveX,
                Y: touchMoveY
            });
        items.forEach(function (v, i) {
            v.isTouchMove = false
            //滑动超过30度角 return
            if (Math.abs(angle) > 30) return;
            if (i == index) {
                if (touchMoveX > startX) //右滑
                    v.isTouchMove = false
                else //左滑
                    v.isTouchMove = true
            }
        })
        return items
    },

    _angle: function (start, end) {
        var startX = this.data.startX
        var startY = this.data.startY
        var _X = end.X - start.X,
            _Y = end.Y - start.Y
        //返回角度 /Math.atan()返回数字的反正切值
        return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
    },

    /**
     * 检查授权
     */
    checkWerunAuthorize: function () {
        let that = this;
        wx.getSetting({
            success(res) {
                if (!res.authSetting['scope.werun']) {
                    wx.authorize({
                        scope: 'scope.werun',
                        success() {
                            // 用户已经同意小程序使用功能
                            that.setData({
                                isAuthorizeWeRun: true,
                            });
                            app.globalData.isAuthorizeWeRun = true
                            that.getWeRunData();
                        },
                        fail: res => {
                            wx.showModal({
                                title: '提示',
                                content: '需要您授权获取您的微信步数',
                                showCancel: false,
                                success: modalSuccess => {
                                    wx.openSetting({
                                        success(settingdata) {
                                            if (settingdata.authSetting['scope.werun']) {
                                                wx.showModal({
                                                    title: '提示',
                                                    content: '获取权限成功,再次点击获取',
                                                    showCancel: false,
                                                })
                                            } else {
                                                wx.showModal({
                                                    title: '提示',
                                                    content: '获取权限失败，将无法获取您的微信步数',
                                                    showCancel: false,
                                                })
                                            }
                                        }
                                    })
                                }
                            })
                        }
                    })
                } else {
                    that.setData({
                        isAuthorizeWeRun: true,
                    })
                    app.globalData.isAuthorizeWeRun = true
                    that.getWeRunData(); //已经获得权限可以,进行相关操作
                }
            }
        });
    },

    /**
     * 获取微信运动数据
     */

    getWeRunData() {
        var that = this
        wx.getWeRunData({
            success(res) {
                wx.cloud.callFunction({
                    name: 'desrundata',
                    data: {
                        weRunData: wx.cloud.CloudID(res.cloudID) //直到云函数被替换
                    }
                }).then(res => {
                    that.setData({
                        stepInfoList: res.result.data.stepInfoList,
                        maxStep: res.result.data.maxStep,
                        avgStep: res.result.data.avgStep,
                        newStep: res.result.data.stepInfoList[0].step,
                        roseChart: (F2, config) => that.onInitChart(F2, config, res.result.data.graphics),
                        showRoseChart: true,
                    })
                })
            }
        })
    },

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

    initSteps() {
        var that = this
        wx.getSetting({
            success(res) {
                if (res.authSetting['scope.werun']) {
                    that.setData({
                        isAuthorizeWeRun: true,
                    })
                    app.globalData.isAuthorizeWeRun = true
                    that.getWeRunData(); //已经获得权限可以,进行相关操作
                }
            }
        });

        if (app.globalData.isAuthorizeWeRun) {
            that.getWeRunData()
        }

        var date = "user.signDate"
        that.setData({
            user: app.globalData.userInfo,
        })
        that.setData({
            [date]: that.countDown(that.data.user.signTime)
        })
        app.globalData.userInfo.signDate = that.data.user.signDate
    },

    checkAllMyMessages() {
        var that = this;
        cloudRequest({
            name: 'checkAllMineMessage',
            data: {},
        }, false).then(res => {
            if (res.result.errCode == 0) {
                let message = res.result.data.message;
                message.forEach(element => {
                    element.publish_time = formatTime(element.publish_time);
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

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if (getApp().globalData.userInfo != null) {
            this.initSteps();
        }
    },

    onShow: function () {
        if (getApp().globalData.userInfo != null) {
            this.checkAllMyMessages();
            this.setData({
                user: app.globalData.userInfo,
            })
        }
    },
})