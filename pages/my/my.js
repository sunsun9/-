const app = getApp()
Page({
  globalData:{
    openid:null
  },
  onLoad: function(){
    wx.request({
      url: 'http://127.0.0.1:3000/session',
      data: { token: app.globalData.token },
      success: res => {
        this.globalData.openid = res.data.openid.openid
        console.log(res.data.openid.openid)
        // 插入数据到数据库中
        wx.request({
          // 注意，如果小程序开启校验合法域名时必须使用https协议
          //在测试的情况下可以不开启域名校验
          url: 'http://10.135.132.28:8080/manage/adduser',
          data: {
            // 接口设置的固定参数值
            account: this.openid,
            password: this.openid,
            name: ""
          },
          // 请求的方法
          method: 'POST',
          header: {
            'content-type': 'application/json' // 默认值
          },
          // 请求成功时的处理
          success: res => {
            // 一般在这一打印下看看是否拿到数据
            console.log(res.data)
          }
        })
      }
    })
    
  },

  //前往收藏界面
  go_collection: function(){
    console.log("aaa")
    wx.navigateTo({
      url: '/packageA/pages/collection/collection'
    })
  }
})
