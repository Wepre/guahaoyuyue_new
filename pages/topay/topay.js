const db = wx.cloud.database();
const _ = db.command;
Page({
  data: {
    id: '',
    res: {}
  },
  onSubmit() {
    wx.showLoading({
      title: '正在操作',
    })
    var id = wx.getStorageSync('loginmsg')._id
    db.collection('user').doc(id).get().then(res => {
      console.log(res);
      this.setData({
        currentMoney: res.data.money
      })
    })
    wx.cloud.callFunction({
      name: "updateghpaybyid",
      data: {
        id: this.data.id
      }
    }).then(res => {
      console.log(res)

      const amountToSubtract = parseInt(this.data.res.price) // 假设 event 中传递了要减去的金额

      // 获取当前用户的余额


      console.log(this.data.currentMoney);
      console.log(parseInt(this.data.currentMoney) < amountToSubtract);

      // 检查余额是否足够
      if (parseInt(this.data.currentMoney) < amountToSubtract) {
        // 余额不足，返回错误信息
        wx.showToast({
          title: '余额不足，请先充值',
          icon:'none'
        })
       setTimeout(() => {
         wx.navigateTo({
           url: '../alterMsg/addmoney',
         })
       }, 2000);
        return
      }

      // 余额足够，执行更新操作
      db.collection('user').doc(id).update({
        data: {
          money: _.inc(-amountToSubtract) // 使用数据库操作符来减去金额
        }
      })
      wx.hideLoading()
      wx.showToast({
        title: '支付完成',
      })
      setTimeout(() => {
        wx.switchTab({
          url: '../server/server',
        })
      }, 2000);
    })
  },
  onLoad(e) {
    wx.showLoading({
      title: '正在加载',
    })
    var id = e.id
    // var id='ff3a195863e082e601c6cc83722dd78f'
    this.setData({
      id: id
    })
    wx.cloud.callFunction({
      name: "getghbyid",
      data: {
        id: id
      }
    }).then(res => {
      console.log(res)
      this.setData({
        res: res.result.data
      })
      wx.hideLoading()
    })

  }
})