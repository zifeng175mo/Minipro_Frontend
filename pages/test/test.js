// pages/test/test.js
let province =''
let app = getApp()
let app_data = app.globalData
let right = 0
Page({

    /**
     * 页面的初始数据
     */
    data: {
        test_list: [],
        current_index: 0,
        selected: false,
        selected_index: null,
        answer: [],
        color: ['white', 'white', 'white', 'white', 'white'],
        answer_index: null,
        user_answer: [],
        nosubmit: true,
        disable: false,
        emit_list: null,
        sound: app_data.sound
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this
        province = options.name
        wx.request({
            url: getApp().globalData.url + '/api/get_test',
            data: {
                province: province
            },
            method: 'GET',
            header: {
                'content-type': 'application/json' //默认值
            },
            success: function (res) {
                const data = res.data
                that.setData({
                    test_list: data.data.sort(that.randomSort)
                })
                data.data.forEach((item) => {
                    that.data.answer.push(item['answer'])
                })
            },
            fail: function (res) {

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

    randomSort: function (a, b) {
        return Math.random() > .5 ? -1 : 1;
    },

    select: function (e) {
        let that = this
        const data = this.data
        if (!data.disable) {
            this.setData({
                selected_index: e.currentTarget.dataset['index'],
                answer_index: data.answer[data.current_index].charCodeAt() - 'A'.charCodeAt(),
                selected: true,
                disable: true
            })
            let color_tmp = data.color
            if (data.selected_index === data.answer_index) {
                color_tmp[data.answer_index] = '#33aa33'
                right += 1
            } else {
                color_tmp[data.answer_index] = '#33aa33'
                color_tmp[data.selected_index] = 'red'
            }
            this.setData({
                color: color_tmp
            })
            data.user_answer[data.current_index] = data.selected_index
            if (data.current_index <= 3) {
                setTimeout(function () {
                    that.setData({
                        selected_index: null,
                        current_index: data.current_index + 1,
                        answer_index: null,
                        selected: false,
                        color: ['white', 'white', 'white', 'white', 'white'],
                        disable: false
                    })
                }, 1000) //延迟时间 这里是1秒
            } else {
                that.setData({
                    nosubmit: false
                })
                if (right === 5) {
                    wx.request({
                        url: getApp().globalData.url + '/api/finish_test',
                        data: {
                            user_id: app.globalData.userInfo['openid'],
                            province: province
                        },
                        method: 'POST',
                        header: {
                            'content-type': 'application/json' //默认值
                        },
                        success: function (res) {
                            wx.navigateTo({
                                url: '../summary/summary?flag=false&name=' + province
                            })
                        },
                        fail: function (res) {
                            console.log(res.data)
                        }
                    })
                } else {
                    this.rightOpt()
                    wx.setStorage({
                        key: 'wrongs',
                        data: that.data.emit_list
                    })
                    wx.navigateTo({
                        url: '../summary/summary?flag=true&name=' + province
                    })
                }
            }
        }
    },

    previous: function () {
        const data = this.data
        this.setData({
            current_index: data.current_index - 1
        })
        if (typeof (data.user_answer[data.current_index]) != 'undefined') {
            this.setData({
                selected_index: data.user_answer[data.current_index]
            })
        } else {
            this.setData({
                selected_index: null
            })
        }
    },

    next: function () {
        const data = this.data
        this.setData({
            current_index: data.current_index + 1
        })
        if (typeof (data.user_answer[data.current_index]) != 'undefined') {
            this.setData({
                selected_index: data.user_answer[data.current_index]
            })
        } else {
            this.setData({
                selected_index: null
            })
        }
    },

    submit: function () {
        const data = this.data
        let tmp_answer = []
        data.user_answer.forEach((item) => {
            item += 'A'.charCodeAt()
            tmp_answer.push(String.fromCharCode(item))
        })
        if (this.compare(tmp_answer, this.data.answer)) {
            wx.request({
                url: getApp().globalData.url + '/api/finish_test',
                data: {
                    user_id: app.globalData.userInfo['openid'],
                    province: province
                },
                method: 'POST',
                header: {
                    'content-type': 'application/json' //默认值
                },
                success: function (res) {
                    console.log(res.data)
                },
                fail: function (res) {
                    console.log(res.data)
                }
            })
            wx.showToast({
                title: '答案正确',
                mask: true
            })
            setTimeout(function () {
                wx.navigateBack()
            }, 1500)
        } else {
            wx.showToast({
                title: '答案错误',
                icon: 'none',
                mask: true
            })
            setTimeout(function () {
                wx.navigateBack()
            }, 1500)
        }
    },

    judge: function () {
        const data = this.data
        for (let index = 0; index < data.test_list.length; index++) {
            if (typeof (data.user_answer[index]) == 'undefined') {
                return true
            }
        }
        return false
    },

    compare: function (a, b) {
        for (let index = 0; index < a.length; index++) {
            if (a[index] !== b[index]) {
                return false
            }
        }
        return true
    },

    soundOpt: function () {
        let flag = this.data.sound
        this.setData({
            sound: !flag
        })
        app.soundOpt()
    },

    rightOpt: function () {
        let data = this.data
        let list = []
        for(let index = 0; index < data.answer.length; index++) {
            let i = data.answer[index].charCodeAt() - 'A'.charCodeAt()
            if(data.user_answer[index] !== i) {
                list.push({
                    index: index,
                    title: data.test_list[index].question,
                    answer: data.test_list[index].options[i]
                })
            }
        }
        this.setData({
            emit_list: list
        })
    }
})
