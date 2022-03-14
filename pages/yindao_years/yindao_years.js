// pages/yindao_years/yindao_years.js
const date = new Date()
const nowYear = date.getFullYear()
const nowMonth = date.getMonth() + 1
const nowDay = date.getDate()

let daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
// 根据年月 获取当月的总天数
let getDays = function(year, month) {
    if (month === 2) {
        return ((year % 4 === 0) && ((year % 100) !== 0)) || (year % 400 === 0) ? 29 : 28
    } else {
        return daysInMonth[month-1]
    }
}
// 根据年月日设置当前月有多少天 并更新年月日数组
let setDate = function (year, month, day, _th){
    let daysNum = year === nowYear && month === nowMonth ? nowDay : getDays(year, month)
    day = day > daysNum ? 1 : day
    let monthsNum = year === nowYear ? nowMonth : 12
    let years = []
    let months = []
    let days = []
    let yearIdx = 9999
    let monthIdx = 0
    let dayIdx = 0

    // 重新设置年份列表
    for (let i = 1950; i <= nowYear; i++) {
        years.push(i)
    }
    years.map((v,idx)=> {
        if (v === year){
            yearIdx = idx
        }
    })
    // 重新设置月份列表
    for (let i = 1; i <= monthsNum; i++) {
        months.push(i)
    }
    months.map((v, idx) => {
        if (v === month) {
            monthIdx = idx
        }
    })
    // 重新设置日期列表
    for (let i = 1; i <= daysNum; i++) {
        days.push(i)
    }
    days.map((v, idx) => {
        if (v === day) {
            dayIdx = idx
        }
    })

    _th.setData({
        years: years,//年份列表
        months: months,//月份列表
        days: days,//日期列表
        value: [yearIdx, monthIdx, dayIdx],
        year: year,
        month: month,
        day: day
    })
}
Page({

    /**
     * 页面的初始数据
     */
    data: {
        years: [],
        months: [],
        days: [],
        year: nowYear,
        month: nowMonth,
        day: nowDay,
        value: [9999, 1, 1]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        setDate(this.data.year, this.data.month, this.data.day, this)
    },
    bindChange: function (e) {
        let val = e.detail.value
        setDate(this.data.years[val[0]], this.data.months[val[1]], this.data.days[val[2]], this)
    },
    sentnext: function(e){
      wx.navigateTo({
        url: '/pages/yindao_touxiang/yindao_touxiang',
      })
     },
})