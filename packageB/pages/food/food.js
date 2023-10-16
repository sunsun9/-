// pages/food/food.js
const app = getApp()
Page({
  data: {
    name: '',
    id: '',
    foodList: [],
    openid: null
  },

  onLoad:function(e){
    this.setData({
      name: e.name,
      id: e.id
    })

    var that = this
    wx.request({
      url: 'http://192.168.43.248:3000/session',
      data: { token: app.globalData.token },
      success: res => {
        // console.log(res.data)
        this.setData({
          openid:res.data.openid.openid
        })

        //根据id查找商店
        wx.request({
          // 注意，如果小程序开启校验合法域名时必须使用https协议
          //在测试的情况下可以不开启域名校验
          url: 'http://192.168.43.248:8080/query/getFoodByShopId',
          data: {
            // 接口设置的固定参数值
            id: this.data.id,
            user_id: this.data.openid
          },
          // 请求的方法
          method: 'POST',
          header: {
            'content-type': 'application/json' // 默认值
          },
          // 请求成功时的处理
          success: res => {
            // console.log(res.data.data)
            for(var i=0;i<res.data.data.length;i++)
            {
              var newarray = {
                id:res.data.data[i].id,
                name:res.data.data[i].name,
                shop_id:res.data.data[i].shop_id,
                img: "https://gitee.com/sun1123/images/raw/master/" + res.data.data[i].id +".jpg",
                flag: res.data.data[i].flag
              };        
              that.data.foodList = that.data.foodList.concat(newarray);
              that.setData({
                foodList: that.data.foodList
              });             
            }
            // console.log(that.data.foodList)
          }
        })
      }
    })  
  },

  collection: function(e){
    var id = parseInt(e.currentTarget.id)
    console.log(e.currentTarget)
    //根据id得到元素所在位置
    let index = this.data.foodList.findIndex( item => item.id == id);
    console.log(index)//打印元素所在位置
    if(this.data.foodList[index].flag == false){
      this.setData({
        ['foodList[' + index +'].flag'] : true
      }) 
      
      //在数据库中添加记录          
      //添加收藏数据
      wx.request({
      // 注意，如果小程序开启校验合法域名时必须使用https协议
      //在测试的情况下可以不开启域名校验
        url: 'http://192.168.43.248:8080/manage/addfavorite',
        data: {
        // 接口设置的固定参数值
          food_id: id,
          user_id: this.data.openid
        },
        // 请求的方法
        method: 'POST',
        header: {
          'content-type': 'application/json' // 默认值
        },
        // 请求成功时的处理
        success: res => {
          console.log(res.data)
        }
      })
    }
    else{
      this.setData({
        ['foodList[' + index +'].flag'] : false
      })

      //删除数据库记录
      
      wx.request({
        // 注意，如果小程序开启校验合法域名时必须使用https协议
        //在测试的情况下可以不开启域名校验
        url: 'http://192.168.43.248:8080/manage/deleteFavorite',
        data: {
          // 接口设置的固定参数值
          food_id: id,
          user_id: this.data.openid
        },
        // 请求的方法
        method: 'POST',
        header: {
           'content-type': 'application/json' // 默认值
        },
        // 请求成功时的处理
        success: res => {
          console.log(res.data)
        }
      })
    }
  }
})