//index.js
//获取应用实例
const app = getApp()
const app_data = app.globalData
const innerAudioContext = app_data.audio
const innerclick = app_data.click

Page({
    data: {
        userInfo: {},
        // hasUserInfo: false,
        sound: app_data.sound
        // canIUse: wx.canIUse('button.open-type.getUserInfo')
    },
    //事件处理函数
    onLoad: function () {
        this.setData({
            sound: app_data.sound
        })
        if (!app_data.outset) {
            innerAudioContext.autoplay = true;
            innerAudioContext.src = 'https://www.cultureinnovation.top:8000/media/backmusic.mp3';
            innerAudioContext.loop = true;
            innerAudioContext.play();
            app_data.outset = true
        }
        let postData = {
            appid: 'wxc98b13aebe461ec3',
            secret: '2e1e6ab9145b80c5bb2e67dff0bf908e'
        }
        wx.request({
            url: getApp().globalData.url + '/api/get_token/',
            data: JSON.stringify(postData),
            method: 'POST',
            header: {
                'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
            },
            success: res => {
                // 回调处理
                let data = res.data['data']
                app_data.token = data['access_token']
            },
            fail: error => {
                console.log(error)
            }
        })
    },
    onShow: function () {
        app_data.is_map = true
    },
    onReady: function () {
    },
    pageNavi: function (e) {
        wx.navigateTo({
            url: '../province/province?name=' + e.currentTarget.id
        })
        app_data.is_map = false
        innerclick.src = 'https://www.cultureinnovation.top:8000/media/click.mp3'
        innerclick.play()
    },
    goMap: function () {
        if (app_data.userInfo === null) {
            wx.reLaunch({
                url: '../login/login'
            })
        } else {
            if (!app_data.is_map) {
                app.goMap()
            }
        }
    },
    goCommu: function () {
        if (app_data.userInfo === null) {
            wx.reLaunch({
                url: '../login/login'
            })
        } else {
            if (!app_data.is_commu)
                app.goCommu()
        }
        innerclick.src = 'https://www.cultureinnovation.top:8000/media/click.mp3'
        innerclick.play()
    },
    goInfo: function () {
        if (app_data.userInfo === null) {
            wx.reLaunch({
                url: '../login/login'
            })
        } else {
            if (!app_data.is_info) {
                app.goInfo()
            }
        }
        innerclick.src = 'https://www.cultureinnovation.top:8000/media/click.mp3'
        innerclick.play()
    },
    soundOpt: function () {
        let flag = this.data.sound
        this.setData({
            sound: !flag
        })
        app.soundOpt()
    }
})
