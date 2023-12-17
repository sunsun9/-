const app = getApp()
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'

Page({
  data: {
    avatarUrl: defaultAvatarUrl,
  },
  onChooseAvatar(e) {
    const { avatarUrl } = e.detail 
    this.setData({
      avatarUrl,
    })
  },
  
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
          url: 'http://192.168.43.248:8080/manage/adduser',
          data: {
            account: this.globalData.openid,
            password: this.globalData.openid,
            name: ""
          },
          method: 'POST',
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: res => {
            // 一般在这一打印下看看是否拿到数据
            console.log(res.data)
          }
        })
      }
    })
    
  },

  //前往美食收藏界面
  go_collection: function(){
    var id = 1
    wx.navigateTo({
      url: '/packageA/pages/collection/collection?id=' + id,
    })
  },

  //前往店铺收藏界面
  go_shopcollection: function(){
    var id = 2
    wx.navigateTo({
      url: '/packageA/pages/collection/collection?id=' + id,
    })
  },

  //前往我的客服界面
  go_shop: function(){
    wx.navigateTo({
      url: '/packageA/pages/shop/shop'
    })
  },

  //前往我的客服界面
  go_kefu: function(){
    wx.navigateTo({
      url: '/packageA/pages/kefu/kefu'
    })
  }
})
