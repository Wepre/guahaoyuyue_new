// app.js
App({
 onLaunch(){
 
  wx.cloud.init({
    env:'cloud1-7gphjc0619ad88e4'
  })
  
 },
    globalData:{
        booktype:["骨科","精神科","神经科"],
        workplace:[]
    }
})
