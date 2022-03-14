// index.js
// 获取应用实例
const app = getApp()
Page({
  data: {
    // 表白墙所有动态
    messages: [{
      "messageId": 1,
      "isLiked": false,
      "isCollected": false,
      "official": true,
      "avatar": "/images/avatar1.jpg",
      "name": "自顾",
      "publish_time": "2021.2.21 16:45",
      "level": "5",
      "text_content": "倾诉所有的不愉快",
      "images_content": ['/images/AHUT2.jpeg'],
      "comments_number": 20,
      "like_number": 53,
      "comments": [{
        "name": "Adofiv",
        "content": "全世界你最棒"
      }, {
        "name": "四月",
        "content": "啦啦啦啦啦"
      }]
    }, {
      "messageId": 2,
      "isLiked": false,
      "isCollected": false,
      "official": false,
      "avatar": "/images/avatar1.jpg",
      "name": "小蔡",
      "publish_time": "2021.2.21 16:45",
      "level": "1",
      "text_content": "人只应当忘记自己而爱别人，这样才能安静、幸福和高尚",
      "images_content": [],
      "comments_number": 20,
      "like_number": 53,
      "comments": [{
        "name": "Adofiv",
        "content": "全世界你最棒"
      }, {
        "name": "四月",
        "content": "啦啦啦啦啦"
      }]
    }, {
      "messageId": 3,
      "isLiked": false,
      "isCollected": false,
      "official": false,
      "avatar": "/images/avatar1.jpg",
      "name": "磨磨唧唧",
      "publish_time": "2021.2.21 16:45",
      "level": "1",
      "text_content": "爱情只在深刻的、神秘的直观世界中才能产生，才能存在。生儿育女不是爱情本身的事",
      "images_content": [],
      "comments_number": 20,
      "like_number": 53,
      "comments": [{
        "name": "Adofiv",
        "content": "全世界你最棒"
      }, {
        "name": "四月",
        "content": "啦啦啦啦啦"
      }]
    }, {
      "messageId": 4,
      "isLiked": false,
      "isCollected": false,
      "official": true,
      "avatar": "/images/avatar1.jpg",
      "name": "絮儿",
      "publish_time": "2021.2.21 16:45",
      "level": "1",
      "text_content": "爱一个人意味着什么呢?这意味着为他的幸福而高兴，为使他能够更幸福而去做需要做的一切，并从这当中得到乐;爱情只在深刻的、神秘的直观世界中才能产生，才能存在。生儿育女不是爱情本身的事",
      "images_content": [],
      "comments_number": 20,
      "like_number": 53,
      "comments": [{
        "name": "Adofiv",
        "content": "全世界你最棒"
      }, {
        "name": "四月",
        "content": "啦啦啦啦啦"
      }]
    }],

    showComment: false,
    commentInput: "",
    inputHeight: 0,
    scrollTop: 0,
    likeAnimationData: {},
    collectAnimationData: {},
    animationIndex: 0
  },

  onPageScroll(e) {
    // 获取滚动条到顶部的距离
    this.setData({
      scrollTop: e.scrollTop
    })
  },

  gobackTop: function (e) {
    var that = this
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    })
  },

  // 预览大图
  previewImage: function (e) {
    // 当前图片url
    let currentImageUrl = e.currentTarget.dataset.imagesrc;
    // 当前图片所在图片组
    let currentImageList = e.currentTarget.dataset.imageurls;
    wx.previewImage({
      current: currentImageUrl,
      urls: currentImageList
    })
  },

  // 点赞事件
  bindLike: function (e) {
    var that = this;
    let messageId = e.currentTarget.dataset.messageid;
    let index = e.currentTarget.dataset.index;
    this.setData({
      animationIndex: index
    })

    let messages = this.data.messages;
    messages[index].isLiked = !messages[index].isLiked;

    let animation = wx.createAnimation({
      duration: "100",
      timingFunction: "ease",
    })

    if (messages[index].isLiked) {
      animation.rotateY(90).step();
      this.setData({
        likeAnimationData: animation.export()
      })
      setTimeout(function () {
        animation.rotateY(180).step();
        that.setData({
          messages: messages,
          likeAnimationData: animation.export()
        })
      }, 50)
    } else {
      animation.rotateY(90).step();
      this.setData({
        likeAnimationData: animation.export()
      })
      setTimeout(function () {
        animation.rotateY(0).step();
        that.setData({
          messages: messages,
          likeAnimationData: animation.export()
        })
      }, 50)
    }
  },

  //收藏事件
  bindCollect: function (e) {
    var that = this;
    let messageId = e.currentTarget.dataset.messageid;
    let index = e.currentTarget.dataset.index;
    this.setData({animationIndex: index})
    let messages = this.data.messages;
    messages[index].isCollected = !messages[index].isCollected;

    let animation = wx.createAnimation({
      duration: "100",
      timingFunction: "ease",
    })

    animation.scale(0.5).step();
    this.setData({
      collectAnimationData: animation.export()
    })
    setTimeout(function () {
      animation.scale(1).step();
      that.setData({
        messages: messages,
        collectAnimationData: animation.export()
      })
    }, 100)
  },

  bindForword: function (e) {
    console.log(e)
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage'],
      success(res) {
        console.log("转发成功")
      }
    })
  },

  //查看动态详情
  lookDetail: function (e) {
    wx.navigateTo({
      url: '/pages/vindicateWallDetail/vindicateWallDetail?message_id=1'
    })
  },

  // 评论
  bindComment: function (e) {
    this.setData({
      showComment: true
    })
  },

  hideInput: function (e) {
    this.setData({
      showComment: false
    })
  },

  bindCommentInput: function (e) {
    this.setData({
      commentInput: e.detail.value
    })
  },

  sendComment: function (e) {
    console.log(this.data.commentInput)
  },

  // 获取键盘高度
  getKeybordHeight: function (e) {
    this.setData({
      inputHeight: e.detail.height
    })
  },

  onLoad: function (options) {

  },

  onShow: function () {

  }
})