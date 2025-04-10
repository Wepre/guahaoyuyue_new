const db = wx.cloud.database();
const _ = db.command;
Page({
  data: {
    list: []
  },
  topay(e) {
    console.log(e)
    var ispay = e.currentTarget.dataset.ispay
    var id = e.currentTarget.dataset.id
    if (ispay) {
      wx.showToast({
        title: '已支付',
        icon: "none"
      })
    } else {
      wx.navigateTo({
        url: '../topay/topay?id=' + id,
      })
    }
  },
  delete(e) {
    var ispay = e.currentTarget.dataset.ispay
    var price = e.currentTarget.dataset.price
    wx.showModal({
      title: '提示',
      content: '是否取消',
      complete: (res) => {
        if (res.cancel) {

        }

        if (res.confirm) {
          wx.showLoading({
            title: '正在操作',
          })
          var id = e.currentTarget.dataset.id
          //如果是支付了的状态，就需要返回钱。
          if (ispay) {
            var loginid = wx.getStorageSync('loginmsg')._id
            db.collection('user').doc(loginid).update({
              data: {
                money: _.inc(price) // 使用数据库操作符来加金额
              }
            })            
          }
          db.collection("guahao").doc(id).remove().then(res => {
            wx.showToast({
              title: "已取消",
              icon: "none"
            })
            this.onLoad()
          })

        }
      }
    })
    console.log(e)

  },
  onLoad() {
    wx.showLoading({
      title: '正在加载',
    })
    wx.cloud.callFunction({
      name: "getallguahaobyid",
      data: {
        userid: wx.getStorageSync('loginmsg')._id
      }
    }).then(res => {
      console.log(res)
      this.setData({
        list: res.result.data.reverse()
      })
      wx.hideLoading()
    })
  }
})