// components/Tabs/Tabs.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        tabs: {
            type: Array,
            value: []
        },
        themeColor: {
            type: String,
            value: ""
        },
        boxShadow: {
            type: Boolean,
            value: false
        },
        styleType: {
            type: Number,
            value: 0
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        animationData: {}
    },

    /**
     * 组件的方法列表
     */
    methods: {
        // 定义点击事件
        handleItemTap(e) {
            // 1 获取点击的索引
            const {index} = e.currentTarget.dataset;
            var animation = wx.createAnimation({
                duration: "400",
                timingFunction: "ease"
            })
            let realWidth = wx.getSystemInfoSync().windowWidth;
            if (index == 1)
                animation.translateX(375 * realWidth / 750).step();
            else
                animation.translateX(0).step();
            this.setData({
                animationData:animation.export()
            })
            // 2 触发 父组件中的事件 自定义
            this.triggerEvent("tabsItemChange", {
                index
            });
        }
    }
})