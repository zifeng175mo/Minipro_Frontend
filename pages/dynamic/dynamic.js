// // pages/dynamic/dynamic.js
// const app_data = getApp().globalData
//
// Page({
//
//     /**
//      * 页面的初始数据
//      */
//     data: {
//         imgs: [],
//         InputValue: '',
//         text_len: 0,
//         full: false
//     },
//
//     /**
//      * 生命周期函数--监听页面加载
//      */
//     onLoad: function (options) {
//
//     },
//
//     /**
//      * 生命周期函数--监听页面初次渲染完成
//      */
//     onReady: function () {
//
//     },
//
//     /**
//      * 生命周期函数--监听页面显示
//      */
//     onShow: function () {
//
//     },
//
//     /**
//      * 生命周期函数--监听页面隐藏
//      */
//     onHide: function () {
//
//     },
//
//     /**
//      * 生命周期函数--监听页面卸载
//      */
//     onUnload: function () {
//
//     },
//
//     /**
//      * 页面相关事件处理函数--监听用户下拉动作
//      */
//     onPullDownRefresh: function () {
//
//     },
//
//     /**
//      * 页面上拉触底事件的处理函数
//      */
//     onReachBottom: function () {
//
//     },
//
//     /**
//      * 用户点击右上角分享
//      */
//     onShareAppMessage: function () {
//
//     },
//     bindKeyInput: function (e) {
//         this.setData({
//             InputValue: e.detail.value,
//             text_len: e.detail.value.length,
//             full: false
//         })
//         if (e.detail.value.length >= 400) {
//             this.setData(
//                 {
//                     full: true
//                 })
//         }
//     },
//     cancel: function () {
//         wx.navigateBack()
//     },
//     add: function () {
//         let that = this
//         if(that.data.InputValue === '' && that.data.imgs === []) {
//             wx.showToast({
//                 title: '添加失败，稍后重试',
//                 mask: true
//             })
//         }
//         wx.request({
//             url: app_data.url + '/api/add_dynamic/',
//             data: {
//                 user_id: app_data.userInfo['openid'],
//                 text: that.data.InputValue
//             },
//             method: 'POST',
//             success: res => {
//                 const added_id = res.data['id']
//                 for (let index = 0; index < that.data.imgs.length; index++) {
//                     wx.uploadFile({
//                         url: app_data.url + '/api/upload_image/',
//                         filePath: that.data.imgs[index],//要上传文件资源的路径 String类型
//                         name: 'image',
//                         header: {
//                             "Content-Type": "multipart/form-data"//记得设置
//                         },
//                         formData: {
//                             id: JSON.stringify(added_id)
//                         },
//                         success: function(res) {
//                             console.log(res.data)
//                         }
//                     })
//                 }
//                 that.clear()
//                 wx.navigateBack()
//             },
//             fail: res => {
//                 wx.showToast({
//                     title: '添加失败，稍后重试',
//                     mask: true
//                 })
//             }
//         })
//     },
//     clear: function () {
//         this.setData({
//             InputValue: '',
//             full: false,
//             text_len: 0,
//             imgs: []
//         })
//     },
//     previewImage: function (e) {
//         let index = e.currentTarget.dataset.index;
//         //所有图片
//         let imgs = this.data.imgs;
//         wx.previewImage({
//             //当前显示图片
//             current: imgs[index],
//             //所有图片
//             urls: imgs
//         })
//     },
//     chooseImage: function () {
//         let that = this
//         wx.chooseImage({
//             // count: 1, // 默认9
//             sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
//             sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
//             success: function (res) {
//                 // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
//                 let tempFilePaths = res.tempFilePaths;
//                 let imgs = that.data.imgs;
//                 // console.log(tempFilePaths + '----');
//                 for (let i = 0; i < tempFilePaths.length; i++) {
//                     if (imgs.length >= 9) {
//                         that.setData({
//                             imgs: imgs
//                         });
//                         return false;
//                     } else {
//                         imgs.push(tempFilePaths[i]);
//                     }
//                 }
//                 // console.log(imgs);
//                 that.setData({
//                     imgs: imgs
//                 });
//             }
//         })
//     }
// })
