// components/searchInput/searchInput.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        themeColor: {
            type: String,
            value: ""
        },
        placeholder: {
            type: String,
            value: ""
        },
        inputValue: {
            type: String,
            value: ""
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        searchKey: ""
    },

    /**
     * 组件的方法列表
     */
    methods: {
        bindInputKey(e) {
            this.data.searchKey = e.detail.value
        },

        bindsearch(e) {
            let searchKey = this.data.searchKey
            this.triggerEvent("search", {
                searchKey
            });
        }
    }
})