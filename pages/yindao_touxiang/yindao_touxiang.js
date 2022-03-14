let app = getApp();
Page({


  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  next: function (e) {
    console.log("userInfo", getApp().globalData.userInfo)
    wx.switchTab({
      url: '/pages/wall/wall',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this

    wx.showLoading({
      title: '加载中',
    })


    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
      // this.next();
    }

    // wx.login({
    //   success(res) {
    //     if (res.code) {
    //       //发起网络请求
    //       // wx.request({
    //       //   url: 'https://test.com/onLogin',
    //       //   data: {
    //       //     code: res.code
    //       //   }
    //       // })


    //     } else {
    //       console.log('登录失败！' + res.errMsg)
    //     }
    //   }
    // })


    setTimeout(function () {
      wx.hideLoading()
    }, 2000)
  },

  bindGetUserInfo(e) {
    getApp().globalData.userInfo = e.detail.userInfo
    wx.redirectTo({
      url: '/pages/load/load'
    })
  },

  getUserProfile(e) {
    var that=this;
    if (!app.globalData.hasUserInfo) {
      // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
      // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
      wx.getUserProfile({
        desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
        success: (res) => {
          console.log(res)
          // this.setData({
          //   nickName: res.userInfo.nickName,
          //   avatarUrl: res.userInfo.avatarUrl,
          //   userInfo: res.userInfo,
          // })
          app.globalData.userInfo = res.userInfo
          that.next();

          // this.onGetOpenid()
        }
      })
    }
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