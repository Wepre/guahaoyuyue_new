const db = wx.cloud.database()
// pages/alterMsg/alterMsg.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    res: {},
    date: '2002-01-22',
    picker: ['男', '女'],
    index: 0
  },
  tomoney(e) {
    wx.navigateTo({
      url: '../addmoney/addmoney',
    })
  },
  PickerChange(e) {
    console.log(e);
    this.setData({
      index: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  DateChange(e) {
    this.setData({
      date: e.detail.value
    })
  },
  onLoad(options) {

  },
  submit(e) {
    console.log(e)
    wx.showLoading({
      title: '正在修改',
    })

    var form = e.detail.value
    console.log(form.add)
    var userid = this.data.res._id
    var date = this.data.date
    wx.showModal({
      title: '提示',
      content: '是否要进行充值',
      complete: (res) => {
        if (res.cancel) {
          wx.hideLoading()
        }

        if (res.confirm) {
          db.collection('user').doc(userid).update({
            data: {
              money: parseInt(this.data.res.money || 0) + parseInt(form.add)
            }
          }).then(res => {
            // 写缓存 
            wx.showToast({
              title: '充值成功',
              icon: 'none'
            })
            wx.navigateBack({
              delta: "1"
            })
          })
        }
      }
    })

  },
  onShow() {
    wx.showLoading({
      title: '正在加载',
    })
    var id = wx.getStorageSync('loginmsg')._id
    db.collection("user").doc(id).get().then(res => {
      wx.hideLoading()
      this.setData({
        res: res.data,
      })
    })

  },
})