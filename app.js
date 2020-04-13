//app.js
App({
    onLaunch: function () {
        // 展示本地存储能力
        var logs = wx.getStorageSync('logs') || []
        logs.unshift(Date.now())
        wx.setStorageSync('logs', logs)

        // 登录
        wx.login({
            success: res => {
                // 发送 res.code 到后台换取 openId, sessionKey, unionId
            }
        })
        // 获取用户信息
        wx.getSetting({
            success: res => {
                if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                    wx.getUserInfo({
                        success: res => {
                            // 可以将 res 发送给后台解码出 unionId
                            this.globalData.userInfo = res.userInfo

                            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                            // 所以此处加入 callback 以防止这种情况
                            if (this.userInfoReadyCallback) {
                                this.userInfoReadyCallback(res)
                            }
                        }
                    })
                }
            }
        })
    },
    globalData: {
        userInfo: null,
        url: 'https://www.cultureinnovation.top:8000',
        chat_url: '/ws/chat/',
        is_map: true,
        is_commu: false,
        is_info: false,
        token:null,
        audio: wx.createInnerAudioContext(),
        click: wx.createInnerAudioContext(),
        sound: true,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        outset: false
    },
    goMap: function () {
        if (!this.globalData.is_map) {
            wx.redirectTo({
                url: '../index/index'
            })
            this.globalData.is_map = true
            this.globalData.is_commu = false
            this.globalData.is_info = false
        }
    },
    goCommu: function () {
        if (!this.globalData.is_commu) {
            wx.redirectTo({
                url: '../community/community'
            })
            this.globalData.is_map = false
            this.globalData.is_commu = true
            this.globalData.is_info = false
        }
    },
    goInfo: function () {
        if (!this.globalData.is_info) {
            wx.redirectTo({
                url: '../info/myinfo'
            })
            this.globalData.is_map = false
            this.globalData.is_commu = false
            this.globalData.is_info = true
        }
    },
    addZero(number) {
        if (number < 10) {
            return '0' + number;
        } else {
            return number;
        }
    },
    time(timestamp) {
        const date = new Date(timestamp * 1000);
        const year = date.getFullYear();
        let day = date.getDate();
        day = this.addZero(day);
        let month = date.getMonth() + 1;
        month = this.addZero(month);
        let hour = date.getHours();
        hour = this.addZero(hour);
        let minute = date.getMinutes();
        minute = this.addZero(minute);
        return year + '-' + month + '-' + day;
    },
    soundOpt: function () {
        let data = this.globalData
        let flag = data.sound
        data.sound = !flag
        if(flag) {
            data.audio.pause()
        } else {
            data.audio.play()
        }
    }
})
