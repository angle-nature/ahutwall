// components/searchInput/searchInput.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        themeColor:{
            type: String,
            value: ""
        },
        placeholder:{
            type: String,
            value: ""
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
        bindsearch(e){
            this.triggerEvent("bindsearch", {
                
            });
        }
    }
})
