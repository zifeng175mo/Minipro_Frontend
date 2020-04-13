//index.js
//获取应用实例
const app = getApp()
const app_data = getApp().globalData
const innerclick = app_data.click

Page({
    data: {
        userInfo: {},
        sound: app_data.sound
    },
    //事件处理函数
    bindViewTap: function (e) {

    },
    onLoad: function () {
        this.setData({
            userInfo: app_data.userInfo,
            sound: app_data.sound
        })
    },
    function() {
        wx.setBackgroundColor({
            backgroundColorTop: '#bbb', // 顶部窗口的背景色为白色
        })
    },
    goMap: function () {
        if (!app_data.is_map) {
            app.goMap()
        }
        innerclick.src = 'https://www.cultureinnovation.top:8000/media/click.mp3'
        innerclick.play()
    },
    goCommu: function () {
        if (!app_data.is_commu) {
            app.goCommu()
        }
      innerclick.src = 'https://www.cultureinnovation.top:8000/media/click.mp3'
      innerclick.play()
    },
    goInfo: function () {
        if (!app_data.is_info) {
            app.goInfo()
        }
    },
    goRoom: function () {
        wx.navigateTo({
            url: '../room/room'
        })
    },
    goComm: function () {
        wx.navigateTo({
            url: '../mycom/mycom'
        })
    },
    soundOpt: function () {
        let flag = this.data.sound
        this.setData({
            sound: !flag
        })
        app.soundOpt()
    }
})
