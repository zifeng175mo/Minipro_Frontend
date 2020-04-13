// pages/province/province.js
let province = null
let app = getApp()
let app_data = getApp().globalData
const innerclick = app_data.click
let moveFlag = true
let startX, endX
Page({

    /**
     * 页面的初始数据
     */
    data: {
        sound: app_data.sound,
        poems: null,
        index: 0,
        number: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            sound: app_data.sound
        })
        let that = this
        province = options.name
        wx.request({
            url: getApp().globalData.url + '/api/get_poem',
            data: {
                province: province
            },
            method: 'GET',
            header: {
                'content-type': 'application/json' //默认值
            },
            success: function (res) {
                const data = res.data['data']
                if (res.data.status) {
                    if (data[0]) {
                        that.setData({
                            flag: false,
                            province_name: res.data['province'],
                            poems: data,
                            number: data.length,
                            poem_name: data[0].poem_name,
                            author: data[0].author,
                            poem_content: data[0].poem_content,
                            translation: data[0].translation,
                            introduction: data[0].introduction
                        });
                    } else {
                        that.setData({
                            flag: true,
                            province_name: res.data['province'],
                            poem_name: '请去别的省逛逛吧！',
                            author: '',
                            poem_content: '',
                            translation: '',
                            introduction: ''
                        })
                    }
                } else {

                }
            },
            fail: function (res) {
                console.log(res.state)
            }
        })
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

    goTest: function () {
        if (app_data.userInfo === null) {
            wx.reLaunch({
                url: '../login/login'
            })
        } else {
            wx.navigateTo({
                url: '../test/test?name=' + province
            })
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
    },
    touchStart: function (e) {
        startX = e.touches[0].pageX // 获取触摸时的原点
        moveFlag = true
    },
    // 触摸移动事件
    touchMove: function (e) {
        let that = this
        let index = this.data.index
        let poems = this.data.poems
        endX = e.touches[0].pageX // 获取触摸时的原点
        if (moveFlag) {
            if (endX - startX > 50 && index > 0) {
                that.setData({
                    index: index - 1
                })
                index = that.data.index
                that.setData({
                    poem_name: poems[index].poem_name,
                    author: poems[index].author,
                    poem_content: poems[index].poem_content,
                    translation: poems[index].translation,
                    introduction: poems[index].introduction
                })
                moveFlag = false
                return
            }
            if (startX - endX > 50 && index < that.data.number - 1) {
                that.setData({
                    index: index + 1
                })
                index = that.data.index
                that.setData({
                    poem_name: poems[index].poem_name,
                    author: poems[index].author,
                    poem_content: poems[index].poem_content,
                    translation: poems[index].translation,
                    introduction: poems[index].introduction
                })
                moveFlag = false
                return
            }
        }
    },
    touchEnd: function (e) {
        moveFlag = false; // 回复滑动事件
    },
})
