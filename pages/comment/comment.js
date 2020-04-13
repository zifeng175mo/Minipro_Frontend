// pages/comment/comment.js
let page = 0
let total_page = 1
const app = getApp()
const app_data = getApp().globalData
Page({

    /**
     * 页面的初始数据
     */
    data: {
        id: null,
        focus: true,
        reply: '',
        inputValue: null,
        comment_list: []
    },

    /**
     * 生命周期函数--监听页面加载
     * undefined bug
     * 修改输入框显示方式
     */
    onLoad: function (options) {
        page = 0
        total_page = 1
        const id = options.id
        this.setData({
            id: id,
            comment_list: []
        })
        this.getData()
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
        this.getData()
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },

    keyBoard: function (e) {
        let flag = this.data.focus
        this.setData({
            reply: '回复 ' + e.currentTarget.dataset.reply + '：',
            focus: !flag
        })
    },
    bindKeyInput: function (e) {
        this.setData({
            inputValue: e.detail.value
        })
    },
    submitTo: function () {
        let that = this
        let errcode = null
        wx.request({
            url: app_data.url + '/api/test_comment/',
            data: {
                token: app_data.token,
                content: that.data.inputValue
            },
            method: 'POST',
            header: {
                'content-type': 'application/json' //默认值
            },
            success: res => {
                errcode = res.data.data.errcode
                if (errcode !== 0) {
                    this.setData({
                        inputValue: null,
                        reply: null
                    })
                    wx.showModal({
                        content: '请勿输入违规内容',
                        showCancel: false
                    })
                } else {
                    wx.request({
                        url: app_data.url + '/api/add_comment',
                        data: {
                            id: that.data.id,
                            user: app_data.userInfo['openid'],
                            reply: that.data.reply,
                            text: that.data.inputValue
                        },
                        method: 'POST',
                        header: {
                            'content-type': 'application/json' //默认值
                        },
                        success: res => {
                            let list = this.data.comment_list.concat({
                                id: that.data.id,
                                user: app_data.userInfo['nickName'],
                                avatar: app_data.userInfo['avatarUrl'],
                                text: that.data.inputValue,
                                reply: that.data.reply,
                                time: app.time(Date.parse(new Date()) / 1000)
                            })
                            that.setData({
                                inputValue: null,
                                reply: null
                            })
                            that.setData({
                                comment_list: list
                            })
                        },
                        fail: res => {
                            console.log(res.data)
                        }
                    })
                    wx.createSelectorQuery().select('#all').boundingClientRect(function (rect) {
                        // 使页面滚动到底部
                        wx.pageScrollTo({
                            scrollTop: rect.bottom
                        })
                    }).exec()
                }
            },
            fail: res => {
                console.log(res.data)
            }
        })
    },
    getData: function () {
        const id = this.data.id
        if (page + 1 > total_page) {
            wx.showToast({
                title: '以上是全部了！',
                mask: true,
                duration: 500
            })
        } else {
            wx.showLoading({
                title: '加载中',
                mask: true
            })
            wx.request({
                url: app_data.url + '/api/get_comments/',
                data: {
                    page: page,
                    id: id
                },
                method: 'GET',
                success: res => {
                    let data = res.data
                    data['data'].forEach((item) => {
                        item['time'] = app.time(item['time'])
                    })
                    let list = this.data.comment_list.concat(data['data'])
                    this.setData({
                        comment_list: list
                    })
                    page += 1
                    total_page = data['total_page']
                    setTimeout(() => {
                        wx.hideLoading()
                    }, 100)
                },
                fail: res => {
                    wx.showToast({
                        title: res.data['error'],
                        mask: true
                    })
                }
            })
        }
    }
})
