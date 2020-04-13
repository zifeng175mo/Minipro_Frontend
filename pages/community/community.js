// pages/community/community.js
let page = 0
let total_page = 1
const app = getApp()
const app_data = getApp().globalData
const innerclick = app_data.click

Page({

    /**
     * 页面的初始数据
     */
    data: {
        focus: false,
        inputValue: null,
        content_list: [],
        my_avatar: 'https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLWCFP2QI1x7JjuSoCgVEkyY6TGRnTpOUhibBfmqIn9mS5C3eDWvJ9OfU4iaooVQdAF0RVfK9OEbUkQ/132',
        other_avatar: null,
        sound: app_data.sound
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            sound: app_data.sound
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        page = 0
        total_page = 1
        this.setData({
            content_list: []
        })
        this.getData()
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
    addDynamic() {
        wx.navigateTo({
            url: '../dynamic/dynamic'
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
        if (!app_data.is_commu)
            app.goCommu()
    },
    goInfo: function () {
        if (!app_data.is_info) {
            app.goInfo()
        }
        innerclick.src = 'https://www.cultureinnovation.top:8000/media/click.mp3'
        innerclick.play()
    },
    comment: function (e) {
        const id = e.currentTarget.dataset.id
        wx.navigateTo({
            url: '../comment/comment?id=' + id
        })
    },
    like: function (e) {
        let that = this
        const id = e.currentTarget.dataset.id
        const index = e.currentTarget.dataset.index
        let like = this.data.content_list[index].like
        wx.request({
            url: app_data.url + '/api/dynamic_like',
            data: {
                user_id: app_data.userInfo['openid'],
                dynamic_id: id
            },
            method: 'POST',
            success: res => {
                let list = that.data.content_list
                list[index].like = !like
                if (like) {
                    list[index].like_count -= 1
                } else {
                    list[index].like_count += 1
                    wx.showToast({
                        title: '点赞成功',
                        mask: true
                    })
                }
                that.setData({
                    content_list: list
                })
            },
            fail: res => {
                wx.showToast({
                    title: '点赞失败 请重试',
                    mask: true
                })
            }
        })
    },
    getData: function () {
        let that = this;
        // 显示加载图标
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
                url: app_data.url + '/api/get_dynamics/',
                data: {
                    page: page,
                    my_id: app_data.userInfo['openid']
                },
                method: 'GET',
                success: res => {
                    const data = res.data
                    data['data'].forEach((item) => {
                        item['time'] = app.time(item['time'])
                    })
                    let list = this.data.content_list.concat(data['data'])
                    this.setData({
                        content_list: list
                    })
                    page += 1
                    total_page = data['total_page']

                    setTimeout(() => {
                        wx.hideLoading();
                    }, 100);
                },
                fail: res => {
                    wx.showToast({
                        title: '获取逸闻失败',
                        mask: true
                    })
                }
            })
        }
    },
    preview: function (e) {
        let that = this
        let url = e.currentTarget.dataset.url
        let index = e.currentTarget.dataset.index
        wx.previewImage({
            //当前显示图片
            current: that.data.content_list[index].image[url],
            urls: that.data.content_list[index].image
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
