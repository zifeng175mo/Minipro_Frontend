// pages/community/community.js
let page = 0
let total_page = 1
const app = getApp()
const app_data = getApp().globalData

Page({

    /**
     * 页面的初始数据
     */
    data: {
        focus: false,
        inputValue: null,
        content_list: [],
        my_avatar: 'https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLWCFP2QI1x7JjuSoCgVEkyY6TGRnTpOUhibBfmqIn9mS5C3eDWvJ9OfU4iaooVQdAF0RVfK9OEbUkQ/132',
        other_avatar: null
    },

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
        page = 0
        total_page = 1
        this.setData({
            content_list: []
        })
        this.getData()
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
        let that = this;
        // 显示加载图标
        if (page + 1 > total_page) {
            wx.showToast({
                title: '以上是全部了！',
                mask: true
            })
        } else {
            wx.showLoading({
                title: '加载中',
                mask: true
            })
            wx.request({
                url: app_data.url + '/api/get_dynamics/',
                data: {
                    id: app_data.userInfo['openid'],
                    page: page
                },
                method: 'GET',
                success: res => {
                    const data = res.data['data']
                    data.forEach((item) => {
                        item['time'] = that.time(item['time'])
                    })
                    let list = this.data.content_list.concat(data)
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

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },

    getData: function () {
      let that = this;
      // 显示加载图标
      if (page + 1 > total_page) {
        wx.showToast({
          title: '以上是全部了！',
          mask: true
        })
      } else {
        wx.showLoading({
          title: '加载中',
          mask: true
        })
        wx.request({
          url: app_data.url + '/api/get_dynamics/',
          data: {
            id: app_data.userInfo['openid'],
            page: page
          },
          method: 'GET',
          success: res => {
            const data = res.data['data']
            data.forEach((item) => {
              item['time'] = that.time(item['time'])
            })
            let list = this.data.content_list.concat(data)
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

          }
        })
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
        return year + '-' + month + '-' + day + ' ' + hour + ':' + minute;
    },
    addZero(number) {
        if (number < 10) {
            return '0' + number;
        } else {
            return number;
        }
    }
})
