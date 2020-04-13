const app_data = getApp().globalData
let SocketTask = null

Page({

    /**
     * 页面的初始数据
     */
    data: {
        focus: false,
        inputValue: '',
        content_list: [
            {
                user_name: null,
                is_my: true,
                content: '哈哈哈哈今天去哪里哈哈哈哈今天去哪里啊哈哈哈哈今天去哪里啊哈哈哈哈今天去哪里啊哈哈哈哈今天去哪里啊哈哈哈哈今天去哪里啊哈哈哈哈今天去哪里啊哈哈哈哈今天去哪里啊哈哈哈哈今天去哪里啊啊',
                time: '11-29 12:27'
            },
            {
                user_name: '假的枫梓。',
                is_my: false,
                content: '我先去你家我先去你家的我先去你家的我先去你家的我先去你家的我先去你家的我先去你家的我先去你家的的',
                time: '11-29 13:32'
            }
        ],
        my_avatar: 'https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLWCFP2QI1x7JjuSoCgVEkyY6TGRnTpOUhibBfmqIn9mS5C3eDWvJ9OfU4iaooVQdAF0RVfK9OEbUkQ/132',
        other_avatar: null,
        scrollTop: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.webSocket()
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        SocketTask.onOpen(res => {
            console.log('监听 WebSocket 连接打开事件。', res)
        })
        SocketTask.onClose(onClose => {
            console.log('监听 WebSocket 连接关闭事件。', onClose)
            this.webSocket()
        })
        SocketTask.onError(onError => {
            console.log('监听 WebSocket 错误。错误信息', onError)
        })
        SocketTask.onMessage(msg => {
            console.log('监听WebSocket 接收信息。', JSON.parse(msg.data))
            console.log(app_data.userInfo)
            let data = JSON.parse(msg.data)
            data['time'] = this.time(data['time'])
            if (data['user_name'] !== app_data.userInfo['nickName']) {
                data.is_my = false
                this.pushMessage(data, false)
            }
        })
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
    webSocket: function () {
        // 创建Socket
        SocketTask = wx.connectSocket({
            url: 'wss://www.cultureinnovation.top' + app_data.chat_url + 'room/wss',
            data: 'data',
            header: {
                'content-type': 'application/json'
            },
            method: 'POST',
            success: function (res) {
                console.log('WebSocket连接创建', res)
            },
            fail: function (err) {
                wx.showToast({
                    title: '网络异常！',
                })
                console.log(err)
            },
        })
    },
    submitTo: function () {
        let message = {
            user_name: app_data.userInfo['nickName'],
            user_id: app_data.userInfo['openid'],
            is_my: true,
            content: this.data.inputValue,
            time: Date.parse(new Date()) / 1000
        }
        this.pushMessage(message, true)
        this.sendSocketMessage(message)
        wx.createSelectorQuery().select('#all').boundingClientRect(function(rect){
            // 使页面滚动到底部
            wx.pageScrollTo({
                scrollTop: rect.bottom
            })
        }).exec()
    },
    bindKeyInput: function (e) {
        this.setData({
            inputValue: e.detail.value
        })
    },
    sendSocketMessage: function (msg) {
        SocketTask.send({
            data: JSON.stringify(msg)
        }, function (res) {
            console.log('已发送', res)
        })
    },
    pushMessage: function (msg, is_my) {
        msg['time'] = this.time(msg['time'])
        this.data.content_list.push(msg)
        if (is_my) {
            this.setData({
                content_list: this.data.content_list,
                inputValue: '',
                focus: true
            })
        } else {
            this.setData({
                content_list: this.data.content_list
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
        return month + '-' + day + ' ' + hour + ':' + minute;
    },
    addZero(number) {
        if (number < 10) {
            return '0' + number;
        } else {
            return number;
        }
    }
})
