Component({
    /**
     * 组件的属性列表
     */
    properties: {
      //category bar的高度,单位为rpx
      height: {
        type: Number,
        value: 0
      },
      //设置横向滚动条位置
      scrollLeft: {
        type: Number,
        value: 0
      },
      //数据
      categoriesData: {
        type: Array,
        value: []
      },
      //当前索引
      nowIndex: {
        type: Number,
        value: 0
      },
      //元素间的间距
      paddingRight:{
        type:Number,
        value:32
      },
      //第一个元素的左间距
      firstPaddingLeft:{
        type:Number,
        value:20
      }
    },
  
  
    /**
     * 组件的初始数据
     */
    data: {
    },
    lifetimes: {
      attached: function () {
        this._getSystemInfo();
        this._getContentWidth();
      }
    },
    /**
     * 组件的方法列表
     */
    methods: {
      //获取设备参数
      _getSystemInfo: function () {
        var _this = this;
        wx.getSystemInfo({
          success: (res) => {
            var pxTorpxRatio = 750 / res.screenWidth;
            _this.setData({
              pxTorpxRatio: pxTorpxRatio,
              windowWidth: res.screenWidth
            });
          }
        });
      },
      //获取内部总宽度，单位是px
      _getContentWidth: function () {
        var _this = this;
        _this._getCategoryInfo().then((res) => {
          var dataLength = _this.data.categoriesData.length;
          _this.setData({
            contentWidth: ((res.width * dataLength * _this.data.pxTorpxRatio) + dataLength * _this.data.paddingRight + _this.data.firstPaddingLeft) / _this.data.pxTorpxRatio
          });
        })
      },
      //改变点击
      onChanging: function (event) {
        var tappedIndex = event.currentTarget.dataset.index;
        this.setData({
          nowIndex: tappedIndex
        });
        //获取点击元素的宽度以及left值
        var _this = this;
        _this._getCategoryInfo().then((res) => {
          _this.setData({
            tappedWidth: res.width,
            tappedLeft: res.left
          }, () => {
            _this._getCategoriesScrollLeft().then((res) => {
              _this.setData({
                scrollLeft: res.scrollLeft
              }, () => {
                _this._onMoving();
              });
            });
          });
        });
        this.triggerEvent("change",{currentIndex:tappedIndex},{})
      },
      //移动
      _onMoving: function () {
        var tappedLeft = this.data.tappedLeft;
        var tappedWidth = this.data.tappedWidth;
        var scrollLeft = this.data.scrollLeft;
        var windowWidth = this.data.windowWidth;
        var contentWidth = this.data.contentWidth;
        var maxScrollLeft = contentWidth - windowWidth;
        var tappedScrollLeft;
        if (tappedLeft > windowWidth / 2) {
          var moveDis = scrollLeft + (tappedLeft - ((windowWidth / 2) - tappedWidth));
          tappedScrollLeft = (moveDis > maxScrollLeft) ? maxScrollLeft : moveDis;
        } else {
          var moveDis = scrollLeft - (((windowWidth / 2) - tappedWidth) - tappedLeft);
          tappedScrollLeft = (moveDis < 0) ? 0 : moveDis;
        }
        this.setData({
          scrollLeft: tappedScrollLeft
        });
      },
      //获取当前元素的信息
      _getCategoryInfo: function () {
        var _this = this;
        return new Promise((resolve, reject) => {
          _this.createSelectorQuery().select(".current-category").boundingClientRect((res) => {
            resolve(res);
          }).exec();
        });
      },
      //获取scroll-view的scroll-left值
      _getCategoriesScrollLeft: function () {
        var _this = this;
        return new Promise((resolve, reject) => {
          _this.createSelectorQuery().select(".categories").fields({
            scrollOffset: true
          }, (res) => {
            resolve(res);
          }).exec();
        });
      }
    }
  })