// app.js
App({
    onLaunch() {
        // 初始化云开发环境
        wx.cloud.init({
            env: "cloud1-1gizdb5cdcea91b2"
        })
    },
    globalData: {
        userInfo: null,
        isAuthorizeWeRun: false,
        hasUserInfo: false
    }
})