// components/gotoTop/gotoTop.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        color: {
            type: String,
            value: "#86BC9C"
        }
    },

    /**
     * 组件的初始数据
     */
    data: {

    },

    /**
     * 组件的方法列表
     */
    methods: {
        gobackTop: function (e) {
            var that = this
            wx.pageScrollTo({
                scrollTop: 0,
                duration: 300
            })
        },
    }
})