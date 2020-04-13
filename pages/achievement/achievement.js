// pages/achievement/achievement.js
const app = getApp()
const app_data = app.globalData

Page({

    /**
     * 页面的初始数据
     */
    data: {
        open: false,
        gone_spots: {
            open: false,
            name: '已通关的地点',
            done: false,
        },
        gone_list: [],
        achievement_list: [],
        list: [
            {
                name: '首次完成',
                done: false
            },
            {
                name: '诗词之王',
                done: true
            }
        ]
    },
    onLoad: function (options) {
        let that = this
        wx.request({
            url: app_data.url + '/api/get_achievement',
            data: {
                user_id: app_data.userInfo['openid']
            },
            method: 'GET',
            header: {
                'content-type': 'application/json' //默认值
            },
            success: function (res) {
                const data = res.data
                that.setData({
                    achievement_list: data['data']
                })
            },
            fail: function (res) {
                console.log(res.data)
            }
        })
        wx.request({
            url: app_data.url + '/api/get_gone',
            data: {
                user_id: app_data.userInfo['openid']
            },
            method: 'GET',
            header: {
                'content-type': 'application/json' //默认值
            },
            success: function (res) {
                const data = res.data
                that.setData({
                    gone_list: data['data']
                })
            },
            fail: function (res) {
                console.log(res.data)
            }
        })
    },
    kindToggle(e) {
        const status = this.data.open
        this.setData({
            open: !status
        })
    }
})
