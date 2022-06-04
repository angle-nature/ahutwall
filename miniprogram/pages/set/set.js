import {
    cloudRequest,
    tips
} from '../../utils/util.js'
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        user: {}, //前端保存的用户数据
        // userInfo: {}, //后端保存的用户数据
        gender: ['男', '女'], //0为男性,1为女性
        birthStr: "",
        isBirthday: false,
        ismask: false,

        //日历部分
        currentDayList: '',
        currentObj: '',
        arr: ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
        currentDate: '',
        currentDay: '',
        year: '',
        month: '',
        currentClickKey: '',
        remindlist: [1, 2, 3],
        tempdate: "",
        //定位获取的地址
        address: "",
        addressBean: "",
    },

    changeGender: function (e) {
        var gender = "user.gender"
        this.setData({
            [gender]: e.detail.value
        })
    },
    onDateChange: function (e) {
        this.setData({
            ismask: true,
            isBirthday: true
        })
    },

    doYear(e) {
        var arr = this.data.arr;
        for (let i in arr) {
            var newarr = 'arr[' + i + ']';
            this.setData({
                [newarr]: ''
            })
        }
        var that = this
        var currentObj = that.data.currentObj
        var Y = currentObj.getFullYear();
        var m = currentObj.getMonth() + 1;
        var d = currentObj.getDate();
        var str = ''
        if (e.currentTarget.dataset.key == 'left') {
            Y -= 1
            str = Y + '/' + m + '/' + d
        } else {
            Y += 1
            str = Y + '/' + m + '/' + d
        }
        currentObj = new Date(str)
        this.setData({
            currentDate: currentObj.getFullYear() + '年' + (currentObj.getMonth() + 1) + '月',
            currentObj: currentObj,
            year: currentObj.getFullYear(),
            month: currentObj.getMonth() + 1,
            day: ''
        })
        this.setSchedule(currentObj);
    },

    doDay: function (e) {
        var arr = this.data.arr;
        for (let i in arr) {
            var newarr = 'arr[' + i + ']';
            this.setData({
                [newarr]: ''
            })
        }
        var that = this
        var currentObj = that.data.currentObj
        var Y = currentObj.getFullYear();
        var m = currentObj.getMonth() + 1;
        var d = currentObj.getDate();
        var str = ''
        if (e.currentTarget.dataset.key == 'left') {
            m -= 1
            if (m <= 0) {
                str = (Y - 1) + '/' + 12 + '/' + d
            } else {
                str = Y + '/' + m + '/' + d
            }
        } else {
            m += 1
            if (m <= 12) {
                str = Y + '/' + m + '/' + d
            } else {
                str = (Y + 1) + '/' + 1 + '/' + d
            }
        }
        currentObj = new Date(str)
        this.setData({
            currentDate: currentObj.getFullYear() + '年' + (currentObj.getMonth() + 1) + '月',
            currentObj: currentObj,
            year: currentObj.getFullYear(),
            month: currentObj.getMonth() + 1,
            day: ''
        })
        this.setSchedule(currentObj);
    },
    getCurrentDayString: function () {
        var objDate = this.data.currentObj
        if (objDate != '') {
            return objDate
        } else {
            var c_obj = new Date(this.data.user.birthday)
            var a = c_obj.getFullYear() + '/' + (c_obj.getMonth() + 1) + '/' + c_obj.getDate()
            return new Date(a)
        }
    },
    setSchedule: function (currentObj) {
        var that = this
        var m = currentObj.getMonth() + 1
        var Y = currentObj.getFullYear()
        var d = currentObj.getDate();
        var dayString = Y + '/' + m + '/' + currentObj.getDate()
        var currentDayNum = new Date(Y, m, 0).getDate()
        var currentDayWeek = currentObj.getUTCDay() + 1
        var result = currentDayWeek - (d % 7 - 2);
        var firstKey = result <= 0 ? 7 + result : result;
        var currentDayList = []
        var f = 0
        for (var i = 0; i < 42; i++) {
            let data = []
            if (i < firstKey - 1) {
                currentDayList[i] = ''
            } else {
                if (f < currentDayNum) {
                    currentDayList[i] = f + 1
                    f = currentDayList[i]
                } else if (f >= currentDayNum) {
                    currentDayList[i] = ''
                }
            }
        }
        that.setData({
            currentDayList: currentDayList
        })
    },
    // 设置点击事件
    onClickItem: function (e) {
        // console.log(JSON.stringify(e));
        // console.log(JSON.stringify(e.currentTarget));
        var month = this.data.month
        var year = this.data.year
        let date = year + "-" + month + "-" + e.currentTarget.id;
        let arr = date.split('-');
        var m = arr[1]
        var d = arr[2]
        m = m < 10 ? "0" + m : m;
        d = d < 10 ? "0" + d : d;
        let dateStr = `${arr[0]}年${m}月${d}日`;
        this.setData({
            tempdate: date,
            birthStr: dateStr,
            currentClickKey: e.currentTarget.id,
            currentClickMonth: month,
            currentClickYear: year
        });
    },

    cancalBirhday: function () {
        var birthday = new Date(this.data.user.birthday)
        let arr = this.data.user.birthday.split('-');
        var m = arr[1]
        console.log("m", m)
        var d = arr[2]
        m = m.length < 2 ? "0" + m : m;
        d = d.length < 2 ? "0" + d : d;
        let dateStr = `${arr[0]}年${m}月${d}日`;
        this.setData({
            tempdate: '',
            ismask: false,
            isBirthday: false,
            currentClickKey: '',
            currentClickMonth: '',
            currentObj: birthday,
            currentClickYear: '',
            currentDate: birthday.getFullYear() + '年' + (birthday.getMonth() + 1) + '月',
            birthStr: dateStr,
            month: birthday.getMonth() + 1,
            year: birthday.getFullYear()
        })
        this.setSchedule(birthday)
    },
    confirmBirthday: function () {
        var birthday = "user.birthday"
        var constellation = "user.constellation"
        var that = this
        var tempstr = this.data.tempdate
        if (tempstr == "") {
            wx.showModal({
                title: '提示',
                content: "您还没有选择时间哦~",
                confirmText: "我知道了",
                showCancel: false,
            })
        } else {
            var tempdate = new Date(that.data.tempdate)
            that.setData({
                currentDay: tempdate.getDate(),
                currentMonth: tempdate.getMonth() + 1,
                currentYear: tempdate.getFullYear(),
                currentDate: tempdate.getFullYear() + '年' + (tempdate.getMonth() + 1) + '月',
                currentObj: tempdate,
                [birthday]: tempstr,
                [constellation]: that.getAstro(tempdate.getMonth() + 1, tempdate.getDate()) + "座",
                ismask: false,
                isBirthday: false,
                currentClickKey: '',
                currentClickMonth: '',
                currentClickYear: '',
                month: tempdate.getMonth() + 1,
                year: tempdate.getFullYear()
            })
            that.setSchedule(tempdate)
            that.setData({
                tempdate: "",
            })
        }

    },

    // 根据生日的月份和日期，计算星座。
    getAstro: function (month, day) {
        var s = "魔羯水瓶双鱼白羊金牛双子巨蟹狮子处女天秤天蝎射手魔羯";
        var arr = [20, 19, 21, 21, 21, 22, 23, 23, 23, 23, 22, 22];
        return s.substr(month * 2 - (day < arr[month - 1] ? 2 : 0), 2);
    },
    //获取定位授权
    acquireAddress: function () {
        var that = this
        wx.getSetting({
            success: (res) => {
                // res.authSetting['scope.userLocation'] == undefined  表示 初始化进入该页面
                // res.authSetting['scope.userLocation'] == false  表示 非初始化进入该页面,且未授权
                // res.authSetting['scope.userLocation'] == true  表示 地理位置授权
                if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
                    wx.showModal({
                        title: '请求授权当前位置',
                        content: '需要获取您的地理位置，请确认授权',
                        success: function (res) {
                            if (res.cancel) {
                                wx.showToast({
                                    title: '拒绝授权',
                                    icon: 'none',
                                    duration: 1000
                                })
                            } else if (res.confirm) {
                                wx.openSetting({
                                    success: function (dataAu) {
                                        if (dataAu.authSetting["scope.userLocation"] == true) {
                                            wx.showToast({
                                                title: '授权成功',
                                                icon: 'success',
                                                duration: 1000
                                            })
                                            //再次授权，调用wx.getLocation的API
                                            that.getAddress()
                                        } else {
                                            wx.showToast({
                                                title: '授权失败',
                                                icon: 'none',
                                                duration: 1000
                                            })
                                        }
                                    }
                                })
                            }
                        }
                    })
                } else if (res.authSetting['scope.userLocation'] == undefined) {
                    //调用wx.getLocation的API
                    that.getAddress()
                } else {
                    //调用wx.getLocation的API
                    that.getAddress()
                }
            }
        })
    },
    //打开地图,并设置返回格式
    getAddress: function () {
        var that = this
        wx.getLocation({
            success: function (res) {
                console.log("getLocation", res)
                let jindu = res.latitude;
                let weidu = res.longitude;
                wx.chooseLocation({
                    latitude: Number(jindu),
                    longitude: Number(weidu),
                    success: function (res) {
                        console.log("chooseLocation", res)
                        var regex = /^(北京市|天津市|重庆市|上海市|香港特别行政区|澳门特别行政区)/;
                        var REGION_PROVINCE = [];
                        var addressBean = {
                            REGION_PROVINCE: null,
                            REGION_COUNTRY: null,
                            REGION_CITY: null,
                            ADDRESS: null
                        };

                        function regexAddressBean(address, addressBean) {
                            regex = /^(.*?[市州]|.*?地区|.*?特别行政区)(.*?[市区县])(.*?)$/g;
                            var addxress = regex.exec(address);
                            addressBean.REGION_CITY = addxress[1];
                            addressBean.REGION_COUNTRY = addxress[2];
                            addressBean.ADDRESS = addxress[3] + "(" + res.name + ")";
                        }
                        if (!(REGION_PROVINCE = regex.exec(res.address))) {
                            regex = /^(.*?(省|自治区))(.*?)$/;
                            REGION_PROVINCE = regex.exec(res.address);
                            addressBean.REGION_PROVINCE = REGION_PROVINCE[1];
                            regexAddressBean(REGION_PROVINCE[3], addressBean);
                        } else {
                            addressBean.REGION_PROVINCE = REGION_PROVINCE[1];
                            regexAddressBean(res.address, addressBean);
                        }
                        console.log("addressBean", addressBean)
                        let address = addressBean.REGION_PROVINCE + "" +
                            addressBean.REGION_CITY + "" +
                            addressBean.REGION_COUNTRY;
                        console.log("address", address);
                        // var address = 'user.address'
                        // that.setData({
                        //     [address]: addressBean.REGION_PROVINCE + " " +
                        //         addressBean.REGION_CITY + "" +
                        //         addressBean.REGION_COUNTRY
                        // });
                        that.setData({
                            address: address,
                            addressBean
                        });
                    }
                })
            }
        })
    },
    //点击个性简介
    clickIntro: function () {
        var that = this
        wx.navigateTo({
            url: '/pages/intro/intro?introduction=' + that.data.user.introduction,
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this;
        that.setData({
            user: {
                ...app.globalData.userInfo
            },
            address: app.globalData.userInfo.address
        });
        let arr = that.data.user.birthday.split('-');
        let dateStr = `${arr[0]}年${arr[1]}月${arr[2]}日`;
        that.setData({
            birthStr: dateStr
        })

        var currentObj = this.getCurrentDayString()
        this.setData({
            currentDate: currentObj.getFullYear() + '年' + (currentObj.getMonth() + 1) + '月',
            currentYear: currentObj.getFullYear(),
            currentMonth: currentObj.getMonth() + 1,
            currentDay: currentObj.getDate(),
            currentObj: currentObj,
            year: currentObj.getFullYear(),
            month: currentObj.getMonth() + 1
        })
        this.setSchedule(currentObj);
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
        var that = this
        wx.getStorage({
            key: 'introduction',
            success: function (res) {
                if (res.data != null) {
                    var introduction = "user.introduction"
                    that.setData({
                        [introduction]: res.data,
                    });
                }
                wx.setStorage({
                    key: 'introduction',
                    data: null,
                })
            }
        })

        that.setData({
            user: {
                ...app.globalData.userInfo
            },
        });
        let arr = that.data.user.birthday.split('-');
        let dateStr = `${arr[0]}年${arr[1]}月${arr[2]}日`;
        that.setData({
            birthStr: dateStr
        })

        var currentObj = this.getCurrentDayString()
        this.setData({
            currentDate: currentObj.getFullYear() + '年' + (currentObj.getMonth() + 1) + '月',
            currentYear: currentObj.getFullYear(),
            currentMonth: currentObj.getMonth() + 1,
            currentDay: currentObj.getDate(),
            currentObj: currentObj,
            year: currentObj.getFullYear(),
            month: currentObj.getMonth() + 1
        })
        this.setSchedule(currentObj);
    },

    submitUserInfo: function () {
        //调用云函数
        var that = this
        cloudRequest({
            name: 'editUserInfo',
            data: {
                gender: that.data.user.gender,
                address: that.data.address,
                birthday: that.data.user.birthday,
                introduction: that.data.user.introduction,
            },
        }, true, "保存中").then(res => {
            if (res.result.errCode == 0) {
                app.globalData.userInfo.gender = that.data.user.gender,
                    app.globalData.userInfo.address = that.data.address,
                    app.globalData.userInfo.birthday = that.data.user.birthday,
                    app.globalData.userInfo.introduction = that.data.user.introduction,
                    app.globalData.userInfo.constellation = that.data.user.constellation
                wx.navigateBack({
                    delta: 1,
                })
            } else {
                tips("出错了", 2000, "error")
            }
        })
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {},

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