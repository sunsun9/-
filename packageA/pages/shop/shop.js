const app = getApp()
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'

Page({
  data: {
    avatarUrl: defaultAvatarUrl,
    flag: null,   //记录是否有账号.false表示没有，true表示有
    openid: null,
    name: null,
    address: null,
    longitude: null,
    latitude: null,
    foodList: []

  },
  onChooseAvatar(e) {
    const { avatarUrl } = e.detail 
    this.setData({
      avatarUrl,
    })
  },
  onLoad: function(){
    //判断账号是否注册店家
    wx.request({
      url: 'http://192.168.43.248:3000/session',
      data: { token: app.globalData.token },
      success: res => {
        this.data.openid = res.data.openid.openid
        console.log(res.data.openid.openid)
        wx.request({
          url: 'http://192.168.43.248:8080/query/getShopStateByAccount',
          data: {
            account: 2,
          },
          method: 'POST',
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: res => {
            this.setData({
              flag: res.data
            })
             //用户已注册成为商家
            if(res.data == true){
              wx.request({
                url: 'http://192.168.43.248:8080/query/getFoodByAccount',
                data: {
                  account: this.data.openid,
                },
                method: 'POST',
                header: {
                  'content-type': 'application/json' // 默认值
                },
                success: res => {
                  for(var i=0;i<res.data.data.length;i++)
                    {
                      var newarray = {
                        id:res.data.data[i].id,
                        name:res.data.data[i].name,
                        shop_id:res.data.data[i].shop_id,
                        img: "https://gitee.com/sun1123/images1/raw/master/" + res.data.data[i].id +".jpg",
                        hits: res.data.data[i].hits
                      };        
                      this.data.foodList = this.data.foodList.concat(newarray);
                      this.setData({
                        foodList: this.data.foodList
                      });     
                    }  
                }
              })
            }
          }
        })
      }
    })
  },

  /*  获取前端input信息  */
  //1.店名信息
  getName: function(e){
    console.log(e.detail.value)
    this.setData({
      name: e.detail.value
    })
  },
  //2.地址信息
  getAddress: function(e){
    this.setData({
      address: e.detail.value
    })
  },
  //3.经度信息
  getLongitude: function(e){
    this.setData({
      longitude: e.detail.value
    })
  },
  //4.纬度信息
  getLatitude: function(e){
    this.setData({
      latitude: e.detail.value
    })
  },

  //1.注册商家
  zhuce: function(){
    wx.request({
      url: 'http://192.168.43.248:8080/manage/addshop',
      data: {
        account: this.data.openid,
        password: this.data.openid,
        name: this.data.name,
        address: this.data.address,
        longitude: this.data.longitude,
        latitude: this.data.latitude
      },
      method: 'POST',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: res => {
        console.log(res.data)
      }
    })
  },

  //2.删除食物
  remove: function(e){
    var id = parseInt(e.currentTarget.id)
    wx.request({
      url: 'http://192.168.43.248:8080/manage/deleteFood',
      data: {
        id: id
      },
      method: 'POST',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: res => {
        console.log(res.data)
      }
    })
  }
  
})