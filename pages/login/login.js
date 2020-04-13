// pages/login/login.js
const app = getApp()
const app_data=app.globalData
const innerAudioContext = app_data.audio;
Page({

    /**
     * 页面的初始数据
     */
    data: {},

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    getUserInfo: function () {
        wx.getUserInfo({
            lang: "zh_CN",
            success: res => {
                app.globalData.userInfo = res.userInfo
                this.setData({
                    userInfo: res.userInfo,
                    hasUserInfo: true
                })
            }
        })
        wx.login({
            success: data => {
                let postData = {
                    appid: 'wxc98b13aebe461ec3',
                    secret: '2e1e6ab9145b80c5bb2e67dff0bf908e',
                    code: data.code
                }
                wx.request({
                    url: getApp().globalData.url + '/api/get_userinfo/',
                    data: JSON.stringify(postData),
                    method: 'POST',
                    header: {
                        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
                    },
                    success: res => {
                        // 回调处理
                        data = res.data['data']
                        app.globalData.userInfo['openid'] = data['openid']
                        this.sendUserInfo()
                        wx.reLaunch({
                            url: '../index/index'
                        })
                        console.log(data)
                    },
                    fail: error => {
                        console.log(error)
                    }
                })
            }
        })
    },
    sendUserInfo: function () {
        wx.request({
            url: getApp().globalData.url + '/api/register_user/',
            data: JSON.stringify(app.globalData.userInfo),
            method: 'POST',
            header: {
                'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
            },
            success: res => {
            },
            fail: error => {
                console.log('fail!')
            }
        })
    },
})
