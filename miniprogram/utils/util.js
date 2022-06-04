/***弹窗提示
@params title 提示文字 time 显示时间/秒 icon 显示图标[none,success]
*/
function tips(title = '', time = 1000, icon = 'none') {
    return new Promise((resolve, reject) => {
        wx.showToast({
            title: title,
            icon: icon,
            success: (res) => {
                resolve(res);
            },
            fail: (err) => {
                reject(err);
            }
        })
    })
}

/***弹窗确认提示
@params content 内容 showCancel 是否展示取消按钮
*/
function confirm(content, showCancel = true) {
    return new Promise((resolve, reject) => {
        wx.showModal({
            title: '提示',
            content: content,
            showCancel: showCancel,
            success: (res) => {
                resolve(res);
            },
            fail: (err) => {
                reject(err);
            }
        })
    })
}

/***云函数请求
@params param{ name:"云函数名称", data:{} } title：showLoding.title
*/
function cloudRequest(param, showLoading = true, title = "加载中") {
    if (showLoading) {
        wx.showLoading({
            title: title
        })
    }

    return new Promise((resolve, reject) => {
        wx.cloud.callFunction({
            name: param.name,
            data: param.data,
            success: res => {
                resolve(res);
            },
            fail: err => {
                wx.showModal({
                    title: "提示",
                    content: "出错了~",
                    showCancel: false
                })
                reject(err);
            },
            complete: () => {
                wx.hideLoading();
            }
        })
    })
}

/***上传图片
@params cloudPath 上传至云端的路径;tempPath 本地临时文件路径
*/
function cloudUploadImage(param, showloding = true) {
    if (showloding) {
        wx.showLoading({
            title: '图片上传中'
        })
    }
    return new Promise((resolve, reject) => {
        wx.cloud.uploadFile({
            cloudPath: param.cloudPath, // 上传至云端的路径
            filePath: param.tempPath, // 临时文件路径
            success: res => {
                // 返回文件 ID
                resolve(res)
            },
            fail: err => {
                wx.showModal({
                    title: "提示",
                    content: "出错了~",
                    showCancel: false
                })
                reject(err)
            },
            complete: () => {
                wx.hideLoading();
            }
        })
    })
}

/***删除图片
@params cloudPath 上传至云端的路径;tempPath 本地临时文件路径
*/
function cloudDeleteImage(imageList, showLoading = true) {
    if (showLoading) {
        wx.showLoading({
            title: ''
        })
    }
    return new Promise((resolve, reject) => {
        wx.cloud.deleteFile({
            fileList: imageList,
            success: res => {
                resolve(res)
            },
            fail: err => {
                reject(err)
            },
            complete: () => {
                wx.hideLoading();
            }
        })
    })
}

function add0(m) {
    return m < 10 ? '0' + m : m
}

/***将时间戳转换为 2022.3.22 16:41 的日期格式
@params 时间戳
*/
function formatTime(timestamp) {
    var time = new Date(timestamp); //传进来的时间
    var currentTime = new Date(); //当前时间

    var y1 = time.getFullYear(); //获取完整的年份(4位)
    var m1 = time.getMonth() + 1; //获取当前月份(0-11,0代表1月)
    var d1 = time.getDate(); //获取当前日(1-31)
    var h1 = time.getHours(); //获取当前小时数(0-23)
    var minute1 = time.getMinutes(); //获取当前分钟数(0-59)
    var s1 = time.getSeconds(); //获取当前秒数(0-59)

    var y2 = currentTime.getFullYear(); //获取完整的年份(4位)
    var m2 = currentTime.getMonth() + 1; //获取当前月份(0-11,0代表1月)
    var d2 = currentTime.getDate(); //获取当前日(1-31)
    var h2 = currentTime.getHours(); //获取当前小时数(0-23)
    var minute2 = currentTime.getMinutes(); //获取当前分钟数(0-59)

    var timeStr = ""; //返回结果

    if ((y2 - y1) >= 1) { //不是今年 显示完整日期
        timeStr = y1 + '-' + add0(m1) + '-' + add0(d1) + ' ' + add0(h1) + ':' + add0(minute1) + ':' + add0(s1);
    } else if ((m2 - m1) >= 1) { //不显示年份
        timeStr = add0(m1) + '-' + add0(d1) + ' ' + add0(h1) + ':' + add0(minute1) + ':' + add0(s1);
    } else if ((d2 - d1) >= 2) {
        timeStr = add0(m1) + '-' + add0(d1) + ' ' + add0(h1) + ':' + add0(minute1) + ':' + add0(s1);
    } else if ((d2 - d1) == 1) {
        timeStr = '昨天 ' + add0(h1) + ':' + add0(minute1) + ':' + add0(s1);
    } else if ((h2 - h1) >= 1) {
        timeStr = '今天 ' + add0(h1) + ':' + add0(minute1) + ':' + add0(s1);
    } else if ((minute2 - minute1) >= 1) {
        timeStr = (minute2 - minute1) + "分钟前";
    } else
        timeStr = "刚刚";
    return timeStr;
}

//根据经验值计算等级
function getLevel(ev) {
    if (ev < 300) {
        return 1
    } else if (ev < 650) {
        return 2
    } else if (ev < 1350) {
        return 3
    } else if (ev < 3150) {
        return 4
    } else if (ev < 9540) {
        return 5
    } else if (ev < 21600) {
        return 6
    } else {
        return 7
    }
}

//根据生日计算星座
function getAstro(birthday) {
    var date = new Date(birthday)
    var month = date.getMonth() + 1
    var day = date.getDate()
    var s = "魔羯水瓶双鱼白羊金牛双子巨蟹狮子处女天秤天蝎射手魔羯";
    var arr = [20, 19, 21, 21, 21, 22, 23, 23, 23, 23, 22, 22];
    return s.substr(month * 2 - (day < arr[month - 1] ? 2 : 0), 2) + '座';
}

function isNull(str) {
    if (str == "") return true;
    var regu = "^[ ]+$";
    var re = new RegExp(regu);
    return re.test(str);
}

module.exports = {
    tips: tips,
    confirm: confirm,
    cloudRequest: cloudRequest,
    cloudUploadImage: cloudUploadImage,
    cloudDeleteImage: cloudDeleteImage,
    formatTime: formatTime,
    getLevel: getLevel,
    getAstro: getAstro,
    isNull: isNull
}